<template>
  <n-input class="truncate" :value="display" v-mask="mask" @input="refresh" />
</template>

<script setup>
import { masker, tokens } from "@/directives/mask";
import { watch, ref, toRefs } from "vue";

const emit = defineEmits(["update:value"]);

const props = defineProps({
  value: [String, Number],
  mask: {
    type: [String, Array],
    required: true,
  },
  masked: {
    type: Boolean,
    default: false,
  },
});
const { mask, masked, value } = toRefs(props);

const display = ref(value.value);
const lastValue = ref(null);

watch(
  () => value.value,
  (newValue) => {
    if (newValue !== lastValue.value) {
      display.value = newValue;
    }
  }
);

watch(
  () => masked.value,
  () => refresh(display.value)
);

const refresh = (value) => {
  display.value = value;
  const val = masker(value, mask.value, masked.value, tokens);
  if (val !== lastValue.value) {
    lastValue.value = val;
    emit("update:value", val);
  }
};
</script>
