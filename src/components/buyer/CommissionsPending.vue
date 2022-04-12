<script setup>
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getCommissions, COMMISSION_STATUS } from "@/hooks/commission";
import { BUYER_TYPE } from "@/hooks/buyer";

const route = useRoute();

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,
  () => {
    if (route.params?.id) routeParamId.value = route.params?.id;
  }
);

const { data: commissionData } = getCommissions(
  COMMISSION_STATUS.Pending,
  BUYER_TYPE.Buyer
);

console.log("commissionData:", JSON.stringify(commissionData.value));

const columns = [
  {
    title: "Buyer's First Name",
    key: "buyer_first_name",
    //fixed: 'left'
  },
  {
    title: "Buyer Last Name",
    key: "buyer_last_name",
    //fixed: 'left'
  },
  {
    title: "Amount",
    key: "commission_amount",
    //fixed: 'left'
  },
  {
    title: "Lane Number",
    key: "lane_number",
    //fixed: 'left'
  },
  {
    title: "Market Price",
    key: "market_price",
    //fixed: 'left'
  },
  {
    title: "Purchase Price",
    key: "purchase_price",
    //fixed: 'left'
  },
  {
    title: "Sale Price",
    key: "sale_price",
    //fixed: 'left'
  },
  {
    title: "Trade In Price",
    key: "trade_in_price",
    //fixed: 'left'
  },
  {
    title: "VIN",
    key: "vin",
    //fixed: 'left'
  },
  {
    title: "Status",
    key: "status_text",
    //fixed: 'left'
  },
];
const pagination = { pageSize: 10 };
</script>

<template>
  <div id="commissions-pending" class="scroll-smooth">
    <div class="-mt-4 font-sans">
      <div
        class="rounded-roundborder-2 bg-white py-8 px-8 dark:border-0 dark:bg-[#25272A]"
      >
        <div><p class="pb-8 text-2xl font-bold">Commissions Pending</p></div>
        <n-data-table
          class="rounded-round"
          striped
          :columns="columns"
          :data="commissionData ? Object.values(commissionData) : []"
          :pagination="pagination"
          :bordered="false"
          :loading="false"
        />
      </div>
    </div>
  </div>
</template>
