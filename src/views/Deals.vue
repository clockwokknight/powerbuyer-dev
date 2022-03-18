<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DataTable from "@/components/_refactor/DataTable.vue";
import Card from "@/components/_refactor/Card.vue";
import HeaderTabs from "@/components/_refactor/HeaderTabs.vue";

const route = useRoute();

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

const range = ref([118313526e4, Date.now()]);

onMounted(() => {
  console.log(route);
});
</script>

<template>
  <div class="__deals flex-col w-[calc(100vw-60px)] h-screen p-[36px]">
    <HeaderTabs
      :title="'Deals'"
      :items="tabs"
      :range="range"
      class="bg-foreground_light dark:bg-foreground_dark sticky z-40 mt-[24px] w-full rounded-round duration-300 bordered p-[24px] !pb-0"
    />
    <div class="flex mt-[36px]">
      <Card class="w-full mr-[6px] h-[100px]">
        <h4>Last Month's Commission</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="w-full mx-[6px] h-[100px]">
        <h4>EST. Current Month Commission</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="w-full mx-[6px] h-[100px]">
        <h4>EST. Inventory</h4>
        <h1>$0.00</h1>
      </Card>
      <Card class="w-full ml-[6px] h-[100px]">
        <h4>EST. Net Profit</h4>
        <h1>$0.00</h1>
      </Card>
    </div>
    <Card class="w-full h-[350px] mt-[36px]" />
    <!--DataTable class="mt-[48px]" /-->
  </div>
</template>

<style lang="scss" scoped>
h4 {
  @apply text-[9px] max-w-[80%] text-center mb-[6px] uppercase;
}
h1 {
  @apply font-bold text-2xl;
}
</style>
