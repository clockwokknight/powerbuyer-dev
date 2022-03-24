<script setup>
defineProps({
  showViewButton: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["edit", "confirm", "view"]);
</script>

<template>
  <div class="flex items-center justify-center gap-x-3">
    <n-button v-if="showViewButton" @click="$emit('view')" class="group">
      <n-icon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="group-hover:text-primary h-6 w-6 text-gray-300 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </n-icon>
    </n-button>
    <n-button @click="$emit('edit')" class="group">
      <n-icon
        ><svg
          class="group-hover:text-primary h-6 w-6 text-gray-300 transition-colors"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <path
              d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z"
              fill="currentColor"
            ></path>
          </g></svg
      ></n-icon>
    </n-button>
  </div>
</template>

<style>
button.n-button[type="button"] {
  --n-color: #000;
  background-color: var(--n-color);
}
</style>
