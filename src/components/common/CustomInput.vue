<script setup>
import { ref, toRefs, reactive, computed, onMounted } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import MaskedInput from "@/components/common/generic/MaskedInput.vue";
import { utils } from "@/lib/utils";

const emit = defineEmits(["update:value", "focus", "scroll", "edit", "save", "cancel"]);

const props = defineProps([
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

const input = ref(null);
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

function handleButtonHover(name) {}

function edit() {
  emit("edit");
  editing.value = true;
  caretX.value = "6px";
  caretFill.value = "#888888";
}

function save() {
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
}

function cancel() {
  emit("cancel");
  editing.value = false;
  done.value = true;
  setTimeout(() => {
    done.value = false;
  }, 500);
  caretX.value = "12px";
  caretFill.value = !hoverInput.value ? "#bdbdbd00" : "#bdbdbd";
}

function blur() {
  emit("cancel");
  editing.value = false;
  done.value = true;
  setTimeout(() => {
    done.value = false;
  }, 500);
  caretX.value = "12px";
  caretFill.value = "#bdbdbd";
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="__custom-input relative">
      <label
        v-if="type !== 'header'"
        class="absolute text-gray-600 bg-white text-[10px] translate-x-4 translate-y-[-6px] px-2 tracking-widest uppercase font-bold z-40"
        >{{ label || "label" }}
      </label>

      <div
        class="flex mt-1 w-full"
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
          class="flex items-center duration-200 w-full rounded-md border-[1px]"
          :class="`
            ${saved && 'ping'}
            ${
              (!type || type !== 'header') &&
              editing &&
              'border-[#18A058] shadow-lg shadow-green-50'
            } 
            ${
              type === 'header' &&
              `${editing ? `border-transparent !shadow-lg` : `!border-transparent`} ${
                saved && 'ping'
              } ${hoverEdit && '!border-gray-200'}`
            }
        `"
        >
          <div class="__inputs w-full">
            <masked-input
              ref="input"
              v-model:value="value"
              :type="type"
              :editing="editing"
              :masked="type !== 'select'"
              :mask="mask"
              :options="options"
              :placeholder="placeholder"
              @input="
                (e) => {
                  utils.log('CustomInput.vue: ' + e);
                  $emit('update:value', e);
                }
              "
              @focus="(e) => $emit('focus', e)"
              @blur="blur"
            />
          </div>

          <div
            class="__buttons flex justify-center items-center duration-200"
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
                    utils.log('\n---------');
                    utils.log(['input ref: ', input]);
                    utils.log(['masked ref: ', masked]);
                    //input.focus();
                  }, 500);
                }
              "
              @mouseover="
                () => {
                  hoverEdit = false;
                  handleButtonHover('Edit');
                }
              "
              @mouseleave="hoverEdit = false"
              class="__edit h-3 w-3 rounded-full -translate-x-1"
              :class="`
                    ${
                      editing
                        ? 'opacity-0 scale-50 pointer-events-none duration-200'
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
              @mouseover="
                () => {
                  hoverEdit = false;
                  handleButtonHover('Save');
                }
              "
              @mouseleave="hoverEdit = false"
              :style="!editing && 'width: 0px !important'"
              class="__save h-5 w-5 -translate-x-2 duration-200"
              :class="
                !editing
                  ? 'opacity-0 !scale-50 pointer-events-none'
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
              @mouseover="
                () => {
                  hoverEdit = false;
                  handleButtonHover('Cancel');
                }
              "
              @mouseleave="hoverEdit = false"
              :style="!editing && 'width: 0px !important'"
              class="__cancel h-5 w-5 -translate-x-2 duration-200 ml-1"
              :class="
                !editing
                  ? 'opacity-0 !scale-50 pointer-events-none delay-100'
                  : 'opacity-100'
              "
            >
              <svg class="fill-gray-400 rotate-45 hover:opacity-60" viewBox="0 0 24 24">
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
