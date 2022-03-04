<script setup>
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useMutation } from "vue-query";
import { useGlobalState } from "@/store/global";
import { utils } from "@/lib/utils";
import { objectFilter, omit, pick } from "@/lib/helper";
import { getExpensesByVendor } from "@/hooks/expense";
import { NTag, NButton, useMessage } from "naive-ui";
import { useQueryClient } from "vue-query";
import axios from "axios";
import dayjs from "dayjs";

import ActionButtons from "@/components/vendor/ActionButtons.vue";
import VendorExpenseEdit from "@/components/vendor/VendorExpenseEdit.vue";
import VendorExpensesAdd from "@/components/vendor/VendorExpensesAdd.vue";

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

const { data: expensesData, isLoading: expensesDataLoading } = getExpensesByVendor(
  routeParamId
);

// const expenseDataComputed = computed(() => expensesData.value ? )
const rowKey = (row) => row?.deal_id;
const columns = [
  {
    title: "VIN",
    key: "vin",
    //fixed: 'left'
  },
  {
    title: "Name",
    key: "name",
    //fixed: 'left'
  },
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
    title: "Inv #",
    key: "invoice_number",
    //fixed: 'left'
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return row?.children
        ? h("div")
        : h(ActionButtons, {
            onEdit: () => showEditExpenseForm(row),
          });
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
      <div class="flex justify-end items-center translate-y-[68px] pr-10">
        <VendorExpensesAdd />
      </div>

      <div class="rounded-md border-2 py-8 px-8 bg-white">
        <div><p class="pb-8 text-2xl font-bold">Expenses</p></div>
        <n-data-table
          class="rounded-md"
          striped
          :columns="columns"
          :data="expensesData?.pages[0]"
          :pagination="pagination"
          :bordered="false"
          :loading="expensesDataLoading"
          :row-key="rowKey"
        />
      </div>
    </div>
  </div>
</template>
