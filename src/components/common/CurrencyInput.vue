<script setup>
import { ref, watch } from "vue";

const currencySettings = {
  decimal: ".",
  thousands: ",",
  precision: 2,
};
const props = defineProps({
  modelValue: {
    type: Number,
  },
});

const emits = defineEmits(["update:modelValue"]);
const value = ref(props.modelValue);

const isDirty = ref(false);
const currentValue = props.modelValue;

watch(
  value,
  (newValue) => {
    if (newValue) {
      const modifiedValue = parseFloat(newValue.replace(",", ""));
      emits("update:modelValue", modifiedValue);
      isDirty.value = modifiedValue !== currentValue;
    }
  },
  { immediate: true }
);
</script>
<script>
import { VMoney } from "v-money";
export default {
  directives: {
    money: VMoney,
  },
};
</script>
<template>
  <div class="relative rounded-md">
    <div
      class="
        absolute
        inset-y-0
        left-0
        pl-3
        flex
        items-center
        pointer-events-none
      "
    >
      <span class="text-gray-500 sm:text-sm"> $ </span>
    </div>
    <n-input
      v-model:value.lazy="value"
      v-money="currencySettings"
      class="pl-7 static"
    />
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
        v-if="isDirty"
      >
        <span class="grid place-content-center">
          <button>
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
          <button>
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
