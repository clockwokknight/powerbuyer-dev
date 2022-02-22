<script setup>
import { h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { NTag, NButton, useMessage } from "naive-ui";
import VendorExpensesAdd from "@/components/vendor/VendorExpensesAdd.vue";
import { getExpensesByVendor } from "@/hooks/expense";
import { useMutation } from "vue-query";
import axios from "axios";
import { objectFilter, omit, pick } from "@/lib/helper";
import { useQueryClient } from "vue-query";
import ActionButtons from "@/components/vendor/ActionButtons.vue";

const route = useRoute();
const message = useMessage();

const isLoading = ref(false);

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,
  () => {
    if (route.params?.id) routeParamId.value = route.params?.id;
  }
);

const { data: expensesData } = getExpensesByVendor(routeParamId);

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
      return h(ActionButtons, {
        onEdit: () => showEditExpenseForm(row),
      });
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
  const obj = pick(row, [
    "amount",
    "deal_id",
    "description",
    "expense_date",
    "id",
    "vendor_id",
  ]);
  console.log({ row });
  // formRow.value = row;
  // visibleForm.value = true;
};

const onSubmitForm = (formValue) => {
  if (formValue?.id) {
    console.log(formValue);
  } else {
    onCreateExpense(formValue);
  }
};
</script>
<template>
  <div class="mt-4 px-4 font-sans">
    <div class="justify-end pb-4">
      <VendorExpensesAdd />
    </div>

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
