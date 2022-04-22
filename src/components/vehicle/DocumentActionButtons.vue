<script setup>
defineEmits(["delete", "view"]);
</script>

<template>
  <div class="flex items-center justify-center gap-x-3">
    <n-button @click="$emit('view')" class="group">
      <n-icon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="
            group-hover:text-primary
            h-6
            w-6
            text-gray-300
            transition-colors
          "
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
    <n-button @click="$emit('delete')" class="group">
      <n-icon>
        <svg
          class="
            group-hover:text-primary
            h-6
            w-6
            text-gray-300
            transition-colors
          "
          viewBox="0 0 11 11"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.00007 9.72795L9.72803 1"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M9.72844 9.72795L1.00049 1"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
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
