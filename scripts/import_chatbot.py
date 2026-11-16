"""Convert user workbook to draft-only JSON/SQL; never executes cells or opens URLs."""
import argparse,hashlib,json,re,warnings
from pathlib import Path
from datetime import date,datetime
from urllib.parse import urlparse
from collections import Counter
import openpyxl
TITLES={'FAQ_CSKH':['Câu hỏi chuẩn'],'Logistics':['Thuật ngữ','Chủ đề'],'Cong_nghe_CDS':['Công nghệ','Nhóm'],'Thi_truong':['Chỉ tiêu/nội dung','Chủ đề']}
OTHER={'Nguon_tin':'source','Chuyen_tiep_CSKH':'handoff'}
def val(v):
 if isinstance(v,(date,datetime)): return v.isoformat()
 if isinstance(v,float) and v.is_integer(): return str(int(v))
 return str(v).strip() if v is not None else ''
def literal(v):return "'"+str(v).replace("'","''")+"'"
def js(v):return literal(json.dumps(v,ensure_ascii=False))+'::jsonb'
def convert(source,output):
 digest=hashlib.sha256(source.read_bytes()).hexdigest();docs=[];refs=[];cases=[];counts={};ids=set()
 with warnings.catch_warnings():
  warnings.simplefilter('ignore',UserWarning);book=openpyxl.load_workbook(source,read_only=True,data_only=True)
  if set(book.sheetnames)!=set(TITLES)|set(OTHER)|{'Test_chatbot'}:raise ValueError('Unexpected sheets')
  for sheet in book:
   rows=sheet.iter_rows(values_only=True);next(rows);next(rows);headers=[val(v) for v in next(rows)];count=0
   for number,cells in enumerate(rows,4):
    if not cells or not val(cells[0]):
     if any(val(v) for v in cells):raise ValueError(f'Missing ID: {sheet.title}:{number}')
     continue
    identity=val(cells[0]);row={h:val(cells[i]) for i,h in enumerate(headers) if h and i<len(cells)}
    if identity in ids or not re.fullmatch(r'[A-Z]+\d{3,}',identity):raise ValueError('Invalid or duplicate ID')
    ids.add(identity);count+=1;origin={'file':source.name,'sha256':digest,'sheet':sheet.title,'row':number}
    if sheet.title in TITLES:
     title=' · '.join(row.get(k,'') for k in TITLES[sheet.title] if row.get(k));content='\n'.join(f'{k}: {v}' for k,v in row.items() if v and k not in {'ID','Trạng thái','Người duyệt','Người xác minh'})
     if not title or not row.get('Trạng thái') or len(content)>15000:raise ValueError(f'Invalid knowledge: {identity}')
     urls=[]
     for key in ['Nguồn','URL nguồn']:
      for match in re.findall(r'https://[^\s;<>"\[\]]+',row.get(key,'')):
       url=match.rstrip('.,)');parsed=urlparse(url)
       if parsed.hostname and not parsed.username and not parsed.password and url not in urls:urls.append(url)
     docs.append({'external_id':identity,'title':title,'content':content,'kind':'knowledge','published':False,'review_status':row['Trạng thái'],'source_sheet':sheet.title,'source_references':urls,'url':urls[0] if urls else None,'metadata':{'origin':origin,'fields':row}})
    elif sheet.title=='Test_chatbot':cases.append({'external_id':identity,'fields':row,'origin':origin})
    else:refs.append({'external_id':identity,'category':OTHER[sheet.title],'data':{'fields':row,'origin':origin},'approved':False})
   counts[sheet.title]=count
  book.close()
 output.mkdir(parents=True,exist_ok=True);manifest={'source_file':source.name,'sha256':digest,'counts':counts,'knowledge_count':len(docs),'reference_count':len(refs),'evaluation_count':len(cases),'published_count':0,'status_counts':dict(Counter(d['review_status'] for d in docs))}
 for name,value in [('manifest',manifest),('knowledge-drafts',docs),('reference-data',refs),('evaluation-cases',cases)]: (output/(name+'.json')).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 sql=['-- Generated draft-only import. Existing IDs are never overwritten.','begin;']
 for d in docs:
  keys=['external_id','title','content','kind','review_status','source_sheet'];sql.append('insert into public.pm_knowledge('+','.join(keys)+',published,url,source_references,metadata) values ('+','.join(literal(d[k]) for k in keys)+',false,'+(literal(d['url']) if d['url'] else 'null')+','+js(d['source_references'])+','+js(d['metadata'])+') on conflict(external_id) do nothing;')
 for r in refs:sql.append('insert into public.pm_reference(external_id,category,data,approved) values ('+literal(r['external_id'])+','+literal(r['category'])+','+js(r['data'])+',false) on conflict(external_id) do nothing;')
 sql.append('commit;');(output/'import-drafts.sql').write_text('\n'.join(sql)+'\n',encoding='utf8');print(json.dumps(manifest,ensure_ascii=False))
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('workbook',type=Path);parser.add_argument('--output',type=Path,default=Path('data/chatbot'));args=parser.parse_args();convert(args.workbook,args.output)
