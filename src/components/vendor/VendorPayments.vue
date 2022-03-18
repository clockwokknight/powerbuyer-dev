<script setup>
import VendorPaymentsAdd from "@/components/vendor/VendorPaymentsAdd.vue";
import ActionButtons from "@/components/vendor/ActionButtons.vue";
import axios from "axios";
import { NButton } from "naive-ui";
import { h, ref, toRaw, watch } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import { omit, pick } from "@/lib/helper.js";
import VendorPaymentEdit from "@/components/vendor/VendorPaymentEdit.vue";

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
  obj.payment_invoices = obj.vendor_invoices.map((invoice) => ({
    vendor_invoice_id: invoice.id,
    payment_amount: invoice.amount_paid,
  }));

  formRow.value = obj;
  visibleEditForm.value = true;
  console.log({ obj, row: toRaw(row) });
};

const { data: paymentTable, isLoading } = useQuery(
  ["payments_vendor", routeParamId],
  ({ queryKey }) =>
    axios.get("/payments/vendor/" + queryKey[1]).then((res) => (res.data ? res.data : []))
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
  <div class="-mt-4 font-sans">
    <VendorPaymentEdit :initial-data="formRow" v-model:show-drawer="visibleEditForm" />
    <div class="flex translate-y-[68px] items-center justify-end pr-10">
      <VendorPaymentsAdd />
    </div>
    <div class="border-2 bg-white py-8 px-8 dark:border-0 dark:bg-foreground_dark">
      <div><p class="pb-8 text-2xl font-bold">Payments</p></div>

      <n-data-table
        class="rounded-md"
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
