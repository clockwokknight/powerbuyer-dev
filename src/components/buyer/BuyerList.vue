<script setup>
defineProps(["buyers"]);
defineEmits(["click:tab"]);
</script>

<template>
  <li
    v-for="buyer in buyers"
    :key="buyer?.id"
    class="px-4 py-4 border-b even:bg-[#f8f8fa] hover:bg-gray-100"
    @click="$emit('click:tab', buyer)"
  >
    <router-link
      :to="{ name: 'SingleBuyer', params: { id: buyer?.id } }"
      active-class="text-primary"
      class="block"
    >
      <div>
        <h2 class="font-semibold whitespace-nowrap truncate max-w-[250px]">
          {{ buyer?.first_name }} {{ buyer?.last_name }}
        </h2>
      </div>
      <div class="text-xs">{{ buyer?.buyer_type?.name }}</div>
      <div>{{ buyer?.phone }}</div>
    </router-link>
  </li>
</template>
