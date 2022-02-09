<script setup>
import { toRef, watch, ref, onUpdated } from "vue";
import compare from "just-compare";

const props = defineProps({
  modelValue: [String, Number],
  shouldUpdate: {
    type: Boolean,
    default: true,
  },
  resetValue: {
    type: [String, Number],
  },
});

const emits = defineEmits(["save", "update:modelValue"]);
const isDirty = ref(false);

onUpdated(() => {
  isDirty.value = !compare(props.resetValue, props.modelValue);
});

const triggerUpdate = (value) => emits("save", value);

const reset = () => {
  emits("update:modelValue", props.resetValue);
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
        class="absolute -right-20 pl-3 flex gap-x-2 inset-y-0 items-center"
        v-if="shouldUpdate && isDirty"
      >
        <span class="grid place-content-center">
          <button @click="triggerUpdate(modelValue)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 text-emerald-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span>
        <span class="grid place-content-center">
          <button @click="reset">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span></div
    ></transition>
  </div>
</template>
