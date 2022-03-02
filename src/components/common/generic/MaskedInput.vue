<script setup>
import { masker, tokens } from "@/directives/mask";
import { watch, ref, toRefs } from "vue";
import { utils } from "@/lib/utils";

const emit = defineEmits(["update:value", "blur", "focus", "on-input"]);

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
  styles: String,
  disabled: Boolean,
  placeholder: String,
});

const { mask, masked, value } = toRefs(props);
const display = ref(value.value);
const lastValue = ref(null);
const input = ref(null);

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

function refresh(value) {
  display.value = value;
  const val = masker(value, mask.value, masked.value, tokens);
  if (val !== lastValue.value) {
    lastValue.value = val;
    emit("update:value", val);
  }
}

function focus() {
  console.log("called input.focus() from CUstomInput.vue");
  nput.focus();
}
</script>

<template>
  <n-input
    ref="nput"
    v-mask="mask"
    :placeholder="placeholder"
    :class="styles"
    :value="display"
    :disabled="disabled"
    :on-input="
      (e) => {
        utils.log(e);
        refresh();
        $emit('on-input', e);
      }
    "
    @focus="(e) => $emit('focus', e)"
    @blur="
      (e) =>
        e.relatedTarget?.classList[0] !== '__save' &&
        e.relatedTarget?.classList[0] !== '__cancel' &&
        $emit('blur', e)
    "
  />
</template>
