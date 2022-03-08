<script setup>
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useMutation } from "vue-query";
import { useGlobalState } from "@/store/global";
import { utils } from "@/lib/utils";
import { clone, objectFilter, omit, pick } from "@/lib/helper";
import { getExpensesByVendor } from "@/hooks/expense";
import { NTag, NButton, useMessage } from "naive-ui";
import { useQueryClient } from "vue-query";
import axios from "axios";
import dayjs from "dayjs";

import ActionButtons from "@/components/vendor/ActionButtons.vue";
import VendorExpenseEdit from "@/components/vendor/VendorExpenseEdit.vue";
import VendorExpensesAdd from "@/components/vendor/VendorExpensesAdd.vue";
import { vendorInvoices } from "@/hooks/vendor";

const global = useGlobalState();
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

const { data: invoicesData, isLoading: expensesDataLoading } =
  vendorInvoices(routeParamId);

const invoicesTable = computed(() =>
  invoicesData.value?.map(({ expenses, ...inv }) => ({
    ...inv,
    children: expenses.map((exp) => ({
      ...exp,
      shouldEdit: inv.payments.length === 0,
    })),
  }))
);

const rowKey = (row) => row?.id;
const columns = [
  {
    title: "Invoice",
    key: "invoice_number",
    fixed: "left",
  },
  {
    title: "Amount Due",
    key: "amount_due",
    //fixed: 'left'
  },
  {
    title: "Balance",
    key: "balance",
  },
  {
    title: "Name",
    key: "name",
  },
  // {
  //   title: ""
  // },
  {
    title: "Amount",
    key: "amount",
    //fixed: 'left'
  },
  {
    title: "DOS",
    key: "expense_date",
    //fixed: 'left'
  },
  {
    title: "",
    key: "edit",
    fixed: "right",
    render(row) {
      return row?.shouldEdit
        ? h(ActionButtons, {
            onEdit: () => showEditExpenseForm(row),
          })
        : h("div");
    },
  },
];

const pagination = { pageSize: 10 };
const visibleEditForm = ref(false);
const formRow = ref(null);

function showEditExpenseForm(row) {
  const obj = pick(row, [
    "name",
    "deal_id",
    "description",
    "expense_date",
    "id",
    "vendor_id",
    "invoice_number",
    "cost",
  ]);
  obj.type = parseInt(row.type);
  obj.amount = parseFloat(row.amount);
  if (obj?.expense_date) {
    obj.expense_date = dayjs(obj.expense_date).valueOf();
  }
  formRow.value = { ...obj };
  visibleEditForm.value = true;
}
</script>

<template>
  <div id="expenses" class="scroll-smooth">
    <VendorExpenseEdit
      :show-drawer="visibleEditForm"
      :initial-data="formRow"
      @update:show="visibleEditForm = false"
    />
    <div class="-mt-4 font-sans">
      <div class="flex translate-y-[68px] items-center justify-end pr-10">
        <VendorExpensesAdd />
      </div>
      <div class="rounded border-2 dark:border-0 bg-white dark:bg-[#25272A] py-8 px-8">
        <div><p class="pb-8 text-2xl font-bold">Expenses</p></div>
        <n-data-table
          class="rounded-md"
          striped
          :columns="columns"
          :data="invoicesTable"
          :pagination="pagination"
          :bordered="false"
          :loading="expensesDataLoading"
          :row-key="rowKey"
          max-height="500"
          :scroll-x="1200"
        />
      </div>
    </div>
  </div>
</template>
