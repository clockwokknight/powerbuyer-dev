<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { useMessage } from "naive-ui";
import { useClipboard } from "@vueuse/core";
import { useGlobalState } from "@/store/global";
import { log } from "@/lib/utils";

const message = useMessage();

const global = useGlobalState();

/*

Select props:

Name	Type	Default	Description	Version
consistent-menu-width	boolean	true	Whether the menu keeps its width the same as the select trigger element. Setting it to false will also disable virtual-scroll.	
clearable	boolean	false	Whether the value is clearable.	
clear-filter-after-select	boolean	true	When multiple and filter is true, whether to clear filter keyword after select an option.	2.25.2
default-value	Array<string | number> | string | number | null	null	Default value.	
disabled	boolean	false	Whether to disable the select.	
fallback-option	false | (value: string | number) => SelectOption	value => ({ label: '' + value, value })	The option to be created using the value which has no corresponding option value. If set to false, the fallback option won't be created and displayed.	
filterable	boolean	false	Whether options can be filtered.	
filter	(pattern: string, option: Object) => boolean	String search method.	Filter function.	
input-props	HTMLInputAttributes	undefined	The attributes of input element in the trigger. It only works when the select is filterable.	
loading	boolean	false	Whether to show a loading state.	
max-tag-count	number | 'responsive'	undefined	Maximum selected values to display while in multiple mode. responsive will keep all the tags in single line.	
menu-props	HTMLAttributes	undefined	The menu's dom props.	
multiple	boolean	false	Whether to allow selecting multiple values.	
options	Array<SelectOption | SelectGroupOption>	[]	Options that can be selected. For more details see SelectOption Properties (below).	
placeholder	string	'Please Select'	Placeholder.	
placement	'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end'	'bottom-start'	Option menu's placement.	2.25.0
remote	boolean	false	Allows options to be fetched asynchronously. Note that if remote is set, filter & tag won't work on options.	
render-label	(option: SelectOption | SelectGroupOption, selected: boolean) => VNodeChild	undefined	Render function for each option label.	
render-option	(info: { node: VNode, option: SelectOption | SelectGroupOption, selected: boolean }) => VNodeChild	undefined	Render function for each option.	
render-tag	(props: { option: SelectBaseOption, handleClose: () => void }) => VNodeChild	undefined	Render function for each option tag.	
reset-menu-on-options-change	boolean	true	Whether to reset menu staus on options change, for example, scroll status.	2.24.2
show	boolean	undefined	Whether to show/open the option menu.	
show-arrow	boolean	true	Whether to show the dropdown arrow.	
size	'small' | 'medium' | 'large'	'medium'	Size of the select input.	
status	'success' | 'warning' | 'error'	undefined	Validaiton status.	2.27.0
tag	boolean	false	Whether users can create new options. This should be used with filterable.	
value	Array<string | number> | string | number | null	undefined	Value when being manually set.	
virtual-scroll	boolean	true	Whether to enable virtual scrolling.	
on-blur	() => void	undefined	Callback triggered when the selection element is blurred.	
on-clear	() => void	undefined	Callback triggered when the selection element is cleared.	
on-create	(label: string) => SelectOption	label => ({ label, value: label })	How to create an option when you type in a custom option. Note that filter will be applied to the created option too. And you'd better make sure that the value of the created option is not the same as any other option.	
on-focus	() => void	undefined	Callback triggered when the selection element is focussed on.	
on-scroll	(e: ScrollEvent) => void	undefined	Callback triggered when the options menu is scrolled.	
on-search	(value: string) => void	undefined	Callback triggered when a search is conducted.	
on-update:show	(show: boolean) => void	undefined	Callback on menu open status change.	2.24.2
on-update:value

*/

const props = defineProps({
    value: {
        type: [String, Number, Array],
        default: null,
    },
    options: {
        type: Array,
        default: () => [],
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false,
    },
    filterable: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    remote: {
        type: Boolean,
        default: false,
    },
    show: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "medium",
    },
    placement: {
        type: String,
        default: "bottom-start",
    },
    tag: {
        type: Boolean,
        default: false,
    },
    maxTagCount: {
        type: [Number, String],
        default: undefined,
    },
    placeholder: {
        type: String,
        default: "Please Select",
    },
    fallbackOption: {
        type: [Boolean, Function],
        default: false,
    },
    renderLabel: {
        type: Function,
        default: undefined,
    },
    renderOption: {
        type: Function,
        default: undefined,
    },
    renderTag: {
        type: Function,
        default: undefined,
    },
    resetMenuOnOptionsChange: {
        type: Boolean,
        default: true,
    },
    onChange: {
        type: Function,
        default: undefined,
    },
    onSearch: {
        type: Function,
        default: undefined,
    },
    onCreate: {
        type: Function,
        default: undefined,
    },
    onScroll: {
        type: Function,
        default: undefined,
    },
    on
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
  hovering: false,
  focused: false,
  typing: false,
});

const editableState = reactive({
  hovering: false,
  editing: false,
  done: false,
  saved: false,
});

const { text, copy } = useClipboard();

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
  log.green("hovering");
  if (!hasProp("disabled")) inputState.hovering = true;
}

function onEditableMouseLeave() {
  editableState.hovering = false;
}

function onEditableMouseEnter() {
  log.yellow("editable hovering");
  editableState.hovering = true;
}

function handleCopy() {
  copy(props.value);
  message.success("Copied to clipboard");
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
        </div>
      </div>
    </div>
    <n-select
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
