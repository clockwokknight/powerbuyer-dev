<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useQuery } from "vue-query";
import axios from "axios";
const route = useRoute();

const { data: lanes } = useQuery("lanes", () =>
  axios.get("/lanes").then((res) => res.data)
);
const columns = [
  {
    title: "Lane #",
    key: "lane_number",
    fixed: "left",
    width: 100,
    // sorter: "default",
  },
  {
    title: "Sale Number",
    key: "sale_number",
    fixed: "left",
    width: 150,
    // sorter: "default",
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
    key: "address",
  },
  {
    title: "Model",
    key: "name",
    width: "max-content",
  },
  {
    title: "Body",
    key: "age",
  },
  {
    title: "Mileage",
    key: "address",
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
    title: "Color",
    key: "address",
  },
  {
    title: "DOP",
    key: "name",
  },
  {
    title: "VIN",
    key: "age",
  },
  {
    title: "T",
    key: "address",
  },
  {
    title: "Dealer",
    key: "name",
  },
  {
    title: "Designation Code",
    key: "age",
  },
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
];
const pagination = { pageSize: 10 };
</script>

<template>
  <!-- Main Tabs App Content -->
  <div class="h-screen w-[calc(100%-60px)]">
    <!-- Main Body Content-->
    <div class="h-screen overflow-auto bg-white px-5 py-5">
      <!-- Body Content -->
      <div class="mb-3">
        <h1 class="text-xl font-bold uppercase">Lane Numberings</h1>
      </div>
      <n-space vertical :size="12">
        <n-space>
          <n-popover placement="bottom" trigger="click">
            <template #trigger>
              <n-button>Sort By # </n-button>
            </template>
            <n-checkbox-group>
              <div class="flex flex-col gap-y-4">
                <n-checkbox value="No" label="No" />
                <n-checkbox value="lane_number" label="Lane Number" />
                <n-checkbox value="year" label="Year" />
              </div>
            </n-checkbox-group>
          </n-popover>
          <n-button>Filter Location (Dallas)</n-button>
          <n-button>Clear Filters</n-button>
          <n-button>Clear Sorters</n-button>
        </n-space>
        <n-data-table
          ref="table"
          :columns="columns"
          :data="lanes"
          :pagination="pagination"
          :max-height="1000"
          :scroll-x="3000"
          virtual-scroll
        />
      </n-space>
    </div>
  </div>
</template>
