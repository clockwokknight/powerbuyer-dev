<script setup>
import { h, defineComponent, ref, watch, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { NTag, NButton, useMessage } from "naive-ui";
import vendors from "@/api/vendors";
import MaskedInput from "@/components/common/MaskedInput.vue";
import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import VendorExpensesAdd from "@/components/vendor/VendorExpensesAdd.vue";
import { getExpensesByVendor } from "@/hooks/expense";
import { useMutation } from "vue-query";
import axios from "axios";
import { objectFilter } from "@/lib/helper";

const showOuterRef = ref(false);
const route = useRoute();

const isLoading = ref(false);

const formValue = ref({
  vendor_id: 0,
  name: "",
  description: "",
  type: "",
  amount: "",
});

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,

  () => {
    if (route.params?.id) routeParamId.value = route.params?.id;
  }
);

const { data: expensesData } = getExpensesByVendor(routeParamId);

const { mutate: createExpense, isLoading: createExpenseLoading } = useMutation(
  (data) => axios.post("/expenses", data),
  {
    onSuccess() {
      visibleForm.value = false;
    },
  }
);
const { mutate: updateExpense, isLoading: updateExpenseLoading } = useMutation(
  ({ id, ...data }) => axios.post("/expenses", data)
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
    title: "Amount",
    key: "amount",
    //fixed: 'left'
  },
  {
    title: "Status",
    key: "expense_type_id",
    //fixed: 'left'
  },
  {
    title: "DOS",
    key: "expense_date",
    //fixed: 'left'
  },
  {
    title: "Inv #",
    key: "invoice_number",
    //fixed: 'left'
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return h(
        NButton,
        {
          strong: true,

          size: "medium",
          onClick: () => showEditExpenseForm(row),
        },
        { default: () => "View / Edit" }
      );
    },
  },
];
const pagination = { pageSize: 10 };

const visibleForm = ref(false);

const formRow = ref(null);
const showAddExpenseForm = () => {
  formRow.value = { vendor_id: parseInt(route.params?.id) };
  visibleForm.value = true;
};

const showEditExpenseForm = (row) => {
  formRow.value = row;
  visibleForm.value = true;
};
const onSubmitForm = (formValue) => {
  const { expense_items, ...rest } = formValue;
  if (rest?.id) {
    console.log(formValue);
  } else {
    createExpense(objectFilter(rest, (key, value) => value));
  }
};
</script>
<template>
  <div class="mt-4 px-4 font-sans">
    <div class="justify-end pb-4">
      <n-button @click="showAddExpenseForm">
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
        Add Expense
      </n-button>
    </div>
    <VendorExpensesAdd
      :show-drawer="visibleForm"
      :row="formRow"
      :isLoading="createExpenseLoading || updateExpenseLoading"
      @submit="onSubmitForm"
      @update:show="
        (val) => {
          visibleForm = val;
        }
      "
    />

    <div class="rounded-lg border-2 py-8 px-8">
      <div><p class="pb-8 text-2xl font-bold">Expenses</p></div>
      <n-data-table
        class="rounded-lg"
        :columns="columns"
        :data="expensesData?.pages[0]?.data"
        :pagination="pagination"
        :bordered="false"
        v-if="expensesData"
      />
    </div>
  </div>
</template>
