<script setup>
defineProps(["vendors"]);
defineEmits(["click:tab"]);
</script>

<template>
  <li
    v-for="vendor in vendors"
    :key="vendor?.id"
    class="border-b px-4 py-4 even:bg-[#f8f8fa] dark:even:bg-[#25272A] hover:bg-gray-100 dark:hover:bg-gray-900"
    @click="$emit('click:tab', vendor)"
  >
    <!-- Company Name -->
    <router-link
      :to="{ name: 'SingleVendor', params: { id: vendor?.id } }"
      active-class="text-primary"
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
  </li>
</template>
