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
const { data: vehicleData, isLoading: vehicleDataLoading } = {
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
const pagination = { pageSize: 10 };
</script>

<template>
  <div id="vehicles-pending-sale">
    <div class="font-sans">
      <div
        class="rounded-roundborder-2 bg-white py-8 px-8 dark:border-0 dark:bg-[#25272A]"
      >
        <div><p class="pb-8 text-2xl font-bold">Vehicles Pending Sale</p></div>
        <n-data-table
          class="rounded-round"
          striped
          :columns="columns"
          :data="vehicleData?.pages[0]"
          :pagination="pagination"
          :bordered="false"
          :loading="vehicleDataLoading"
        />
      </div>
    </div>
  </div>
</template>
