export interface TextDiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
}

/** 基于逐行 LCS 的轻量文本对比，供左右对照视图标记增删行。 */
export function diffText(oldText: string, newText: string): TextDiffLine[] {
  const oldLines = oldText.split(/\r?\n/);
  const newLines = newText.split(/\r?\n/);
  const m = oldLines.length;
  const n = newLines.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      lcs[i][j] = oldLines[i] === newLines[j]
        ? lcs[i + 1][j + 1] + 1
        : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const result: TextDiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      result.push({ type: "unchanged", text: oldLines[i] });
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: "removed", text: oldLines[i] });
      i += 1;
    } else {
      result.push({ type: "added", text: newLines[j] });
      j += 1;
    }
  }
  while (i < m) result.push({ type: "removed", text: oldLines[i++] });
  while (j < n) result.push({ type: "added", text: newLines[j++] });
  return result;
}

export function useTextDiff() {
  return { diffText };
}
