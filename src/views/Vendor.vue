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

const { data: vendor, isLoading } = useQuery(["product", routeParamId], () =>
  axios.get(`/vendors/${routeParamId.value}`).then((res) => res.data)
);
</script>

<template>
  <div class="px-4" v-if="!isLoading">
    <div class="flex gap-x-3">Name: {{ vendor?.name }}</div>
    <div class="flex gap-x-3">Tax ID Number: {{ vendor?.tax_id_number }}</div>
    <div class="flex gap-x-3">Address: {{ vendor.address_one }}</div>
    <div class="flex gap-x-3">
      City: {{ vendor?.city }}, State: {{ vendor?.state }}
    </div>
  </div>
</template>
