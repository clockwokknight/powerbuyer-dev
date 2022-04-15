<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { useMessage } from "naive-ui";
import { useClipboard } from "@vueuse/core";
import { useGlobalState } from "@/store/global";
import { log } from "@/lib/utils";

const props = defineProps({
  label: String,
  autofocus: Boolean,
  autosize: Boolean,
  editable: Boolean,
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
const { text, copy } = useClipboard();

const validators = {
  required: (input) => {
    return input && input !== "";
  },
  phone: (input) => {
    return /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(input);
  },
  email: (input) => {
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
      input
    );
  },
  // add further validators here
};

const inputEl = ref();

const inputState = reactive({
  hovering: false,
  focused: false,
  typing: false,
  status: "",
  isValid: true,
});

const editableState = reactive({
  hovering: false,
  editing: false,
  focused: false,
  done: false,
  saved: false,
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
  if (props.value?.length > 0 && hasProp("debounce")) {
    inputState.typing = true;
    emit("typing");
    const updateTypingStatus = setTimeout(() => {
      log.cyan("waiting to fetch...");
      inputState.typing = false;
      emit("debounced");
    }, props.debounce);
    onInvalidate(() => {
      log.yellow("invalidated");
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
  // validate input on mount
  inputState.isValid = validate(props.value);
});

function validate(input) {
  if (props.rules) {
    let tests = [];
    props.rules?.forEach((test) => tests.push(validators[test](input)));
    log.yellow(
      "validating...",
      props.rules?.length === tests.filter((test) => test)?.length
    );
    return props.rules?.length === tests.filter((test) => test)?.length;
  }
  return true;
}

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
    save();
  }
}

function onMouseLeave() {
  inputState.hovering = false;
}

function onMouseEnter() {
  if (!hasProp("disabled")) {
    inputState.hovering = true;
  }
}

function onEditableMouseLeave() {
  editableState.hovering = false;
}

function onEditableMouseEnter() {
  editableState.hovering = true;
}

function onInput(e) {
  emit("input", e);
  inputState.isValid = validate(e);
}

function handleCopy() {
  copy(props.value);
  message.success("Copied to clipboard");
}

function edit() {
  emit("edit");
  inputEl.value.focus();
  editableState.editing = true;
  editableState.done = false;
  editableState.saved = false;
}

function cancel() {
  emit("cancel");
  inputEl.value.blur();
  editableState.focused = false;
  editableState.editing = false;
  editableState.done = true;
  setTimeout(() => (editableState.done = false), 500);
  //caretX.value = "18px";
  //caretFill.value = hoverInput.value ? "#bdbdbd00" : "#bdbdbd";
}

function save() {
  editableState.editing = false;
  if (validation(props.value)) {
    emit("save");
    inputEl.value.blur();
    editableState.saved = true;
    setTimeout(() => (editableState.saved = false), 1000);
    editableState.done = true;
    setTimeout(() => (editableState.saved = false), 500);
    //caretX.value = "18px";
    //caretFill.value = editableState.saved ? "#bdbdbd00" : "#bdbdbd";
  } else {
    message.error("Invalid input");
    inputState.status = "error";
    setTimeout(edit(), 300);
  }
}
</script>

<template>
  <div>
    <div class="relative">
      <label
        class="absolute z-40 translate-x-[8px] translate-y-[-6px] bg-transparent px-2 text-[9px] font-medium uppercase tracking-widest text-gray-600 dark:text-background_light"
      >
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
          class="absolute h-[2px] translate-x-[-9px] translate-y-[-10px] dark:translate-y-[-8px]"
          :class="
            hasProp('status') ||
            !inputState.isValid ||
            inputState.focused ||
            inputState.hovering
              ? 'opacity-1 duration-[200ms]'
              : 'opacity-0 duration-[0ms] delay-[200ms]'
          "
          :style="`background: ${statusColor}`"
        ></div>
      </label>
    </div>
    <div v-if="hasProp('editable')" class="relative">
      <div
        class="__editable-overlay absolute w-full h-[42px] pl-[12px] flex items-center justify-end"
        @mouseenter="onEditableMouseEnter"
        @mouseleave="onEditableMouseLeave"
      >
        <div
          class="mr-[12px] duration-[200ms]"
          :class="!editableState.hovering && 'opacity-0 pointer-events-none'"
        >
          <!-- copy -->
          <button
            ref="copyButton"
            @click="handleCopy"
            class="__edit h-3 w-3 -translate-x-3 rounded-full dark:hover:opacity-50"
            :class="`
                      ${
                        editableState.editing
                          ? 'pointer-events-none scale-0 !opacity-0 duration-200'
                          : 'opacity-100 duration-100'
                      }
                      ${editableState.done && 'delay-[250ms]'}
                  `"
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
            :class="`
                      ${
                        editableState.editing
                          ? 'pointer-events-none scale-50 opacity-0 duration-200'
                          : 'opacity-100 duration-100'
                      }
                      ${editableState.done && 'delay-[250ms]'}
                  `"
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
            class="__save h-5 w-5 -translate-x-2 duration-200"
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
                  : 'fill-success hover:opacity-60'
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
            class="__cancel ml-1 h-5 w-5 -translate-x-2 duration-200"
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
      class="py-[4px] pr-[4px] pl-[4px] w-full"
      :class="
        hasProp('editable') && !editableState.editing
          ? 'pointer-events-none'
          : 'pointer-events-all'
      "
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
      :placeholder="placeholder || ''"
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
      @input="onInput"
      @clear="(e) => $emit('clear', e)"
      @change="(e) => $emit('change', e)"
      @update:value="(e) => $emit('update:value', e)"
    />
  </div>
</template>
