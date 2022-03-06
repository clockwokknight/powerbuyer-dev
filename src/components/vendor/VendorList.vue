<script setup>
import { useRoute } from "vue-router";

defineProps(["vendors"]);
defineEmits(["click:tab"]);
const route = useRoute();
</script>

<template>
  <li
    v-for="vendor in vendors"
    :key="vendor?.id"
    class="relative border-b dark:border-0 px-4 py-4 even:bg-[#f8f8fa] dark:odd:bg-[#1E1F21] dark:even:bg-[#25272A] hover:bg-gray-100 dark:hover:bg-gray-900"
    @click="$emit('click:tab', vendor)"
  >
    <!-- Company Name -->
    <router-link
      :to="{ name: 'SingleVendor', params: { id: vendor?.id } }"
      active-class="text-primary dark:text-white"
      class="block"
    >
      <div>
        <h2 class="max-w-[250px] truncate whitespace-nowrap font-semibold">
          {{ vendor?.name }}
        </h2>
      </div>
      <div class="text-xs">{{ vendor.city }}, {{ vendor.state }}</div>
      <div>{{ vendor.phone }}</div>
    </router-link>
    <div v-if="vendor.id == route.params.id" class="hidden dark:block absolute inset-0 bg-[#027BFF] bg-opacity-25" id="mask" />
  </li>
</template>
