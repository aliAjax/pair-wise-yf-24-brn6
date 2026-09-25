/**
 * 接手见证：已确认条目交接时，由接手人确认原结论继续有效。
 * 见证文字与时间会随条目一起保留，后续清单与负责人视图均可查看。
 */
export interface HandoverWitness {
  record_id: number;
  from_owner_id: number | null;
  to_owner_id: number;
  to_owner_name: string;
  note: string;
  handed_over_at: string;
}
