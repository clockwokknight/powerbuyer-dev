<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

defineProps(["shouldVisible"]);

// const
const inputRef = ref(null);
const emits = defineEmits(["save", "revert"]);

const triggerUpdate = () => {
  emits("save");
};

const reset = () => {
  emits("revert");
};
</script>
<template>
  <div class="relative">
    <slot></slot>
    <transition
      enter-active-class="transition"
      enter-from-class="opacity-0"
      enter-to-class="opacity-1"
      leave-active-class="transition"
      leave-from-class="opacity-1"
      leave-to-class="opacity-0"
    >
      <div
        class="absolute -right-12 pl-3 flex gap-x-2 inset-y-0 items-center"
        v-if="shouldVisible"
      >
        <span class="grid place-content-center">
          <button @click="triggerUpdate">
            <svg
              class="w-4 h-4 text-gray-[#027BFF] hover:text-[#013975]"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </span>
        <span class="grid place-content-center">
          <button @click="reset">
            <svg
              class="w-4 h-4 text-gray-200 hover:text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <path
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
                fill="none"
                stroke="currentColor"
                stroke-miterlimit="10"
                stroke-width="32"
              ></path>
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M320 320L192 192"
              ></path>
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M192 320l128-128"
              ></path>
            </svg>
          </button>
        </span></div
    ></transition>
  </div>
</template>
