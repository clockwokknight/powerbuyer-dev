<script setup>
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,
  () => {
    if (route.params?.id) routeParamId.value = route.params?.id;
  }
);

// Need API endpoints
const { data: paymentData, isLoading: paymentDataLoading } = {
  data: { pages: [] },
  isLoading: false,
};

const columns = [
  {
    title: "Deal ID",
    key: "deail_id",
    //fixed: 'left'
  },
  {
    title: "Vin",
    key: "vin",
    //fixed: 'left'
  },
  {
    title: "Invoice ID",
    key: "invoice_id",
    //fixed: 'left'
  },
  {
    title: "Amount",
    key: "amount",
    //fixed: 'left'
  },
  {
    title: "Balance",
    key: "balance",
    //fixed: 'left'
  },
  {
    title: "Payment Date",
    key: "payment_date",
    //fixed: 'left'
  },
  {
    title: "Payment Type",
    key: "payment_type",
    //fixed: 'left'
  },
  {
    title: "Status",
    key: "status",
    //fixed: 'left'
  },
];
</script>

<template>
  <div id="payments-made" class="scroll-smooth">
    <div class="-mt-4 font-sans">
      <div
        class="rounded-roundborder-2 bg-white py-8 px-8 dark:border-0 dark:bg-[#25272A]"
      >
        <div><p class="pb-8 text-2xl font-bold">Payments Made</p></div>
        <n-data-table
          class="rounded-round"
          striped
          :columns="columns"
          :data="paymentData?.pages[0]"
          :pagination="pagination"
          :bordered="false"
          :loading="paymentDataLoading"
          :row-key="rowKey"
        />
      </div>
    </div>
  </div>
</template>
