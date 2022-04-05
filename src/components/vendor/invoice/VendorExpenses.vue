<script setup>
import ActionButtons from "@/components/vendor/ActionButtons.vue";
import { vendorInvoices } from "@/hooks/vendor.js";
import { clone, omit, pick } from "@/lib/helper.js";
import dayjs from "dayjs";
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import InvoiceEdit from "@/components/vendor/invoice/VendorInvoiceEdit.vue";
import CreateVendorInvoice from "@/components/vendor/invoice/CreateVendorInvoice.vue";

const route = useRoute();

const routeParamId = ref(route.params?.id);

watch(
  () => route.params,
  (toParams) => {
    if (toParams?.id) routeParamId.value = toParams?.id;
  }
);

const { data: invoicesData, isLoading: expensesDataLoading } =
  vendorInvoices(routeParamId);

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
        onEdit: () => showViewExpense(row),
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
      "invoice_number",
      "description",
      "expense_types",
    ])
  );
  obj = omit(obj, [
    "payments",
    "balance",
    "amount_paid",
    "children",
    "vendor_name",
  ]);

  // formDisabled.value = Boolean(row?.payments.length);
  formRow.value = obj;
  visibleEditForm.value = true;
}
</script>

<template>
  <div
    class="mt-[24px] scroll-smooth border-[1px] border-transparent dark:border-dark_border"
  >
    <InvoiceEdit v-model:show="showReadOnlyInvoice" :initial-data="formRow" />
    <!-- <VendorExpenseEdit
      :show-drawer="visibleEditForm"
      :initial-data="formRow"
      @update:show="visibleEditForm = false"
      :is-disabled="formDisabled"
    /> -->
    <div class="font-sans">
      <div
        class="rounded-round border-[1px] bg-white p-[24px] dark:border-0 dark:bg-foreground_dark"
      >
        <div class="flex justify-between">
          <p class="pb-8 text-2xl font-bold">Invoices & Expenses</p>
          <CreateVendorInvoice />
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
