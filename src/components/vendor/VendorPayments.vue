<script setup>
import VendorPaymentsAdd from "@/components/vendor/VendorPaymentsAdd.vue";
import axios from "axios";
import { NButton } from "naive-ui";
import { h, ref, watch } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";

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
      return h(
        NButton,
        {
          strong: true,

          size: "medium",
          onClick: () => doShowOuter(row),
        },
        { default: () => "View / Edit" }
      );
    },
  },
];

const pagination = { pageSize: 10 };
const route = useRoute();
const routeParamId = ref(route.params?.id);

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

function updateVendor(key, val) {}

function handleKeyUp(val) {
  show.value[val] = true;
}

function handleKeyDown(val) {
  show.value[val] = false;
}
</script>

<template>
  <div class="-mt-4 font-sans antialiased">
    <div class="flex translate-y-[68px] items-center justify-end pr-10">
      <VendorPaymentsAdd />
    </div>
    <div class="border-2 bg-white py-8 px-8 dark:border-0 dark:bg-[#25272A]">
      <div><p class="pb-8 text-2xl font-bold">Payments</p></div>

      <n-data-table
        class="rounded-md"
        :columns="columns"
        :data="paymentTable"
        :loading="isLoading"
        :pagination="pagination"
        :bordered="false"
        :max-height="400"
        :scroll-x="1000"
      />
    </div>
  </div>
</template>
