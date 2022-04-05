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
  <div class="page-container">
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
  </div>
</template>

<style lang="scss" scoped></style>
