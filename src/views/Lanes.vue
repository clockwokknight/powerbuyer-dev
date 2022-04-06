<script setup>
import { getAllLanes } from "@/hooks/lanes";
import { NTag } from "naive-ui";
import { computed, h, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "vue-query";
import axios from "axios";
import Filter from "@/components/lanes/Filter.vue";
const route = useRoute();
const filter = reactive({
  page: 1,
  per_page: 20,
  make: "chevrolet"
});
const { data: lanes, isFetching } = getAllLanes(filter);
const pagination = computed(() => ({
  pageSize: filter.per_page,
  page: filter.page,
  itemCount: lanes.value?.total ?? 1,
  pageCount: lanes.value?.last_page ?? 1,
}));



const sortStatesRef = ref([]);
const sortKeyMapOrderRef = computed(() =>
  sortStatesRef.value.reduce((result, { columnKey, order }) => {
    result[columnKey] = order;
    return result;
  }, {})
);



const columns = computed(() => [
  {
    title: "Lane #",
    key: "lane_number",
    fixed: "left",
    width: 100,
    sortOrder: sortKeyMapOrderRef.value.lane_number || false,
    sorter: {
      compare: (a, b) => a.lane_number - b.lane_number,
      multiple: 1,
    },
  },
  {
    title: "Sale Number",
    key: "sale_number",
    fixed: "left",
    width: 150,
    sortOrder: sortKeyMapOrderRef.value.sale_number || false,
    sorter: {
      compare: (a, b) => a.sale_number - b.sale_number,
      multiple: 2,
    },
  },
  {
    title: "VHR",
    key: "yellow_light",
    //fixed: 'left'
  },
  {
    title: "Year",
    key: "sale_year",
    // sorter: "default",
    // fixed: "left",
  },
  {
    title: "Make",
    key: "vehicle_make.name",
  },
  {
    title: "Model",
    key: "vehicle_model.name",
    width: "max-content",
  },
  {
    title: "Body",
    key: "deal.body",
  },
  {
    title: "Mileage",
    key: "deal.mileage",
  },

  {
    title: "C. Cost",
    key: "floor_price",
  },
  {
    title: "Trade In",
    key: "address",
  },
  {
    title: "M. Ready",
    key: "name",
  },
  {
    title: "M. Price",
    key: "age",
  },
  {
    title: "Interior Color",
    key: "interior_color.color"
  },
  {
    title: "Exterior Color",
    key: "exterior_color.color"
  },
  {
    title: "Purchased Date",
    key: "deal.date_purchased",
  },
  {
    title: "VIN",
    key: "deal.vin",
  },
  {
    title: "Dealer",
    key: "deal.dealer.name",
  },
  // {
  //   title: "Designation Code",
  //   key: "age",
  // },
  // {
  //   title: "Buyer Code",
  //   key: "address",
  // },
  // {
  //   title: "Grade",
  //   key: "age",
  // },
  // {
  //   title: "BCF",
  //   key: "address",
  // },
  // {
  //   title: "Car Notes",
  //   key: "name",
  // },
  // {
  //   title: "Inv. ID",
  //   key: "age",
  // },
  // {
  //   title: "Enable OVE",
  //   key: "address",
  // },
  // {
  //   title: "T. Notes",
  //   key: "notes",
  // },
  // {
  //   title: "W",
  //   key: "W",
  // },
  // {
  //   title: "V",
  //   key: "V",
  // },
]);

const handleSortChange = (sorters) => {
  console.log({ sorters });
  sortStatesRef.value = [].concat(sorters);
};
const handlePageChange = (current_page) => {
  filter.page = current_page;
};
</script>

<template>
  <!-- Main Tabs App Content -->
  <div class="h-screen w-[calc(100vw-60px)] ">
    <!-- Main Body Content-->
    <div class="h-screen w-full overflow-auto bg-white dark:bg-foreground_dark flex gap-x-5">
      <!-- Body Content -->
      <aside class=" max-w-[300px] w-full pt-5 pl-5">
        <h3 class="text-lg font-bold mb-3">
        Lane Filters
        </h3>
          <Filter />
      </aside>
      <main class="w-[calc(100%-360px)] pr-5 pt-5">
      <div class="mb-3">
        <h1 class="text-xl font-bold uppercase">Lane Numberings</h1>
      </div>
      <div>

        <n-data-table
          remote
          ref="table"
          :columns="columns"
          :data="lanes?.data"
          :pagination="pagination"
          :max-height="1000"
          :scroll-x="3000"
          :loading="isFetching"
          @update:page="handlePageChange"
          @update:sorter="handleSortChange"
        />
        <pre>
        </pre>
      </div>
      </main>
    </div>
  </div>
</template>
