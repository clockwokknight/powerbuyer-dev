<script setup>
import { ref, onMounted, watch } from "vue";
import Card from "@/components/_refactor/Card.vue";
import HeaderTabs from "@/components/_refactor/HeaderTabs.vue";

const range = ref([118313526e4, Date.now()]);

const tabs = ref([
  {
    title: "All Inventory",
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
    title: "In-transit",
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
</script>

<template>
  <div class="page-container pt-0">
    <!-- '.page-container' sets whitespace etc for inner route content -->
    <HeaderTabs
      :title="'Inventory'"
      :items="tabs"
      :range="range"
      @searchTextChange="handleSearchTextChange"
      @selected="onTabSelection"
      @dateChanged="onRangeChange"
      class=""
    />
    <Card class="mt-[24px] w-full h-[350px]" />
    <div class="mt-[24px] flex">
      <Card class="mr-[6px] h-[100px] w-full">
        <h4># At Auction</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="mx-[6px] h-[100px] w-full">
        <h4># of Sold Vehicles this Year</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="mx-[6px] h-[100px] w-full">
        <h4>Value of Current Inventory</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="ml-[6px] h-[100px] w-full">
        <h4>Total Inventory #</h4>
        <h1>$0.00</h1>
      </Card>
    </div>
    <Card class="mt-[24px] w-full h-[350px]" />
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
