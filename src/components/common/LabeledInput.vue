<script setup>
import { ref, onMounted, watch } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";

const props = defineProps([
  "label",
  "autofocus",
  "autosize",
  "clearable",
  "default-value",
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

defineEmits(["blur", "change", "clear", "focus", "input", "update:value"]);
</script>

<template>
  <div>
    <div class="relative">
      <label
        class="absolute left-[0px] top-[0px] z-40 translate-x-[12px] translate-y-[-6px] bg-transparent px-2 text-[9px] font-medium uppercase tracking-widest text-gray-600 dark:text-background_light"
      >
        <span>{{ label || "Label" }}</span>
        <div
          style="z-index: -1; width: calc(100% + 2px)"
          class="absolute bg-white dark:bg-transparent h-[3px] translate-x-[-9px] translate-y-[-8px] rounded-full border-none duration-200"
          :class="editing && (isValid ? 'dark:!bg-[#202D2C]' : 'dark:!bg-[#2D2020]')"
        ></div>
      </label>
    </div>
    <n-input
      class="py-[8px] pr-[8px] pl-[6px] w-full"
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
      :on-blur="(e) => $emit('blur', e)"
      :on-change="(e) => $emit('change', e)"
      :on-clear="(e) => $emit('clear', e)"
      :on-focus="(e) => $emit('focus', e)"
      :on-input="(e) => $emit('input', e)"
      :on-update:value="(e) => $emit('update:value', e)"
    />
  </div>
</template>
