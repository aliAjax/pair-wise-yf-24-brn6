<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { PolicyCategory, PolicyCategoryText } from "../../constants/PolicyCategory";
import { UNASSIGNED_OWNER, UNASSIGNED_OWNER_TEXT } from "../../constants/statusText";
import type { PolicyCategory as Category } from "../../types/PolicyCategory";
import { useHandoffStore } from "../../stores/HandoffStore";
import { HandoffControllerError } from "../../controllers/handoffController";

const emit = defineEmits<{ (e: "done", payload: { category: Category }): void }>();

const store = useHandoffStore();

const form = reactive<{
  categories: Category[];
  from_owner: string;
  to_owner: string;
  note: string;
}>({
  categories: ["DATA_COLLECTION"],
  from_owner: "",
  to_owner: "",
  note: ""
});

const errorMessage = ref("");
const successMessage = ref("");

// 候选交出方：未分配 + 各分类当前持有待办的负责人
const fromOwners = computed(() => {
  const owners = new Set<string>([UNASSIGNED_OWNER]);
  store.riskItems.forEach((item) => owners.add(item.assignee ?? UNASSIGNED_OWNER));
  return [...owners];
});

function toggleCategory(category: Category, checked: boolean) {
  if (checked) {
    if (!form.categories.includes(category)) form.categories.push(category);
  } else {
    form.categories = form.categories.filter((value) => value !== category);
  }
}

async function submit() {
  errorMessage.value = "";
  successMessage.value = "";
  if (form.categories.length === 0) {
    errorMessage.value = "请勾选至少一个分类（数据收集 / 共享 / 保存期限）";
    return;
  }
  if (!form.to_owner.trim()) {
    errorMessage.value = "请填写接手人";
    return;
  }
  try {
    // 按分类逐类批量指派，生成各自的交接批次
    let movedTotal = 0;
    let witnessedTotal = 0;
    for (const category of form.categories) {
      const result = await store.createHandoff({
        category,
        from_owner: form.from_owner,
        to_owner: form.to_owner,
        note: form.note
      });
      movedTotal += result.moved.length;
      witnessedTotal += result.witnessed.length;
      emit("done", { category });
    }
    successMessage.value = `交接完成：${movedTotal} 条待办转走，${witnessedTotal} 条已确认条目留下接手见证。`;
    form.note = "";
  } catch (error) {
    if (error instanceof HandoffControllerError) errorMessage.value = error.message;
    else errorMessage.value = "交接失败，请稍后重试";
  }
}
</script>

<template>
  <div class="panel handoff-panel">
    <h2>批量交接</h2>
    <div class="form-grid">
      <label class="full">
        <span>交接分类（可多选）</span>
        <div class="checks">
          <label v-for="category in PolicyCategory" :key="category" class="check">
            <input
              type="checkbox"
              :checked="form.categories.includes(category)"
              @change="toggleCategory(category, ($event.target as HTMLInputElement).checked)"
            />
            {{ PolicyCategoryText[category] }}
          </label>
        </div>
      </label>

      <label>
        <span>交出负责人</span>
        <select v-model="form.from_owner">
          <option v-for="owner in fromOwners" :key="owner" :value="owner">
            {{ owner === UNASSIGNED_OWNER ? UNASSIGNED_OWNER_TEXT : owner }}
          </option>
        </select>
      </label>

      <label>
        <span>接手人</span>
        <input v-model="form.to_owner" type="text" placeholder="接手同事姓名" />
      </label>

      <label class="full">
        <span>交接说明</span>
        <textarea
          v-model="form.note"
          rows="3"
          placeholder="说明待办进展、注意事项；已确认条目会附此说明作为接手见证"
        ></textarea>
      </label>
    </div>

    <div class="actions">
      <button class="primary-btn" type="button" :disabled="store.loading" @click="submit">提交交接</button>
    </div>
    <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="form-success">{{ successMessage }}</p>
  </div>
</template>

<style scoped>
.handoff-panel { background: #fbfaf4; border: 1px solid #d8d6c8; border-radius: 8px; padding: 18px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
label { display: grid; gap: 6px; font-size: 13px; color: #596257; }
label.full { grid-column: 1 / -1; }
input, select, textarea { font: inherit; padding: 8px 10px; border: 1px solid #c9c4b2; border-radius: 6px; background: #fff; box-sizing: border-box; width: 100%; }
textarea { resize: vertical; }
.checks { display: flex; gap: 16px; }
.check { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #20211d; }
.check input { width: auto; }
.actions { margin-top: 14px; }
.primary-btn { background: #274335; color: #f5f1e6; border: 0; border-radius: 6px; padding: 9px 18px; font-weight: 800; cursor: pointer; }
.primary-btn:hover { background: #345945; }
.form-error { color: #b03a2e; font-size: 13px; margin: 8px 0 0; }
.form-success { color: #246b3b; font-size: 13px; margin: 8px 0 0; }
</style>
