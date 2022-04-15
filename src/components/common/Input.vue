<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect } from "vue";
import { useGlobalState } from "@/store/global";
import { masker, tokens } from "@/directives/mask";
import { useClipboard } from "@vueuse/core";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { useMessage } from "naive-ui";
import { log } from "@/lib/utils";

const props = defineProps({
  autofocus: Boolean,
  autosize: Boolean,
  editable: Boolean,
  clearable: Boolean,
  defaultValue: [Number, String],
  debounce: Number,
  disabled: Boolean,
  inputProps: Object,
  label: String,
  loading: Boolean,
  mask: String,
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
  rules: Array,
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
  "edit",
  "cancel",
  "save",
  "update:value",
]);

const global = useGlobalState();
const message = useMessage();
const { copy } = useClipboard();

const inputEl = ref();

const inputState = reactive({
  hovering: false,
  focused: false,
  typing: false,
  isValid: null,
  status: null,
});

// `editableState` shares the same state as `inputState`, but not vice versa
const editableState = reactive({
  hovering: false,
  editing: false,
  focused: false,
  done: false,
  saved: false,
  lastSaved: null,
  height: null,
});

// Debounce can be set as prop and handled on emit `@debounced`
watchEffect((onInvalidate) => {
  if (props.value?.length > 0 && hasProp("debounce")) {
    inputState.typing = true;
    emit("typing");
    const updateTypingStatus = setTimeout(() => {
      inputState.typing = false;
      emit("debounced");
    }, props.debounce);
    onInvalidate(() => {
      clearTimeout(updateTypingStatus);
    });
  }
});

watch(
  () => inputState.isValid,
  (val) => {
    inputState.status = val ? "" : "error";
  }
);

onMounted(() => {
  if (hasProp("status")) {
    inputState.status = props.status;
  }
  inputState.isValid = validate(props.value);
  editableState.lastSaved = props.value;

  const target = inputEl.value.$el;

  if (target.classList.contains("n-input--textarea")) {
    editableState.height = target.offsetHeight + "px";
  } else {
    editableState.height = "42px";
  }
});

function validate(input) {
  if (props.rules && props.rules.length > 0) {
    let tests = [];
    props.rules?.forEach((test) => tests.push(global.validators[test](input)));
    return props.rules?.length === tests.filter((test) => test)?.length;
  }
  return true;
}

function hasProp(prop) {
  return props[prop] ?? props[prop]?.length > 0;
}

// --- masks ---

function refreshMask(value) {
  const val = masker(value, props.mask, true, tokens);
  log.yellow("val", val);
  emit("update:value", val);
}

// --- handle enter key press ---

function onKeyUp(e) {
  if (props.editable && e.keyCode === 13) {
    save();
  }
}

// --- handle hover events ---

function onMouseLeave(e) {
  inputState.hovering = false;
}

function onMouseEnter(e) {
  if (!hasProp("disabled")) {
    inputState.hovering = true;
  }
}

function onEditableMouseLeave(e) {
  editableState.hovering = false;
}

function onEditableMouseEnter(e) {
  editableState.hovering = true;
}

// --- handle n-input events ---

function onUpdate(e) {
  if (hasProp("mask")) {
    const val = masker(e, props.mask, true, tokens);
    inputState.isValid = validate(val);
    emit("update:value", val);
  } else {
    inputState.isValid = validate(e);
    emit("update:value", e);
  }
}

function onFocus(e) {
  emit("focus", e);
  inputState.focused = true;
}

function onBlur(e) {
  if (props.editable) {
    if (e.relatedTarget?.classList.contains("__save")) save();
    else cancel();
  }
}

function handleMousedown(e) {
  const target = inputEl.value.$el;

  if (target.classList.contains("n-input--textarea")) {
    editableState.height = target.offsetHeight + "px";
    log.cyan(target.offsetHeight);
  } else {
    editableState.height = "42px";
  }
}

function handleMouseup(e) {
  const target = inputEl.value.$el;

  if (target.classList.contains("n-input--textarea")) {
    editableState.height = target.offsetHeight + "px";
    log.cyan(target.offsetHeight);
  } else {
    editableState.height = "42px";
  }
}

// --- handle editable events ---

function cancel() {
  emit("cancel");
  emit("update:value", editableState.lastSaved); // setting last saved value at Input level
  editableState.focused = false;
  editableState.editing = false;
  editableState.done = true;
  inputEl.value.blur();
  setTimeout(() => (editableState.done = false), 500);
}

function edit() {
  emit("edit");
  inputEl.value.focus();
  editableState.editing = true;
  editableState.done = false;
  editableState.saved = false;
}

function save() {
  if (inputState.isValid) {
    emit("save");
    editableState.saved = true;
    editableState.lastSaved = props.value;
    inputEl.value.blur();
    setTimeout(() => (editableState.saved = false), 1000);
    editableState.done = true;
    setTimeout(() => (editableState.saved = false), 500);
    editableState.editing = false;
  } else {
    message.error("Invalid input");
    inputState.status = "error";
    setTimeout(edit(), 300);
  }
}

function handleCopy() {
  copy(props.value);
  message.success("Copied to clipboard");
}

// --- dynamic classes/styles ---

const statusColor = computed(() => {
  const darkLight = (d, l) => (global.isDark ? (inputState.focused ? d : "#303033") : l);
  switch (inputState.status) {
    case "warning":
      return darkLight("#2E2A26", "#ffffff");
    case "error":
      return darkLight("#2D2226", "#ffffff");
    default:
      return darkLight("#202C2C", "#ffffff");
  }
});

const hideUntilActive = computed(() => {
  return `
    ${
      editableState.editing || !editableState.hovering
        ? "pointer-events-none scale-0 !opacity-0 duration-200"
        : "opacity-100 duration-100"
    }
  `;
});

