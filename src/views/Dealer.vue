<script setup>
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import axios from "axios";
import { computed, ref, watch } from "vue";
import DealerContacts from "@/components/dealer/DealerContacts.vue";

const route = useRoute();

const routeParamId = ref(route.params?.id);
watch(
  () => route.params,
  (toParams) => {
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
    <DealerContacts />
  </div>
</template>
