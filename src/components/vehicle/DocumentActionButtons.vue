<script setup>
defineEmits(["delete", "view"]);
</script>

<template>
  <div class="flex items-center justify-center gap-x-3">
    <n-button @click="$emit('view')" class="group">
      <n-icon>
        <img class="hidden dark:block" src="../../assets/open-dark.svg" />
        <img class="block dark:hidden" src="../../assets/open-light.svg" />
      </n-icon>
    </n-button>
    <n-button @click="$emit('delete')" class="group">
      <n-icon>
        <img class="hidden dark:block" src="../../assets/delete-dark.svg" />
        <img class="block dark:hidden" src="../../assets/delete-light.svg" />
      </n-icon>
    </n-button>
  </div>
</template>

<style>
button.n-button[type="button"] {
  --n-color: #000;
  background-color: var(--n-color);
}
</style>
