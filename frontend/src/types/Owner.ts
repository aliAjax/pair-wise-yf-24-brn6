/** 负责人：可被批量指派为风险条目的接手人。 */
export interface Owner {
  id: number;
  name: string;
  team: string;
  active: boolean;
}
