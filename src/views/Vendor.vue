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

const { data: vendor, isFetching } = useQuery(["product", routeParamId], () =>
  axios.get(`/vendors/${routeParamId.value}`)
);
</script>

<template>
  <div class="grid place-content-end" v-if="isFetching">
    <svg
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
  <pre class="whitespace-pre-wrap">
        {{ vendor }}
    </pre
  >
</template>
