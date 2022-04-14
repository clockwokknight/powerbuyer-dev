<script setup>
import { ref, reactive, computed, onMounted, watchEffect } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { log } from "@/lib/utils";

const props = defineProps([
  "label",
  "autofocus",
  "autosize",
  "clearable",
  "default-value",
  "debounce",
  "disabled",
  "input-props",
  "loading",
  "maxlength",
  "minlength",
  "pair",
  "passively-activated",
  "placeholder",
  "readonly",
  "round",
  "rows",
  "separator",
  "show-count",
  "show-password-on",
  "size",
  "status",
  "type",
  "value",
]);

const emit = defineEmits([
  "blur",
  "change",
  "clear",
  "focus",
  "input",
  "debounced",
  "update:value",
]);

const inputState = reactive({
  focused: false,
  typing: false,
});

const statusColor = computed(() => {
  switch (props.status) {
    case "success":
      return "green";
    case "warning":
      return "orange";
    case "error":
      return "red";
    default:
      return "";
  }
});

watchEffect((onInvalidate) => {
  if (props.value.length > 0) {
    inputState.typing = true;
    const updateTypingStatus = setTimeout(() => {
      inputState.typing = false;
      emit("debounced");
    }, props.debounce || 2000);
    onInvalidate(() => {
      clearTimeout(updateTypingStatus);
    });
  }
});

function onBlur(e) {
  inputState.focused = false;
  emit("blur", e);
}

function onFocus(e) {
  inputState.focused = true;
  emit("focus", e);
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
          style="z-index: -1; width: calc(100% + 2px)"
          class="absolute bg-white h-[4px] dark:h-[2px] translate-x-[-9px] translate-y-[-10px] dark:translate-y-[-8px]"
          :class="inputState.focused ? `dark:bg-[${statusColor}]` : 'dark:bg-[#303033]'"
        ></div>
      </label>
    </div>
    <n-input
      class="py-[8px] pr-[8px] pl-[8px] w-full rounded-round"
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
      :on-blur="onBlur"
      :on-focus="onFocus"
      :on-change="(e) => $emit('change', e)"
      :on-clear="(e) => $emit('clear', e)"
      :on-input="(e) => $emit('input', e)"
      :on-update:value="(e) => $emit('update:value', e)"
    />
  </div>
</template>
