<script setup>
import { ref, toRefs, reactive, computed, onMounted } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { useMessage } from "naive-ui";
import { useVendors } from "@/store/vendors";
import { utils } from "@/lib/utils";
import MaskedCustomInput from "@/components/common/MaskedCustomInput.vue";

const emit = defineEmits(["update:value", "focus", "scroll", "edit", "save", "cancel"]);

const props = defineProps([
  "validate",
  "value",
  "type",
  "label",
  "placeholder",
  "filterable",
  "options",
  "mask",
]);

const themeOverrides = {
  Input: {
    color: "rgba(0,0,0,0)",
    colorDisabled: "rgba(0,0,0,0)",
    textColorDisabled: "#333",
    border: "none",
    borderHover: "none",
    borderDisabled: "none",
    borderFocus: "none",
    boxShadowFocus: "none",
    borderRadius: "64px",
    paddingSmall: "0px",
    paddingMedium: "0px",
    paddingLarge: "0px",
    placeholderColor: "#bdbdbd",
    fontSizeMedium: "12px",
  },
  Select: {
    peers: {
      InternalSelection: {
        color: "rgba(0,0,0,0)",
        colorDisabled: "rgba(0,0,0,0)",
        textColorDisabled: "#333",
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
        placeholderColor: "#bdbdbd",
        fontSizeMedium: "14px",
      },
    },
  },
};

const vendors = useVendors();
const message = useMessage();

const inputEl = ref(null);
const masked = ref(null);

const hoverEdit = ref(false);
const hoverInput = ref(false);

const focusing = ref(false);
const editing = ref(false);
const saved = ref(false);
const done = ref(false);

const saveButton = ref();
const editButton = ref();
const cancelButton = ref();

const caretX = ref("12px");
const caretFill = ref(hoverInput.value ? "#bdbdbd00" : "#bdbdbd");

const isValid = ref(null);

const validators = {
  required: (input) => {
    return input && input.length > 0;
  },
  phone: (input) => {
    return /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(input);
  },
  email: (input) => {
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
      input
    );
  },
};

function validation(input) {
  if (props.validate) {
    let tests = [];
    props.validate.forEach((test) => {
      tests.push(validators[test](input));
    });
    return props.validate.length === tests.filter((test) => test).length;
  }
  return true;
}

function edit() {
  emit("edit");
  editing.value = true;
  caretX.value = "6px";
  caretFill.value = "#888888";
}

function save() {
  if (validation(props.value)) {
    isValid.value = 1;
    emit("save");
    saved.value = true;
    setTimeout(() => {
      saved.value = false;
    }, 1000);
    done.value = true;
    setTimeout(() => {
      done.value = false;
    }, 500);
    editing.value = false;
    caretX.value = "12px";
    caretFill.value = !hoverInput.value ? "#bdbdbd00" : "#bdbdbd";
  } else {
    message.error("Invalid input");
    isValid.value = 0;
    edit();
  }
}

function cancel() {
  emit("cancel");
  isValid.value = null;
  editing.value = false;
  done.value = true;
  setTimeout(() => {
    done.value = false;
  }, 500);
  caretX.value = "12px";
  caretFill.value = !hoverInput.value ? "#bdbdbd00" : "#bdbdbd";
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="__custom-input relative">
      <div class="flex">
        <label
          v-if="type !== 'header'"
          class="absolute z-40 translate-x-4 translate-y-[-6px] bg-white px-2 text-[10px] font-bold uppercase tracking-widest text-gray-600"
        >
          <b
            v-if="
              validate && validate.includes('required') && (!value || !(value.length > 0))
            "
            class="text-red-600"
          >
            *
          </b>
          {{ label || "label" }}
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
            caretX = editing ? '6px' : '12px';
            caretFill = '#bdbdbd';
          }
        "
      >
        <div
          class="flex w-full items-center rounded-md border-[1px] duration-200"
          :class="`
            ${saved && 'ping'}
            ${
              (!type || type !== 'header') &&
              isValid !== 0 &&
              editing &&
              'border-[#18A058] shadow-lg shadow-green-50'
            }
            ${
              (!type || type !== 'header') &&
              isValid === 0 &&
              'border-red-600 shadow-lg shadow-red-50'
            } 
            ${
              type === 'header' &&
              `
                ${editing ? `border-transparent !shadow-lg` : `!border-transparent`} 
                ${saved && 'ping'} 
                ${hoverEdit && '!border-gray-200'}
              `
            }`"
        >
          <div class="__inputs w-full">
            <masked-custom-input
              ref="inputEl"
              :value="value"
              :type="type"
              :editing="editing"
              :masked="type !== 'select'"
              :mask="mask"
              :options="options"
              :placeholder="placeholder"
              @input="
                (e) => {
                  utils.log('🤷🏾‍♂️ CustomInput.vue: ' + e);
                  $emit('update:value', e);
                }
              "
              @focus="(e) => $emit('focus', e)"
              @blur="cancel"
            />
          </div>

          <div
            class="__buttons flex items-center justify-center duration-200"
            :class="`
                ${(hoverInput || editing || type === 'header') && '!opacity-100'}
                ${type === 'header' ? 'opacity-100' : 'opacity-0'}
            `"
          >
            <!-- edit -->
            <button
              ref="editButton"
              @click="
                () => {
                  edit();
                  utils.wait(() => {
                    // auto-focus input
                  }, 500);
                }
              "
              @mouseover="hoverEdit = false"
              @mouseleave="hoverEdit = false"
              class="__edit h-3 w-3 -translate-x-1 rounded-full"
              :class="`
                    ${
                      editing
                        ? 'pointer-events-none scale-50 opacity-0 duration-200'
                        : 'opacity-100 duration-100'
                    }
                    ${done && 'delay-[250ms]'}
                `"
            >
              <svg class="fill-black hover:fill-[#18A058]" viewBox="0 0 24 24">
                <path
                  d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z"
                ></path>
              </svg>
            </button>

            <!-- save -->

            <button
              ref="saveButton"
              @click="save"
              @mouseover="hoverEdit = false"
              @mouseleave="hoverEdit = false"
              :style="!editing && 'width: 0px !important'"
              class="__save h-5 w-5 -translate-x-2 duration-200"
              :class="
                !editing
                  ? 'pointer-events-none !scale-50 opacity-0'
                  : 'opacity-100 delay-100'
              "
            >
              <svg class="fill-[#18A058] hover:opacity-60" viewBox="0 0 24 24">
                <path
                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm3.22 6.97l-4.47 4.47l-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 1 0-1.06-1.06z"
                ></path>
              </svg>
            </button>

            <!-- cancel -->

            <button
              ref="cancelButton"
              @click="cancel"
              @mouseover="hoverEdit = false"
              @mouseleave="hoverEdit = false"
              :style="!editing && 'width: 0px !important'"
              class="__cancel ml-1 h-5 w-5 -translate-x-2 duration-200"
              :class="
                !editing
                  ? 'pointer-events-none !scale-50 opacity-0 delay-100'
                  : 'opacity-100'
              "
            >
              <svg class="rotate-45 fill-gray-400 hover:opacity-60" viewBox="0 0 24 24">
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
.__buttons {
}
.ping {
  animation: ping 1s ease forwards;
}
@keyframes ping {
  from {
    @apply bg-green-100;
  }
  to {
    @apply bg-transparent;
  }
}
</style>
