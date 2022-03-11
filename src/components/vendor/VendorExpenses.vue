<script setup>
import ActionButtons from "@/components/vendor/ActionButtons.vue";
import VendorExpenseEdit from "@/components/vendor/VendorExpenseEdit.vue";
import VendorExpensesAdd from "@/components/vendor/VendorExpensesAdd.vue";
import { vendorInvoices } from "@/hooks/vendor";
import { clone, omit, pick } from "@/lib/helper";
import dayjs from "dayjs";
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const routeParamId = ref(route.params?.id);

watch(
  () => route.params,
  (toParams) => {
    if (toParams?.id) routeParamId.value = toParams?.id;
  }
);

const { data: invoicesData, isLoading: expensesDataLoading } = vendorInvoices(
  routeParamId
);

const rowKey = (row) => row?.id;
const columns = [
  {
    title: "Invoice",
    key: "invoice_number",
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
    title: "Amount Paid",
    key: "amount_paid",
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return row?.payments.length > 0
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
  let obj = clone(row);
  obj.expenses = clone(row.expenses).map((expense) =>
    pick(expense, [
      "id",
      "amount",
      "type",
      "expense_date",
      "deal_id",
      "name",
      "description",
      "expense_types",
    ])
  );
  obj = omit(obj, ["payments", "balance", "amount_paid", "children", "vendor_name"]);
  formRow.value = obj;
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
      <div class="rounded border-2 bg-white py-8 px-8 dark:border-0 dark:bg-[#25272A]">
        <div>
          <p class="pb-8 text-2xl font-bold">Invoices & Expenses</p>
        </div>
        <n-data-table
          class="rounded-md"
          striped
          :columns="columns"
          :data="invoicesData"
          :pagination="pagination"
          :bordered="false"
          :loading="expensesDataLoading"
          :row-key="rowKey"
        />
      </div>
    </div>
  </div>
</template>
