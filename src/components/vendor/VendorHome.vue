<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTabsViewStore } from "@/store/tabs";

const router = useRouter();
const tabStore = useTabsViewStore();

onMounted(() => {
  if (tabStore.selectedIndex !== -1) {
    router.push(`/vendors/${tabStore.tabs[tabStore.selectedIndex]?.id}`);
  }
});
</script>
<template>Please select a tab</template>
