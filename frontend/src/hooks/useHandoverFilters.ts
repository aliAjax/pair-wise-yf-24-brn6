import { computed, ref } from "vue";
import type { RiskCategory } from "../types/RiskCategory";
import { RiskCategoryOrder } from "../constants/RiskCategory";
import type { RiskItem } from "../types/RiskItem";
import { selectHandoverCandidates } from "../services/handoverService";

/**
 * 交接台筛选状态：分类多选 + 原负责人（含未分配），
 * 候选条目与勾选集合在 hook 内维护，页面只负责提交。
 */
export function useHandoverFilters(items: () => RiskItem[]) {
  const selectedCategories = ref<RiskCategory[]>([...RiskCategoryOrder]);
  const fromOwnerId = ref<number | null>(null);
  const includeUnassigned = ref<boolean>(true);
  const selectedRiskIds = ref<number[]>([]);
  const toOwnerId = ref<number | null>(null);
  const handoverNote = ref<string>("");

  const candidates = computed(() =>
    selectHandoverCandidates(items(), {
      categories: selectedCategories.value,
      fromOwnerId: fromOwnerId.value,
      includeUnassigned: includeUnassigned.value
    })
  );

  const allSelected = computed(
    () =>
      candidates.value.length > 0 &&
      candidates.value.every((item) => selectedRiskIds.value.includes(item.id))
  );

  function toggleAll(checked: boolean) {
    selectedRiskIds.value = checked ? candidates.value.map((item) => item.id) : [];
  }

  function toggleOne(id: number, checked: boolean) {
    if (checked) {
      if (!selectedRiskIds.value.includes(id)) selectedRiskIds.value.push(id);
    } else {
      selectedRiskIds.value = selectedRiskIds.value.filter((value) => value !== id);
    }
  }

  function resetSelection() {
    selectedRiskIds.value = [];
    handoverNote.value = "";
    toOwnerId.value = null;
  }

  return {
    selectedCategories,
    fromOwnerId,
    includeUnassigned,
    selectedRiskIds,
    toOwnerId,
    handoverNote,
    candidates,
    allSelected,
    toggleAll,
    toggleOne,
    resetSelection
  };
}
