<script setup>
import { h, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { NButton } from "naive-ui";
import vendors from "@/api/vendors";
import VendorExpensesItemsAdd from "@/components/vendor/VendorExpensesItemsAdd.vue";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import { objectFilter, pick } from "@/lib/helper";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/vendor";

const showOuterRef = ref(false);
const route = useRoute();
const formRef = ref(null);
const queryClient = useQueryClient();

const form = ref({
  vendor_id: 0,
  name: "",
  description: "",
  type: "",
  amount: "",
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

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,

  () => {
    routeParamId.value = route.params?.id;
  }
);
const { data: expenseItems } = getVendorExpenseItems(routeParamId);

const { data: expense_types } = getExpenseTypes();

const expenseTypeOptions = computed(() =>
  expense_types.value?.map((expense) => ({
    label: expense.name,
    value: expense.id,
  }))
);

const doShowOuter = (row) => {
  form.value = pick(row, [
    "vendor_id",
    "id",
    "name",
    "description",
    "amount",
    "expense_type_id",
  ]);

  showOuterRef.value = true;
};

const { isLoading, mutate } = useMutation(
  ({ id, ...rest }) => axios.put(`/expense_items/${id}`, rest),
  {
    onSuccess() {
      queryClient.invalidateQueries([
        "vendorExpenseItems",
        String(form.value.vendor_id),
      ]);
      showOuterRef.value = false;
    },
  }
);

async function updateVendor() {
  try {
    await formRef.value.validate();
    mutate(objectFilter(form.value, (key, value) => value));
  } catch (e) {}
}

const columns = [
  {
    title: "Name",
    key: "name",
    //fixed: 'left'
  },
  {
    title: "Description",
    key: "description",
    //fixed: 'left'
  },
  {
    title: "Expense Type",
    key: "expense_type_id",
    //fixed: 'left'
  },
  {
    title: "Amount",
    key: "amount",
    //fixed: 'left'
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return h(NButton, {
        strong: true,

        size: "medium",
        onClick: () => doShowOuter(row),
        innerHTML: `<svg class="h-6 w-6 text-gray-300 hover:text-[#027BFF]" xmlns=“http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z" fill="currentColor"></path></g></svg>`,
      });
    },
  },
];
const pagination = { pageSize: 10 };
</script>
<template>
  <div class="mt-4 px-4 font-sans antialiased">
    <div class="pb-4 justify-end"><VendorExpensesItemsAdd /></div>

    <div class="py-8 px-8 rounded-lg border-2">
      <div><p class="text-2xl font-bold pb-8">Expense Items</p></div>
      <n-data-table
        class="rounded-lg"
        :columns="columns"
        :data="expenseItems"
        :pagination="pagination"
        :bordered="false"
      />
    </div>
  </div>

  <n-drawer v-model:show="showOuterRef" :width="500">
    <n-drawer-content title="Add Expense Item">
      <n-form
        :model="form"
        @submit.prevent="updateVendor"
        :rules="rules"
        size="medium"
        ref="formRef"
        :disabled="isLoading"
      >
        <n-form-item label="Name" path="name" class="pt-0">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Name"
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
          />
        </n-form-item>
        <n-form-item label="Amount" path="amount">
          <CurrencyInput placeholder="Enter Amount" v-model="form.amount" />
        </n-form-item>
        <n-button size="large" attr-type="submit" class="invisible"
          >Update</n-button
        >
      </n-form>
      <template #footer>
        <n-button size="large" @click="updateVendor">Update</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
