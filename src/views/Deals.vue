<script setup>
import { ref, onMounted, watch } from "vue";
import DataTable from "@/components/_refactor/DataTable.vue";
import Card from "@/components/_refactor/Card.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

onMounted(() => {
  console.log(route);
});
</script>

<template>
  <div class="__deals flex center-content w-[calc(100vw-60px)] h-screen p-[24px]">
    <div class="flex w-[calc(100vw-60px)] mt-[48px]">
      <Card class="w-full mr-[12px] h-[100px]">Some content for this lovely card</Card>
      <Card class="w-full mx-[12px] h-[100px]">Content for the 2nd card</Card>
      <Card class="w-full mx-[12px] h-[100px]"></Card>
      <Card class="w-full ml-[12px] h-[100px]">Have a swell day</Card>
    </div>
    <!--DataTable class="mt-[48px]" /-->
  </div>
</template>

<style lang="scss" scoped></style>