const shiftEditableOverlay = computed(() => {
  return `
    ${
      editableState.editing || editableState.focused
        ? "translate-x-[-68px] w-[68px]"
        : "translate-x-[0px] w-full"
    }
    ${editableState.saved && "ping"}
  `;
});
</script>

<template>
  <div>
    <div class="relative" style="height: inherit">
      <label class="__label">
        <b
          class="text-red-600 duration-[300ms]"
          :class="
            !(rules && rules?.includes('required') && (!value || value === '')) &&
            'mr-[-10px] scale-50 opacity-0'
          "
        >
          *
        </b>
        <span>{{ label || "Label" }}</span>
        <div
          style="z-index: -2; width: calc(100% + 2px)"
          :style="`background: ${statusColor}`"
          class="absolute h-[2px] translate-x-[-9px] translate-y-[-8px]"
          :class="
            hasProp('status') ||
            !inputState.isValid ||
            inputState.focused ||
            inputState.hovering
              ? 'opacity-1 duration-[200ms]'
              : global.isDark && 'opacity-0 duration-[0ms] delay-[200ms]'
          "
        ></div>
      </label>
    </div>
    <div
      v-if="hasProp('editable')"
      class="relative z-50 h-[inherit]"
      :class="(editableState.editing || editableState.focused) && 'float-right'"
    >
      <div
        class="absolute flex items-start pt-[10px] justify-end"
        :class="shiftEditableOverlay"
        :style="`height:${editableState.height}`"
        @mouseenter="onEditableMouseEnter"
        @mouseleave="onEditableMouseLeave"
      >
        <div class="mr-[12px] flex items-center">
          <!-- copy -->
          <button
            ref="copyButton"
            @click="handleCopy"
            class="__edit h-3 w-3 -translate-x-3 rounded-full dark:hover:opacity-50"
            :class="hideUntilActive"
          >
            <svg
              class="fill-black dark:fill-white hover:fill-success"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              ></path>
            </svg>
          </button>
          <!-- edit -->
          <button
            ref="editButton"
            @click="edit"
            class="__edit h-3 w-3 -translate-x-1 rounded-full dark:hover:opacity-50"
            :class="hideUntilActive"
          >
            <svg
              class="fill-black dark:fill-white hover:fill-success"
              viewBox="0 0 24 24"
            >
              <path
                d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z"
              ></path>
            </svg>
          </button>
          <!-- save -->
          <button
            ref="saveButton"
            @click="save"
            :style="!editableState.editing && 'width: 0px !important'"
            class="__save h-5 w-5 duration-200"
            :class="`
                ${!inputState.isValid && 'pointer-events-none'}
                ${
                  !editableState.editing
                    ? 'pointer-events-none !scale-50 opacity-0'
                    : 'opacity-100 delay-100'
                }
              `"
          >
            <svg
              class="duration-200"
              :class="
                !inputState.isValid
                  ? 'fill-gray-200 dark:opacity-[0.1]'
                  : 'fill-success hover:brightness-[1.5]'
              "
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm3.22 6.97l-4.47 4.47l-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 1 0-1.06-1.06z"
              ></path>
            </svg>
          </button>
          <!-- cancel -->
          <button
            ref="cancelButton"
            @click="cancel"
            :style="!editableState.editing && 'width: 0px !important'"
            class="__cancel ml-1 h-5 w-5 duration-200"
            :class="
              !editableState.editing
                ? 'pointer-events-none !scale-50 opacity-0 delay-100'
                : 'opacity-100'
            "
          >
            <svg
              class="duration-200 rotate-45 fill-gray-400 hover:fill-black dark:hover:fill-white"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 5a.75.75 0 0 0-.743.648l-.007.102v3.5h-3.5a.75.75 0 0 0-.102 1.493l.102.007h3.5v3.5a.75.75 0 0 0 1.493.102l.007-.102v-3.5h3.5a.75.75 0 0 0 .102-1.493l-.102-.007h-3.5v-3.5A.75.75 0 0 0 12 7z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <n-input
      ref="inputEl"
      class="py-[4px] pl-[4px] pr-[4px] w-full truncate"
      :class="`
        ${
          editable && !editableState.editing
            ? 'pointer-events-none'
            : 'pointer-events-all'
        }
      `"
      :autofocus="autofocus"
      :autosize="autosize"
      :clearable="clearable"
      :default-value="defaultValue"
      :disabled="disabled || (editable && !editableState.editing)"
      :input-props="inputProps"
      :loading="loading"
      :maxlength="maxlength"
      :minlength="minlength"
      :pair="pair"
      :passively-activated="passivelyActivated"
      :placeholder="placeholder || mask || ''"
      :readonly="readonly"
      :round="round"
      :rows="rows"
      :separator="separator"
      :show-count="showCount"
      :show-password-on="showPasswordOn"
      :size="size"
      :status="inputState.status"
      :type="type"
      :value="value"
      @blur="onBlur"
      @focus="onFocus"
      @keyup="onKeyUp"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @update:value="onUpdate"
      @mousedown="handleMousedown"
      @mouseup="handleMouseup"
      @input="(e) => $emit('input', e)"
      @clear="(e) => $emit('clear', e)"
      @change="(e) => $emit('change', e)"
    />
  </div>
</template>

<style lang="scss" scoped>
.__label {
  @apply absolute z-40 translate-x-[8px] translate-y-[-6px] bg-transparent px-2 text-[9px] font-medium uppercase tracking-widest text-gray-600 dark:text-background_light;
}
button {
  cursor: pointer;
}
.ping {
  animation: ping 1s ease forwards;
}
@keyframes ping {
  from {
    @apply bg-[#ffee0022];
  }
  to {
    @apply bg-transparent;
  }
}
</style>
