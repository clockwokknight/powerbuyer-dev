<script setup>
import { masker, tokens } from "@/directives/mask";
import { watch, ref, toRefs } from "vue";

const emit = defineEmits(["update:value", "blur", "focus", "input"]);

const props = defineProps({
  value: [String, Number],
  currency: Boolean,
  type: String,
  mask: String,
  masked: Boolean,
  styles: String,
  disabled: Boolean,
  placeholder: String,
  options: Array,
  editing: Boolean,
});

const sampleOptions = ref([
  {
    label: "Option 1",
    value: 1,
  },
  {
    label: "Option 2",
    value: 2,
  },
  {
    label: "Option 3",
    value: 3,
  },
  {
    label: "Option 4",
    value: 4,
  },
  {
    label: "Option 5",
    value: 5,
  },
]);

const { mask, masked, value } = toRefs(props);
const display = ref(value.value);
const lastValue = ref(null);
const inputRef = ref(null);

watch(
  () => props.editing,
  (editing) =>
    setTimeout(() => (editing ? inputRef.value.focus() : inputRef.value.blur()), 300)
);

watch(
  () => value.value,
  (val) => {
    if (val !== lastValue.value) display.value = val;
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

function handleBlur(e) {
  let target = e.relatedTarget?.classList[0];
  if (target !== "__save" && target !== "__cancel") {
    emit("blur", e);
  }
}
</script>

<template>
  <n-input
    v-if="type !== 'select'"
    ref="inputRef"
    v-mask="mask"
    class="bg-transparent outline-none w-full pl-3 truncate"
    :class="`
      ${!editing && 'pointer-events-none'}
      ${
        type === 'header' &&
        '__header text-ellipsis bg-transparent outline-none w-full pl-1 py-1 text-2xl !font-bold placeholder:text-gray-300'
      }
    `"
    :placeholder="placeholder"
    :value="display"
    :disabled="!editing"
    :on-input="
      (e) => {
        refresh();
        $emit('input', e);
      }
    "
    @focus="(e) => $emit('focus', e)"
    @blur="handleBlur"
  >
    <template v-if="currency" #prefix> $ </template>
  </n-input>
  <n-select
    v-if="type === 'select'"
    ref="inputRef"
    class="bg-transparent outline-none w-full"
    :class="!editing && 'pointer-events-none'"
    :options="options || sampleOptions"
    :filterable="true"
    :placeholder="placeholder || 'Select'"
    :value="value"
    :disabled="!editing"
    :on-update:value="(e) => $emit('input', e)"
    @focus="(e) => $emit('focus', e)"
    @blur="handleBlur"
  />
</template>
