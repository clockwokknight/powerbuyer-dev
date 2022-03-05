<script setup>
defineProps(["vendors"]);
defineEmits(["click:tab"]);
</script>

<template>
  <li
    v-for="vendor in vendors"
    :key="vendor?.id"
    class="px-4 py-4 border-b dark:border-0 even:bg-[#f8f8fa] dark:even:bg-[#25272A] hover:bg-gray-100 dark:hover:bg-gray-900"
    @click="$emit('click:tab', vendor)"
  >
    <!-- Company Name -->
    <router-link
      :to="{ name: 'SingleVendor', params: { id: vendor?.id } }"
      active-class="text-primary"
      class="block"
    >
      <div>
        <h2 class="font-semibold whitespace-nowrap truncate max-w-[250px]">
          {{ vendor?.name }}
        </h2>
      </div>
      <div class="text-xs">{{ vendor.city }}, {{ vendor.state }}</div>
      <div>{{ vendor.phone }}</div>
    </router-link>
    <!-- City, State -->
    <!--						{{ vendor.city }}, {{ vendor.state }}-->
    <!-- Phone - Link Email -->
    <!--						{{ vendor.phone }} -	<a :href="`mailto:${vendor.email}`">{{ vendor.email }}</a>-->
  </li>
</template>
