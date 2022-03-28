<script setup>
import { h, ref, reactive, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import DataTable from "@/components/_refactor/DataTable.vue";
import Card from "@/components/_refactor/Card.vue";
import HeaderTabs from "@/components/_refactor/HeaderTabs.vue";
import { start } from "@popperjs/core";
import { useDebounce } from "@vueuse/core";
import { NTag } from "naive-ui";

const route = useRoute();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const data = ref({});
const isLoading = ref(false);

const page = ref(1);
const pageCount = ref(1);

watch(
  () => data.value,
  (newValue, oldValue) => {
    console.log("newValue:", newValue, data.value?.per_page);
    page.value = data.value.current_page;
    pageCount.value = data.value?.last_page;
  }
);

watch(
  () => debouncedSearchText.value,
  (newValue, oldValue) => {
    isLoading.value = true;
    axios
      .get(`/deals/search_by_vin/${debouncedSearchText.value}`)
      .then((res) => {
        data.value = res.data;
        console.log("updated:", data.value);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
);

const deals = computed(() => {
  return data.value?.data?.map((item) => {
    return {
      vin: item.vin,
      lane_number: item.lane_number,
      date_purchased: item.date_purchased,
      status: item.status,
      make: "Ford",
      model: "Expedeition",
      year: "2021",
      buyer: "Amber Smith",
    };
  });
});

const onUpdatePage = (pageNum) => {
  fetchDeals(pageNum);
};

const tabs = ref([
  {
    title: "All Deals",
    value: "1",
  },
  {
    title: "Pending Purchase",
    value: "2",
  },
  {
    title: "Purchased",
    value: "3",
  },
  {
    title: "In-transit", //fixed: 'left'
    value: "4",
  },
  {
    title: "At Auction",
    value: "5",
  },
  {
    title: "Pending Sale",
    value: "6",
  },
  {
    title: "Sold",
    value: "7",
  },
  {
    title: "Unwound",
    value: "8",
  },
]);

const columns = [
  {
    title: "VIN",
    key: "vin",
    align: "center",
  },
  {
    title: "LANE",
    key: "lane_number",
    align: "center",
  },
  {
    title: "DOP",
    key: "date_purchased",
    align: "center",
  },
  {
    title: "STATUS",
    key: "status",
    align: "center",
    render(row) {
      return h(
        NTag,
        {
          type: "info",
        },
        { default: () => row.status }
      );
    },
  },
  {
    title: "MAKE",
    key: "make",
    align: "center",
  },
  {
    title: "MODEL",
    key: "model",
    align: "center",
  },
  {
    title: "TRIM",
    key: "trim",
    align: "center",
  },
  {
    title: "YEAR",
    key: "year",
    align: "center",
  },
  {
    title: "BUYER",
    key: "buyer",
    align: "center",
     render(row) {
      return h(
        NTag,
        {
          type: "info",
        },
        { default: () => row.buyer }
      );
    },
  },
  {
    title: "CR",
    align: "center",
  },
];

const range = ref([118313526e4, Date.now()]);
const selectedTab = ref({ title: "All Deals", value: 1 });

onMounted(() => {
  console.log(route);
});

const fetchDeals = (pageNum) => {
  if (selectedTab.value.title === "All Deals") {
    isLoading.value = true;
    const startDate = new Date(range.value[0]);
    const endDate = new Date(range.value[1]);
    const startDateString =
      startDate.getFullYear() +
      "-" +
      (startDate.getMonth() + 1) +
      "-" +
      startDate.getDate();
    const endDateString =
      endDate.getFullYear() +
      "-" +
      (endDate.getMonth() + 1) +
      "-" +
      endDate.getDate();
    axios
      .get(
        `/deals/by_date/${startDateString}/${endDateString}/10?page=${pageNum}`
      )
      .then((res) => {
        data.value = res.data;
        console.log("updated:", data.value);
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    isLoading.value = true;
    const startDate = new Date(range.value[0]);
    const endDate = new Date(range.value[1]);
    const startDateString =
      startDate.getFullYear() +
      "-" +
      (startDate.getMonth() + 1) +
      "-" +
      startDate.getDate();
    const endDateString =
      endDate.getFullYear() +
      "-" +
      (endDate.getMonth() + 1) +
      "-" +
      endDate.getDate();
    axios
      .get(
        `/deals/by_status_date/${selectedTab.value.value}/${startDateString}/${endDateString}/10?page=${pageNum}`
      )
      .then((res) => {
        data.value = res.data;
        console.log("updated:", data.value);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};
const onTabSelection = (tab, index) => {
  selectedTab.value = tab;
  console.log(tab, index, range.value);
  fetchDeals(1);
};

const onRangeChange = (value) => {
  range.value = value;
  fetchDeals(1);
};

fetchDeals(1);
</script>

<template>
  <div
    class="__deals h-screen w-[calc(100vw-60px)] flex-col overflow-auto p-[36px]"
  >
    <HeaderTabs
      :title="'Deals'"
      :items="tabs"
      :range="range"
      @searchTextChange="(value) => (searchText = value)"
      @selected="onTabSelection"
      @dateChanged="onRangeChange"
      class="bg-foreground_light dark:bg-foreground_dark rounded-round bordered sticky z-40 mt-[24px] w-full p-[24px] !pb-0 duration-300"
    />
    <div class="mt-[36px] flex">
      <Card class="mr-[6px] h-[100px] w-full">
        <h4>Last Month's Commission</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="mx-[6px] h-[100px] w-full">
        <h4>EST. Current Month Commission</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="mx-[6px] h-[100px] w-full">
        <h4>EST. Inventory</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="ml-[6px] h-[100px] w-full">
        <h4>EST. Net Profit</h4>
        <h1>$0.00</h1>
      </Card>
    </div>
    <div class="mt-[36px]">
      <n-data-table
        :columns="columns"
        :data="deals"
        :bordered="false"
        :loading="isLoading"
      />
    </div>
    <n-pagination
      v-model:page="page"
      :page-count="pageCount"
      :on-update:page="onUpdatePage"
    />
  </div>
</template>

<style lang="scss" scoped>
h4 {
  @apply mb-[6px] max-w-[80%] text-center text-[9px] uppercase;
}
h1 {
  @apply text-2xl font-bold;
}
</style>
