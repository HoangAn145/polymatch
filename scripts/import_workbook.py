"""Convert a local workbook into PRIVATE JSON/SQL files; never upload automatically.
Usage: python scripts/import_workbook.py FILE.xlsx --out /private/path
Requires only the Python standard library. Workbook cells are data, never code.
"""
import argparse
import json
import posixpath
import zipfile
import xml.etree.ElementTree as E
from datetime import datetime, timedelta
from pathlib import Path

args = argparse.ArgumentParser(description=__doc__)
args.add_argument('workbook', type=Path)
args.add_argument('--out', type=Path, default=Path('private-data'))
options = args.parse_args()
options.out.mkdir(parents=True, exist_ok=True)
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(options.workbook) as archive:
    strings = [''.join(x.itertext()) for x in E.fromstring(archive.read('xl/sharedStrings.xml')).findall('s:si', ns)] if 'xl/sharedStrings.xml' in archive.namelist() else []
    rels = {r.attrib['Id']: r.attrib['Target'] for r in E.fromstring(archive.read('xl/_rels/workbook.xml.rels'))}
    data = {}
    for sheet in E.fromstring(archive.read('xl/workbook.xml')).findall('s:sheets/s:sheet', ns):
        target = rels[sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']]
        path = target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/' + target)
        rows = []
        for row in E.fromstring(archive.read(path)).findall('s:sheetData/s:row', ns):
            cells = {}
            for cell in row.findall('s:c', ns):
                value = cell.findtext('s:v', '', ns)
                if cell.attrib.get('t') == 's':
                    value = strings[int(value)] if value else ''
                elif cell.attrib.get('t') == 'inlineStr':
                    value = ''.join(cell.find('s:is', ns).itertext())
                cells[''.join(x for x in cell.attrib['r'] if x.isalpha())] = value
            rows.append(cells)
        if len(rows) < 3:
            continue
        headers = rows[2]
        records = []
        for row in rows[3:]:
            if not row.get('A'):
                continue
            record = {title: row.get(col, '') for col, title in headers.items() if title}
            for key, value in record.items():
                if 'Ngày' in key and value:
                    try:
                        record[key] = (datetime(1899, 12, 30) + timedelta(days=float(value))).date().isoformat()
                    except ValueError:
                        pass
            records.append(record)
        data[sheet.attrib['name']] = records

(options.out / 'chatbotWorkbook.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
def quote(value):
    return "'" + str(value).replace("'", "''") + "'"
statements = ['-- PRIVATE DATA. Import through Supabase SQL Editor; do not commit this file.', 'begin;']
for category in ['FAQ_CSKH', 'Logistics', 'Cong_nghe_CDS', 'Thi_truong']:
    for row in data.get(category, []):
        title = row.get('Câu hỏi chuẩn') or row.get('Thuật ngữ') or row.get('Công nghệ') or row.get('Chỉ tiêu/nội dung') or row.get('ID', '')
        source = row.get('Nguồn') or row.get('URL nguồn') or ''
        content = '\n'.join(f'{key}: {value}' for key, value in row.items() if value)
        values = [quote(v) for v in [row['ID'], category, title, content, source, row.get('Trạng thái', '')]]
        values.append(quote(json.dumps(row, ensure_ascii=False)) + '::jsonb')
        statements.append('insert into public.knowledge_documents(id,category,title,content,source,source_status,metadata) values(' + ','.join(values) + ') on conflict(id) do nothing;')
statements.append('commit;')
(options.out / 'knowledge_seed.sql').write_text('\n'.join(statements) + '\n', encoding='utf-8')
print(json.dumps({'sheets': {key: len(value) for key, value in data.items()}, 'output': str(options.out)}, ensure_ascii=False))
