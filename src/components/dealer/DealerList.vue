<script setup>
defineProps(["dealers"]);
defineEmits(["click:tab"]);
</script>

<template>
  <li
    v-for="dealer in dealers"
    :key="dealer?.id"
    class="border-b dark:border-[0px] px-4 py-4 odd:bg-[#ffffff] dark:odd:bg-foreground_dark even:bg-[#f8f8fa] dark:even:bg-foreground_dark hover:bg-gray-100 dark:hover:bg-background_dark"
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
