<script setup>
defineProps(["dealers"]);
defineEmits(["click:tab"]);
</script>

<template>
  <li
    v-for="dealer in dealers"
    :key="dealer?.id"
    class="border-b px-4 py-4 even:bg-[#f8f8fa] hover:bg-gray-100"
    @click="$emit('click:tab', dealer)"
  >
    <router-link
      :to="{ name: 'SingleDealer', params: { id: dealer?.id } }"
      active-class="text-primary"
      class="block"
    >
      <div>
        <h2 class="max-w-[250px] truncate whitespace-nowrap font-semibold">
          {{ dealer?.name }}
        </h2>
      </div>
      <!--      <div>{{ dealer?.phone }}</div>-->
    </router-link>
  </li>
</template>
