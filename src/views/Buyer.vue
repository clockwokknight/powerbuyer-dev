<script setup>
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import axios from "axios";
import { ref, watch } from "vue";

const route = useRoute();

const routeParamId = ref(route.params?.id);
watch(
  () => route.params?.id,
  () => {
    routeParamId.value = route.params?.id;
  }
);

const { data: buyer, isLoading } = useQuery(["buyer", routeParamId], () =>
  axios.get(`/buyers/${routeParamId.value ?? 1}`).then((res) => res.data)
);
</script>

<template>
  <div class="px-4" v-if="!isLoading">
    <pre>
    {{ buyer }}
  </pre
    >
  </div>
</template>
