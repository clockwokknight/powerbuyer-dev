<script setup>
defineProps(["vendors"]);
defineEmits(["click:tab"]);
</script>

<template>
  <li
    v-for="vendor in vendors"
    :key="vendor?.id"
    class="p-2 border-b-2"
    @click="$emit('click:tab', vendor)"
  >
    <!-- Company Name -->
    <router-link
      :to="{ name: 'SingleVendor', params: { id: vendor?.id } }"
      active-class="text-emerald-500"
      class="block"
    >
      {{ vendor?.name }}
    </router-link>
    <!-- City, State -->
    <!--						{{ vendor.city }}, {{ vendor.state }}-->
    <!-- Phone - Link Email -->
    <!--						{{ vendor.phone }} -	<a :href="`mailto:${vendor.email}`">{{ vendor.email }}</a>-->
  </li>
</template>
