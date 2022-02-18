<script setup>
import { computed, ref } from "vue";
import vendors from "@/api/vendors";
import { useMessage } from "naive-ui";
import MaskedInput from "@/components/common/MaskedInput.vue";
import { getExpenseTypes } from "@/hooks/vendor";
import CurrencyInput from "@/components/common/CurrencyInput.vue";

const showOuterRef = ref(false);

const formRef = ref(null);
const message = useMessage();
const form = ref({
  name: "",
  description: "",
  expense_type_id: null,
  amount: 0,
});

const rules = {
  name: {
    required: true,
    message: "Please enter a Name",
  },
  expense_type_id: {
    required: true,
    message: "Please enter a valid type",
  },
  amount: {
    required: true,
    message: "Please select a valid amount",
  },
};
const { data: expense_types } = getExpenseTypes();

const expenseTypeOptions = computed(() =>
  expense_types.value?.map((expense) => ({
    label: expense.name,
    value: expense.id,
  }))
);
const addExpense = async () => {
  await formRef.value.validate();

  //message.success('Valid')
};
</script>
<template>
  <n-button @click="showOuterRef = !showOuterRef">
    <n-icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 24"
      >
        <path
          d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
          fill="currentColor"
        ></path>
      </svg>
    </n-icon>
    Add Expense Item
  </n-button>
  <n-drawer v-model:show="showOuterRef" :width="500">
    <n-drawer-content title="Add Expense Item">
      <n-form
        :model="form"
        @submit.prevent="addExpense"
        :rules="rules"
        size="medium"
        ref="formRef"
      >
        <n-form-item label="Name" path="name" class="pt-0">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Name"
            clearable
            v-model:value.trim="form.name"
          />
        </n-form-item>

        <n-form-item label="Description">
          <n-input
            placeholder="Enter Description"
            clearable
            v-model:value="form.description"
          />
        </n-form-item>
        <n-form-item label="Type" path="expense_type_id">
          <n-select
            :options="expenseTypeOptions"
            v-model:value="form.expense_type_id"
            filterable
            clearable
          />
        </n-form-item>
        <n-form-item label="Amount" path="amount">
          <CurrencyInput
            placeholder="Enter Amount"
            clearable
            v-model="form.amount"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button size="large" @click="addExpense()">Add</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
