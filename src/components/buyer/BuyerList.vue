<script setup>
defineProps(["buyers"]);
defineEmits(["click:tab"]);
</script>

<template>
  <li
    v-for="buyer in buyers"
    :key="buyer?.id"
    class="relative mb-[12px] ml-[13px] mr-[13px] rounded-round border-b-[1px] border-b-transparent px-3 py-2 duration-100 odd:bg-white hover:bg-background_light dark:border-b-transparent dark:odd:bg-foreground_dark dark:even:bg-foreground_dark dark:hover:bg-background_dark"
    @click="$emit('click:tab', buyer)"
  >
    <router-link
      :to="{ name: 'SingleBuyer', params: { id: buyer?.id } }"
      active-class="text-primary"
      class="block"
    >
      <div>
        <h2 class="max-w-[250px] truncate whitespace-nowrap font-semibold">
          {{ buyer?.first_name }} {{ buyer?.last_name }}
        </h2>
      </div>
      <div class="text-xs">{{ buyer?.buyer_type?.name }}</div>
      <div>{{ buyer?.phone }}</div>
    </router-link>
  </li>
</template>
