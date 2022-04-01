<script setup>
import VendorPaymentsAdd from "@/components/vendor/payment/VendorPaymentsAdd.vue";
import ActionButtons from "@/components/vendor/ActionButtons.vue";
import axios from "axios";
import { NButton } from "naive-ui";
import { h, ref, toRaw, watch } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import { omit, pick } from "@/lib/helper.js";
import VendorPaymentEdit from "@/components/vendor/payment/VendorPaymentEdit.vue";

const columns = [
  {
    title: "Check Number",
    key: "check_number",
    //fixed: 'left'
  },
  {
    title: "Amount",
    key: "amount",
    //fixed: 'left'
  },
  {
    title: "Status",
    key: "status",
    //fixed: 'left'
  },
  {
    title: "Payment Date",
    key: "payment_date",
    //fixed: 'left'
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return h(ActionButtons, {
        onClick: () => showEditPaymentForm(row),
      });
    },
  },
];

const route = useRoute();
const pagination = { pageSize: 10 };
const routeParamId = ref(route.params?.id);
const visibleEditForm = ref(false);
const formRow = ref(null);
const showEditPaymentForm = (row) => {
  const obj = omit(toRaw(row), [
    "created_at",
    "updated_at",
    "recipient_type",
    "txn_id",
    "recipient_name",
    "invoice_number",
  ]);
  // We are going to need to change if API changes
  obj.payment_invoices = obj.payment_invoices.map((invoice) => ({
    vendor_invoice_id: invoice.vendor_invoice_id,
    payment_amount: invoice.payment_amount,
    invoices: [
      {
        id: invoice.invoices[0].id,
        invoice_number: invoice.invoices[0].invoice_number,
      },
    ],
  }));

  formRow.value = obj;
  visibleEditForm.value = true;
};

const { data: paymentTable, isLoading } = useQuery(
  ["payments_vendor", routeParamId],
  ({ queryKey }) =>
    axios
      .get("/payments/vendor/" + queryKey[1])
      .then((res) => (res.data ? res.data.data : []))
);

watch(
  () => route.params,
  (toParam) => {
    if (toParam?.id) routeParamId.value = toParam?.id;
  },
  { immediate: true }
);
</script>

<template>
  <div class="bordered mt-[24px] rounded-round font-sans">
    <VendorPaymentEdit
      :initial-data="formRow"
      v-model:show-drawer="visibleEditForm"
    />

    <div
      class="border-[1px] bg-white p-[24px] dark:border-0 dark:bg-foreground_dark"
    >
      <div class="flex justify-between">
        <p class="pb-8 text-2xl font-bold">Payments</p>
        <VendorPaymentsAdd />
      </div>

      <n-data-table
        class="rounded-round"
        :columns="columns"
        :data="paymentTable"
        :loading="isLoading"
        :pagination="pagination"
        :bordered="false"
        :max-height="400"
        :scroll-x="900"
      />
    </div>
  </div>
</template>
