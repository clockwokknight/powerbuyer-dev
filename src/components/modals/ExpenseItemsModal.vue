<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import { NButton } from "naive-ui";

const emit = defineEmits(["onReturn"]);

const expenseItems = ref([]);
const showEditModal = ref(false);
const showModal = ref(false);
const editingExpenseItem = ref({
  name: "",
  active: 1,
  created_at: null,
  updated_at: null,
});
const isEditing = ref(false);

const onRemoveExpenseItem = (index) => {
  expenseItems.value.slice(index, 1);
};

const columns = [
  {
    title: "Name",
    key: "name",
    width: 200,
    //fixed: 'left'
  },
  {
    title: "Action",
    key: "actions",
    width: 50,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            onClick: () => {
              isEditing.value = true;
              showEditModal.value = true;
              editingExpenseItem.value = row;
            },
          },
          { default: () => "Edit" }
        ),
        h(
          NButton,
          {
            size: "small",
            onClick: async () => {
              await axios.delete(`/expense_types/${row.id}`);
              getExpenseItems();
            },
          },
          { default: () => "Delete" }
        ),
      ];
    },
  },
];

const addRow = () => {
  showEditModal.value = true;
  isEditing.value = false;
  const newType = {
    name: "",
    active: 1,
    created_at: null,
    updated_at: null,
  };
  editingExpenseItem.value = newType;
};

const onCancelEditingModal = () => {
  showEditModal.value = false;
};

const onOkEditingModal = async () => {
  if (isEditing.value) {
    await axios.put(
      `/expense_types/${editingExpenseItem.value.id}`,
      editingExpenseItem.value
    );
  } else {
    await axios.post("/expense_types", editingExpenseItem.value);
  }
  getExpenseItems();
  showEditModal.value = false;
};
</script>
<template>
  <div>
    <div class="cursor-pointer py-6 px-6" @click="showModal = true">
      <div class="mb-2 text-lg font-bold">Expense Types</div>
      <div class="pb-2 text-sm">Click to add/edit Expense Types.</div>
    </div>

    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="Expense Items"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-data-table
          class="rounded-md"
          striped
          :columns="columns"
          :data="expenseItems"
          :bordered="false"
          :loading="paymentDataLoading"
          :row-key="rowKey"
        />
        <template #footer>
          <div class="flex flex-row justify-between">
            <n-button size="large" @click="addRow">Add...</n-button>
            <n-button size="large" @click="$emit('onReturn')">Cancel</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showEditModal">
      <n-card
        class="w-[400px]"
        :title="isEditing ? 'Edit Expense Item' : 'Add Expense Item'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra></template>

        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-6 md:col-span-12">
            <CustomInput
              label="Name"
              v-model:value="editingExpenseItem.name"
              style="margin-right: 12px"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex flex-row gap-[10px]">
            <n-button size="large" @click="onOkEditingModal">OK</n-button>
            <n-button size="large" @click="onCancelEditingModal"
              >Cancel</n-button
            >
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
