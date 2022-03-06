<script setup>
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import axios from "axios";
import { computed, ref, watch } from "vue";
import { getAuctionById } from "@/hooks/auctions";

const route = useRoute();

const routeParamId = ref(route.params?.id);
watch(
  () => route.params,
  (toParams, previousParams) => {
    if (toParams?.id) routeParamId.value = toParams?.id;
  },
  {
    immediate: true,
  }
);
const { data: auction, isLoading: isAuctionLoading } =
  getAuctionById(routeParamId);
</script>

<template>
  <div>
    <pre>

      {{ auction }}

    </pre>
  </div>
</template>
