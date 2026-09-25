export const formatDate = (value: string) => new Date(value).toLocaleString("zh-CN");
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) => ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);

const statusMeta: Record<string, string> = {
  OPEN: "待处理",
  CONFIRMED: "已确认",
  IGNORED: "已忽略",
  RESOLVED: "已解决"
};

/** 交接台统一使用中文状态文案，旧页面仍可回退到下划线替换。 */
export const formatReviewStatus = (value: string): string => statusMeta[value] ?? formatStatus(value);

export const formatDateTimeOrDash = (value: string | null): string =>
  value ? formatDate(value) : "—";

export const truncate = (value: string, max = 48): string =>
  value.length > max ? `${value.slice(0, max)}…` : value;
