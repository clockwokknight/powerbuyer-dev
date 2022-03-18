<script setup>
import { h, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { NButton } from "naive-ui";

import VendorExpensesItemsAdd from "@/components/vendor/VendorExpensesItemsAdd.vue";
import { useMutation, useQueryClient } from "vue-query";
import axios from "axios";
import { objectFilter, pick } from "@/lib/helper";
import { getVendorExpenseItems } from "@/hooks/expense";
import ActionButtons from "@/components/vendor/ActionButtons.vue";

const route = useRoute();
const queryClient = useQueryClient();
const visibleForm = ref(false);

const formRow = ref(null);

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,

  () => {
    if (route.params?.id) routeParamId.value = route.params?.id;
  }
);
const { data: expenseItems, isFetching: expenseItemsFetching } = getVendorExpenseItems(
  routeParamId
);

const showUpdateForm = (row) => {
  const obj = pick(row, [
    "vendor_id",
    "id",
    "name",
    "description",
    "amount",
    "expense_type_id",
  ]);
  obj.amount = parseFloat(obj.amount);
  formRow.value = obj;
  visibleForm.value = true;
};

const { mutate: createExpenseItem, isLoading: createExpenseItemLoading } = useMutation(
  (data) => axios.post("/expense_items", data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendorExpenseItems", routeParamId.value]);
      formRow.value = null;
      visibleForm.value = false;
    },
  }
);

const { isLoading: updateExpenseItemLoading, mutate: updateExpenseItem } = useMutation(
  ({ id, ...rest }) => axios.put(`/expense_items/${id}`, rest),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendorExpenseItems", routeParamId.value]);
      formRow.value = null;
      visibleForm.value = false;
    },
  }
);

const { mutate: deleteExpenseItem } = useMutation(
  (id) => axios.delete(`/expense_items/${id}`),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["vendorExpenseItems", route.params?.id]);
    },
  }
);

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
    key: "expense_type.name",
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
      return h(ActionButtons, {
        row,
        onEdit: () => showUpdateForm(row),
      });
    },
  },
];

const pagination = { pageSize: 10 };

const showCreateForm = () => {
  formRow.value = { vendor_id: parseInt(routeParamId.value) };
  visibleForm.value = true;
};

const onSubmitForm = (formValue) => {
  const obj = objectFilter(formValue, (key, value) => value);
  if (formValue?.id) {
    updateExpenseItem(obj);
  } else createExpenseItem(obj);
  // formRow.value = null;
  // visibleForm.value = false;
};

const onDeleteExpenseItem = (id) => {
  deleteExpenseItem(id);
  visibleForm.value = false;
};
</script>

<template>
  <div class="scroll-smooth font-sans antialiased mt-[24px] rounded-round bordered">
    <VendorExpensesItemsAdd
      :show-drawer="visibleForm"
      :row="formRow"
      :is-loading="createExpenseItemLoading || updateExpenseItemLoading"
      @update:show="visibleForm = false"
      @submit="onSubmitForm"
      @delete="onDeleteExpenseItem"
    />
    <div
      class="rounded-round bg-foreground_light py-8 px-8 dark:bg-foreground_dark dark:border-dark_border"
    >
      <div class="flex justify-between">
        <p class="pb-8 text-2xl font-bold">Expense Items</p>
        <n-button @click="showCreateForm">
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
      </div>
      <n-data-table
        class="rounded-round"
        :columns="columns"
        :data="expenseItems"
        :pagination="pagination"
        :bordered="false"
        :loading="expenseItemsFetching"
      />
    </div>
  </div>
</template>
