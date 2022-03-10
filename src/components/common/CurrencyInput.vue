<script setup>
import { format, unformat } from "v-money3";

defineProps({
  modelValue: {
    type: [Number, String],
  },
});

const emits = defineEmits(["update:modelValue"]);

const onChange = (newValue) => {
  emits("update:modelValue", parseFloat(unformat(newValue)));
};
</script>
<script>
import { Money3Directive } from "v-money3";
export default {
  directives: {
    money: Money3Directive,
  },
};
</script>
<template>
  <n-input :value="format(modelValue)" @update-value="onChange" type="tel">
    <template #prefix> $ </template>
  </n-input>
</template>
