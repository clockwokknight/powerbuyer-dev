<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import { NButton } from "naive-ui";
import { getExpenseTypes } from "@/hooks/expense.js";

const showEditModal = ref(false);
const showModal = ref(false);
const formRef = ref(null);
const pagination = reactive({
  page: 1,
  pageSize: 50,
  pageCount: 1,
  prefix({ itemCount }) {
    return `Total is ${itemCount}.`;
  },
});
const editingExpenseItem = ref({
  name: "",
  active: 1,
  created_at: null,
  updated_at: null,
});
const isEditing = ref(false);

const {
  data: expenseTypes,
  isFetching: expenseTypeLoading,
  fetchNextPage,
} = getExpenseTypes();
const expenseTypeTable = ref([]);
watch(
  () => expenseTypes.value,
  (newValue) => {
    if (newValue) {
      expenseTypeTable.value = newValue.pages[pagination.page - 1].data;
      pagination.itemCount = newValue.pages[0].total;
      pagination.pageCount = newValue.pages[0].last_page;
    }
  },
  { immediate: true }
);
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
      return h(ActionButtons, {
        onEdit: () => {
          isEditing.value = true;
          showEditModal.value = true;
          editingExpenseItem.value = row;
        },
        onDelete: async () => {
          await axios.delete(`/expense_types/${row.id}`);
        },
      });
    },
  },
];
const rules = {
  name: {
    required: true,
    message: "Name is required",
    trigger: "input",
  },
};
const addRow = () => {
  showEditModal.value = true;
  isEditing.value = false;
  const newType = {
    name: "",
    active: 1,
  };
  editingExpenseItem.value = newType;
};

const onOkEditingModal = async () => {
  try {
    await formRef.value.validate();
    if (isEditing.value) {
      await axios.put(
        `/expense_types/${editingExpenseItem.value.id}`,
        editingExpenseItem.value
      );
    } else {
      await axios.post("/expense_types", editingExpenseItem.value);
    }

    showEditModal.value = false;
  } catch (error) {}
};
const handlePageChange = (current_page) => {
  pagination.page = current_page;
  fetchNextPage.value(current_page);
};
</script>
<template>
  <div>
    <div class="cursor-pointer py-6 px-6" @click="showModal = true">
      <div class="mb-2 text-lg font-bold">Expense Types</div>
      <div class="pb-2 text-sm">Click to add/edit Expense Types</div>
    </div>

    <n-modal
      preset="card"
      class="max-w-screen-md"
      title="Expense Types"
      v-model:show="showModal"
    >
      <div class="mb-5">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button @click="addRow">+</n-button>
          </template>
          Create an Expense Type
        </n-tooltip>
      </div>
      <n-data-table
        remote
        class="rounded-md"
        striped
        :columns="columns"
        :data="expenseTypeTable"
        :bordered="false"
        :loading="expenseTypeLoading"
        :max-height="500"
        :pagination="pagination"
        virtual-scroll
        @update:page="handlePageChange"
      />
    </n-modal>
    <n-modal
      preset="card"
      class="max-w-md"
      :title="isEditing ? 'Edit Expense type' : 'Add Expense type'"
      v-model:show="showEditModal"
    >
      <n-form
        :model="editingExpenseItem"
        ref="formRef"
        :rules="rules"
        class="grid grid-cols-12 gap-2"
      >
        <div class="col-span-6 md:col-span-12">
          <n-form-item label="name" path="name">
            <n-input v-model:value="editingExpenseItem.name" />
          </n-form-item>
        </div>
      </n-form>

      <template #footer>
        <n-button size="large" @click="onOkEditingModal">Submit</n-button>
      </template>
    </n-modal>
  </div>
</template>
