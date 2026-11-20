/** Workbook cells are evidence, never model instructions. Keep editorial fields out of answers. */
const FIELD = /^([\p{L}][\p{L}\p{N} /()–_-]{0,79}):\s*(.*)$/u;
export function knowledgeSections(material: string) {
  const sections: Record<string, string> = {};
  let current = "";
  for (const line of material.split(/\r?\n/)) {
    const match = FIELD.exec(line);
    if (match) {
      current = match[1].toLocaleLowerCase("vi");
      sections[current] = match[2];
    } else if (current) sections[current] += "\n" + line;
  }
  return sections;
}
export function cleanKnowledgeMaterial(material: string) {
  const fields = knowledgeSections(material);
  const answer = fields["câu trả lời chuẩn"];
  if (!answer) {
    const excluded = new Set([
      "id",
      "nhóm",
      "nguồn",
      "url nguồn",
      "người duyệt",
      "ngày cập nhật",
      "trạng thái",
      "từ khóa",
      "http",
      "https",
    ]);
    const content = Object.entries(fields)
      .filter(([key]) => !excluded.has(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    return content || (Object.keys(fields).length ? "" : material);
  }
  return [
    fields["câu hỏi chuẩn"] && `Câu hỏi tham chiếu: ${fields["câu hỏi chuẩn"]}`,
    `Nội dung trả lời đã duyệt: ${answer}`,
    fields["ngoại lệ"] && `Điều kiện và giới hạn: ${fields["ngoại lệ"]}`,
  ]
    .filter(Boolean)
    .join("\n");
}
export function knowledgeExcerpt(material: string) {
  const fields = knowledgeSections(material);
  return (fields["câu trả lời chuẩn"] || cleanKnowledgeMaterial(material))
    .trim()
    .slice(0, 1600);
}
