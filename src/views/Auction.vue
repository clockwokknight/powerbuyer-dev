<script setup>
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import axios from "axios";
import { computed, ref, watch } from "vue";

const route = useRoute();

const routeParamId = ref(route.params?.id);
watch(
  () => route.params,
  (toParams, previousParams) => {
    console.log({ toParams, previousParams });
    if (route.params?.id) routeParamId.value = route.params?.id;
  }
);
const { data: auction, isLoading: isAuctionLoading } = useQuery(
  ["auction", routeParamId],
  ({ queryKey }) => {
    return axios
      .get(`/auctions/${routeParamId.value ?? 1}`)
      .then((res) => res.data);
  }
);
</script>

<template>
  <div>
    <pre>

      {{ auction }}

    </pre>
  </div>
</template>
