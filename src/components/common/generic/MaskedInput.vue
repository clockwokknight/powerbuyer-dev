<script setup>
import { masker, tokens } from "@/directives/mask";
import { watch, ref, toRefs } from "vue";
import { utils } from "@/lib/utils";

const emit = defineEmits(["update:value", "blur", "focus", "input"]);

const props = defineProps({
  type: String,
  value: [String, Number],
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
  console.log("called input.focus() from CustomInput.vue");
  nput.focus();
}
</script>

<template>
  <n-input
    v-if="type !== 'select'"
    ref="nput"
    v-mask="mask"
    :placeholder="placeholder"
    class="bg-transparent outline-none w-full pl-3"
    :class="!editing && 'pointer-events-none'"
    :value="display"
    :disabled="!editing"
    :on-input="
      (e) => {
        refresh();
        $emit('input', e);
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
  <n-select
    v-if="type === 'select'"
    ref="nput"
    :options="options || sampleOptions"
    :filterable="true"
    :placeholder="placeholder || 'Select'"
    class="bg-transparent outline-none w-full pl-3"
    :class="!editing && 'pointer-events-none'"
    :value="value"
    :disabled="!editing"
    :on-input="
      (e) => {
        refresh();
        $emit('input', e);
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
