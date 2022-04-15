<script>
import { Money3Directive } from "v-money3";

export default {
  directives: {
    money: Money3Directive,
  },
};
</script>

<script setup>
import { ref, watch, toRefs, reactive, computed, onMounted } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { useGlobalState } from "@/store/global";
import { useClipboard } from "@vueuse/core";
import { utils, log } from "@/lib/utils";
import { useMessage } from "naive-ui";
import { format, unformat } from "v-money3";

import MaskedCustomInput from "@/components/common/MaskedCustomInput.vue";

const emit = defineEmits(["update:value", "focus", "scroll", "edit", "save", "cancel"]);

const props = defineProps({
  basic: Boolean,
  currency: Boolean,
  validate: Array,
  value: [String, Number],
  type: String,
  label: String,
  placeholder: String,
  filterable: Boolean,
  options: Array,
  mask: String,
});

const { text, copy } = useClipboard();
const global = useGlobalState();
const message = useMessage();

const inputEl = ref(null);
const masked = ref(null);
const hoverInput = ref(false);
const focusing = ref(false);
const editing = ref(false);
const saved = ref(false);
const done = ref(false);

const saveButton = ref();
const editButton = ref();
const cancelButton = ref();

const caretX = ref("18px");
const caretFill = ref(hoverInput.value ? "#bdbdbd00" : "#bdbdbd");

const isValid = ref(false);

const themeOverrides = computed(() => {
  return {
    Input: {
      color: "rgba(0,0,0,0)",
      colorFocus: "rgb(0,0,0,0)",
      colorDisabled: "rgba(0,0,0,0)",
      textColorDisabled:
        props.type === "header" ? (global.isDark ? "#FFFFFFDD" : "#1E2023") : "#777",
      border: "none",
      borderHover: "none",
      borderDisabled: "none",
      borderFocus: "none",
      boxShadowFocus: "none",
      borderRadius: "64px",
      paddingSmall: "0px",
      paddingMedium: "0px",
      paddingLarge: "0px",
      placeholderColor: global.isDark ? "#555" : "#bdbdbd",
      fontSizeMedium: "12px",
    },
    Select: {
      peers: {
        InternalSelection: {
          color: "rgba(0,0,0,0)",
          colorFocus: "rgba(0,0,0,0)",
          colorDisabled: "rgba(0,0,0,0)",
          textColorDisabled:
            props.type === "header" ? (global.isDark ? "#FFFFFFDD" : "#1E2023") : "#777",
          border: "none",
          borderHover: "none",
          borderDisabled: "none",
          borderFocus: "none",
          borderRadius: "6px",
          boxShadowFocus: "none",
          paddingTiny: "0px",
          paddingSmall: "0px",
          paddingMedium: "0px",
          paddingLarge: "0px",
          placeholderColor: global.isDark ? "#777" : "#bdbdbd",
          fontSizeMedium: "14px",
        },
      },
    },
  };
});

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

onMounted(() => {
  if (!props.validate) isValid.value = true;
  //if (props.basic) editing.value = true;
});

function validation(input) {
  if (props.validate) {
    let tests = [];
    props.validate.forEach((test) => tests.push(validators[test](input)));
    return props.validate.length === tests.filter((test) => test).length;
  }
  return true;
}

function edit() {
  emit("edit");
  editing.value = true;
  caretX.value = "12px";
  caretFill.value = "#888888";
}

function cancel() {
  emit("cancel");
  focusing.value = false;
  editing.value = false;
  done.value = true;
  setTimeout(() => (done.value = false), 500);
  caretX.value = "18px";
  caretFill.value = hoverInput.value ? "#bdbdbd00" : "#bdbdbd";
}

function save() {
  editing.value = false;
  if (validation(props.value)) {
    emit("save");
    saved.value = true;
    setTimeout(() => (saved.value = false), 1000);
    done.value = true;
    setTimeout(() => (done.value = false), 500);
    caretX.value = "18px";
    caretFill.value = hoverInput.value ? "#bdbdbd00" : "#bdbdbd";
  } else {
    message.error("Invalid input");
    setTimeout(edit(), 300);
  }
}

function handleInput(e) {
  if (!props.currency) {
    emit("update:value", e);
  } else {
    parseFloat(unformat(e));
  }
  isValid.value = validation(e);
}

