<script setup>
import { ref, onMounted, watch } from "vue";
</script>

<template>
  <div
    class="__card border-[1px] rounded-round bg-foreground_light dark:bg-foreground_dark dark:border-dark_border border-transparent p-[24px] flex-col center-content"
  >
    <slot>No data...</slot>
  </div>
</template>
