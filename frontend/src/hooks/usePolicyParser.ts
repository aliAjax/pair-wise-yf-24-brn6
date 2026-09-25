export interface ParsedSection {
  heading: string;
  content: string;
}

const SECTION_PATTERNS = [
  /^\s*第[一二三四五六七八九十百零\d]+条/,
  /^\s*\d+(?:\.\d+)*[\s、.．]/,
  /^\s*[一二三四五六七八九十]+[、.]/
];

/** 极简政策分段：按行扫描，命中条款编号则新开一段，其余内容并入当前段。 */
export function parsePolicyText(raw: string): ParsedSection[] {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sections: ParsedSection[] = [];
  for (const line of lines) {
    const isHeading = SECTION_PATTERNS.some((pattern) => pattern.test(line));
    if (isHeading) {
      sections.push({ heading: line, content: "" });
    } else if (sections.length > 0) {
      sections[sections.length - 1].content += `${line}\n`;
    } else {
      sections.push({ heading: "正文", content: `${line}\n` });
    }
  }
  return sections;
}

export function usePolicyParser() {
  return { parseSections: parsePolicyText };
}
