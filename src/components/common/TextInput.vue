<script setup>
import { ref, watch } from "vue";

const currencySettings = {
  decimal: ".",
  thousands: ",",
  precision: 2,
  masked: false,
};
const props = defineProps({
  modelValue: {
    type: Number,
  },
});

const emits = defineEmits(["update:modelValue"]);
const value = ref(props.modelValue);
watch(value, (newValue) => {
  emits("update:modelValue", newValue);
});
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
    <input
      v-model.lazy="value"
      v-money="currencySettings"
      class="
        rounded
        focus:ring-emerald-500 focus:border-emerald-500
        block
        w-full
        pl-7
        pr-12
        py-2
        sm:text-sm
        border-gray-400
        rounded-md
      "
    />
  </div>
</template>
