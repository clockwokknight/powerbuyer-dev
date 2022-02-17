<script setup>
defineProps(["auctions"]);
defineEmits(["click:tab"]);
</script>

<template>
  <li
    v-for="auction in auctions"
    :key="auction?.id"
    class="px-4 py-4 border-b even:bg-[#f8f8fa] hover:bg-gray-100"
    @click="$emit('click:tab', auction)"
  >
    <router-link
      :to="{ name: 'SingleAuction', params: { id: auction?.id } }"
      active-class="text-primary"
      class="block"
    >
      <div>
        <h2 class="font-semibold whitespace-nowrap truncate max-w-[250px]">
          {{ auction?.auction_company }}
        </h2>
      </div>
      <div>{{ auction?.phone }}</div>
    </router-link>
  </li>
</template>
