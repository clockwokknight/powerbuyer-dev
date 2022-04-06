<script setup>
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { auctionVehicles } from "@/hooks/auctions";

const route = useRoute();

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,
  (toParams) => {
    if (toParams?.id) routeParamId.value = toParams?.id;
  }
);

// Need API endpoints
const { data: vehicleData, isLoading: vehicleDataLoading } =  auctionVehicles(
  routeParamId
);

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
    title: "Year",
    key: "year",
    //fixed: 'left'
  },
  {
    title: "Make",
    key: "make",
    //fixed: 'left'
  },
  {
    title: "Model",
    key: "model",
    //fixed: 'left'
  },
  {
    title: "Color",
    key: "color",
    //fixed: 'left'
  },
  {
    title: "Status",
    key: "status",
    //fixed: 'left'
  },
];

const rowKey = (row) => row?.id;
const pagination = { pageSize: 10 };
</script>

<template>
  <div id="vehicles-at-auction"
    class="scroll-smooth border-[1px] mt-[24px] border-transparent dark:border-dark_border"
  >
    <div class="font-sans">
      <div
        class="rounded-round border-[1px] bg-white p-[24px] dark:border-0 dark:bg-foreground_dark"
      >
        <div class="flex justify-between">
          <p class="pb-8 text-2xl font-bold">Vehicles at Auction</p>
        </div>
        <n-data-table
          class="rounded-round"
          striped
          :columns="columns"
          :data="vehicleData"
          :pagination="pagination"
          :bordered="false"
          :loading="vehicleDataLoading"
          :row-key="rowKey"
        />
      </div>
    </div>
  </div>
</template>
