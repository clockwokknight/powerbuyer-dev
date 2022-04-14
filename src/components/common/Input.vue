<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { useGlobalState } from "@/store/global";
import { log } from "@/lib/utils";

const global = useGlobalState();

const props = defineProps({
  label: String,
  autofocus: Boolean,
  autosize: Boolean,
  clearable: Boolean,
  defaultValue: [Number, String],
  debounce: Number,
  disabled: Boolean,
  inputProps: Object,
  loading: Boolean,
  maxlength: Number,
  minlength: Number,
  pair: Boolean,
  passivelyActivated: Boolean,
  placeholder: String,
  readonly: Boolean,
  round: Boolean,
  rows: Number,
  separator: String,
  showCount: Boolean,
  showPasswordOn: String,
  size: String,
  status: String,
  type: String,
  value: [Number, String],
});

const emit = defineEmits([
  "blur",
  "change",
  "clear",
  "focus",
  "input",
  "enter",
  "debounced",
  "typing",
  "update:value",
]);

const inputState = reactive({
  focused: false,
  typing: false,
  hovering: false,
});

const statusColor = computed(() => {
  const darkLight = (d, l) => (global.isDark ? (inputState.focused ? d : "#303033") : l);
  switch (props.status) {
    case "warning":
      return darkLight("#2E2A26", "#ffffff");
    case "error":
      return darkLight("#2D2226", "#ffffff");
    default:
      return darkLight("#202C2C", "#ffffff");
  }
});

watchEffect((onInvalidate) => {
  if (props.value.length > 0) {
    inputState.typing = true;
    emit("typing");
    const updateTypingStatus = setTimeout(() => {
      inputState.typing = false;
      emit("debounced");
    }, props.debounce || 2000);
    onInvalidate(() => {
      clearTimeout(updateTypingStatus);
    });
  }
});

function hasProp(prop) {
  return props[prop] ?? props[prop]?.length > 0;
}

function onBlur(e) {
  inputState.focused = false;
  emit("blur", e);
}

function onFocus(e) {
  inputState.focused = true;
  emit("focus", e);
}

function onKeyUp(e) {
  if (e.keyCode === 13) {
    log.green("pressed enter key: ", e.target.value);
    emit("enter", e);
  }
}

function onMouseLeave() {
  inputState.hovering = false;
}

function onMouseEnter() {
  if (!hasProp("disabled")) inputState.hovering = true;
}
</script>

<template>
  <div>
    <div class="relative">
      <label
        class="absolute z-40 translate-x-[12px] translate-y-[-6px] bg-transparent px-2 text-[9px] font-medium uppercase tracking-widest text-gray-600 dark:text-background_light"
      >
        <span>{{ label || "Label" }}</span>
        <div
          style="z-index: -2; width: calc(100% + 2px)"
          class="absolute h-[2px] translate-x-[-9px] translate-y-[-10px] dark:translate-y-[-8px]"
          :class="
            hasProp('status') || inputState.focused || inputState.hovering
              ? 'opacity-1 duration-[200ms]'
              : 'opacity-0 duration-[0ms] delay-[200ms]'
          "
          :style="`background: ${statusColor}`"
        ></div>
      </label>
    </div>
    <n-input
      class="py-[8px] pr-[8px] pl-[8px] w-full"
      :autofocus="autofocus"
      :autosize="autosize"
      :clearable="clearable"
      :default-value="defaultValue"
      :disabled="disabled"
      :input-props="inputProps"
      :loading="loading"
      :maxlength="maxlength"
      :minlength="minlength"
      :pair="pair"
      :passively-activated="passivelyActivated"
      :placeholder="placeholder"
      :readonly="readonly"
      :round="round"
      :rows="rows"
      :separator="separator"
      :show-count="showCount"
      :show-password-on="showPasswordOn"
      :size="size"
      :status="status"
      :type="type"
      :value="value"
      @blur="onBlur"
      @focus="onFocus"
      @keyup="onKeyUp"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @input="(e) => $emit('input', e)"
      @clear="(e) => $emit('clear', e)"
      @change="(e) => $emit('change', e)"
      @update:value="(e) => $emit('update:value', e)"
    />
  </div>
</template>
