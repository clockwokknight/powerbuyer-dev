<script setup>
import ActionButtons from "@/components/vendor/ActionButtons.vue";
import VendorExpenseEdit from "@/components/vendor/VendorExpenseEdit.vue";
import VendorExpensesAdd from "@/components/vendor/VendorExpensesAdd.vue";
import { vendorInvoices } from "@/hooks/vendor";
import { clone, omit, pick } from "@/lib/helper";
import dayjs from "dayjs";
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import VendorExpenseShow from "./VendorExpenseShow.vue";

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
      return h(ActionButtons, {
        showViewButton: true,
        onView: () => showViewExpense(row),
        onEdit: () => showEditExpenseForm(row),
      });
    },
  },
];

const pagination = { pageSize: 10 };
const visibleEditForm = ref(false);
const formRow = ref(null);
const formDisabled = ref(false);
const showReadOnlyInvoice = ref(false);

const showViewExpense = (row) => {
  formRow.value = clone(row);
  showReadOnlyInvoice.value = true;
};

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

  // formDisabled.value = Boolean(row?.payments.length);
  formRow.value = obj;
  visibleEditForm.value = true;
}
</script>

<template>
  <div
    class="dark:border-dark_border mt-[24px] scroll-smooth border-[1px] border-transparent"
  >
    <VendorExpenseShow v-model:show="showReadOnlyInvoice" :formRow="formRow" />
    <VendorExpenseEdit
      :show-drawer="visibleEditForm"
      :initial-data="formRow"
      @update:show="visibleEditForm = false"
      :is-disabled="formDisabled"
    />
    <div class="font-sans">
      <div
        class="rounded-round dark:bg-foreground_dark border-[1px] bg-white p-[24px] dark:border-0"
      >
        <div class="flex justify-between">
          <p class="pb-8 text-2xl font-bold">Invoices & Expenses</p>
          <VendorExpensesAdd />
        </div>
        <n-data-table
          class="rounded-round"
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