function handleCopy() {
  copy(props.value);
  message.success("Copied to clipboard");
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="__custom-input relative">
      <div class="flex">
        <label
          v-if="type !== 'header'"
          class="absolute z-40 translate-x-4 translate-y-[-2px] bg-transparent px-2 text-[9px] font-medium uppercase tracking-widest text-gray-600 dark:text-background_light"
        >
          <b
            class="text-red-600 duration-[300ms]"
            :class="
              !(validate && validate.includes('required') && (!value || value === '')) &&
              'mr-[-10px] scale-50 opacity-0'
            "
          >
            *
          </b>
          <span>{{ label || "label" }}</span>
          <div
            style="z-index: -1; width: calc(100% + 2px)"
            class="absolute bg-white dark:bg-transparent h-[3px] translate-x-[-9px] translate-y-[-8px] rounded-full border-none duration-200"
            :class="editing && (isValid ? 'dark:!bg-[#202D2C]' : 'dark:!bg-[#2D2020]')"
          ></div>
        </label>
      </div>

      <div
        class="mt-1 flex w-full"
        @mouseover="
          () => {
            hoverInput = true;
            caretFill = editing ? '#bdbdbd' : '#00000000';
          }
        "
        @mouseleave="
          () => {
            hoverInput = false;
            caretX = editing ? '12px' : '18px';
            caretFill = '#bdbdbd';
          }
        "
      >
        <div
          class="flex w-full items-center rounded-round border-[1px] dark:border-transparent duration-200"
          :class="`
            ${saved && 'ping'}
            ${
              type === 'header'
                ? 'dark:bg-transparent dark:!text-white'
                : 'dark:bg-dark_border'
            }
            ${
              (!type || type !== 'header' || global.isDark) &&
              editing &&
              isValid &&
              '!border-success shadow-lg shadow-success/10 dark:!bg-[#202D2C]'
            }
            ${
              (!type || type !== 'header') &&
              editing &&
              !isValid &&
              '!border-error shadow-lg shadow-error/10 dark:!bg-[#2D2020]'
            } 
            ${
              type === 'header' &&
              `
                ${
                  editing
                    ? `border-transparent !shadow-lg dark:shadow-[#00ff0008] pl-2`
                    : `!border-transparent`
                } 
                ${saved && 'ping'} 
              `
            }
        `"
        >
          <div
            @click="
              if (basic) {
                edit();
                focusing = true;
              }
            "
            @mouseenter="basic && type === 'select' && edit()"
            @mouseleave="basic && type === 'select' && !focusing && cancel()"
            class="__inputs w-full"
            :class="basic && 'cursor-text'"
          >
            <masked-custom-input
              ref="inputEl"
              :currency="currency"
              :value="currency ? format(value) : value"
              :type="type"
              :editing="editing"
              :masked="type !== 'select'"
              :mask="mask"
              :options="options"
              :placeholder="placeholder || mask"
              @input="(e) => handleInput(e)"
              @focus="(e) => $emit('focus', e)"
              @blur="cancel"
            />
          </div>

          <div
            v-if="!basic"
            class="__buttons flex items-center justify-center duration-200"
            :class="`
                ${(hoverInput || editing || type === 'header') && '!opacity-100'}
                ${type === 'header' ? 'opacity-100' : 'opacity-0'}
            `"
          >
            <!-- copy -->

            <button
              ref="copyButton"
              @click="handleCopy"
              class="__edit h-3 w-3 -translate-x-3 rounded-full dark:hover:opacity-50"
              :class="`
                    ${
                      editing
                        ? 'pointer-events-none scale-0 !opacity-0 duration-200'
                        : 'opacity-100 duration-100'
                    }
                    ${done && 'delay-[250ms]'}
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
                      editing
                        ? 'pointer-events-none scale-50 opacity-0 duration-200'
                        : 'opacity-100 duration-100'
                    }
                    ${done && 'delay-[250ms]'}
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
              :style="!editing && 'width: 0px !important'"
              class="__save h-5 w-5 -translate-x-2 duration-200"
              :class="`
                ${!isValid && 'pointer-events-none'}
                ${
                  !editing
                    ? 'pointer-events-none !scale-50 opacity-0'
                    : 'opacity-100 delay-100'
                }
              `"
            >
              <svg
                class="duration-200"
                :class="
                  !isValid
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
              :style="!editing && 'width: 0px !important'"
              class="__cancel ml-1 h-5 w-5 -translate-x-2 duration-200"
              :class="
                !editing
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
    </div>
  </n-config-provider>
</template>

<style>
.__header input {
  font-weight: bold !important;
}
.n-base-suffix__arrow {
  transition: 400ms cubic-bezier(0.22, 1, 0.36, 1) !important;
  transform: scale(1.2) translateX(v-bind(caretX)) !important;
}
.n-base-suffix__arrow svg path {
  fill: v-bind(caretFill) !important;
}
.n-base-selection__state-border {
  display: none !important;
}
.n-base-selection-input {
  background: transparent !important;
}
.ping {
  animation: ping 1s ease forwards;
}
@keyframes ping {
  from {
    @apply bg-[#00ff0020];
  }
  to {
    @apply bg-transparent;
  }
}
</style>
