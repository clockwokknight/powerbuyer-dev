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
    if (toParams?.id) routeParamId.value = toParams?.id;
  },
  {
    immediate: true,
  }
);
const { data: dealer, isLoading } = useQuery(
  ["dealer", routeParamId],
  ({ queryKey }) => axios.get(`/dealers/${queryKey[1]}`).then((res) => res.data)
);
</script>

<template>
  <div>
    <pre>
      {{ dealer }}
    </pre>
  </div>
</template>
