import { defineComponent, ref, nextTick } from "vue";
import { NPopconfirm } from "naive-ui";

export const ShowOrEdit = defineComponent({
  props: {
    value: [String, Number],
    onUpdateValue: [Function, Array],
    inputType: {
      type: String,
      default: "text",
    },
  },
  setup(props) {
    const isEdit = ref(false);
    const inputRef = ref(null);
    const inputValue = ref(props.value);
    const handlePositiveClick = () => {
      props.onUpdateValue(inputValue.value);
      inputValue.value = props.value;
    };
    const handleNegativeClick = () => {
      inputValue.value = props.value;
    };
    return () => (
      <NPopconfirm
        showIcon={false}
        onNegativeClick={handleNegativeClick}
        onPositiveClick={handlePositiveClick}
      >
        {{
          default: () => (
            <n-input
              ref={inputRef}
              type={props.inputType}
              v-model:value={inputValue.value}
            />
          ),
          trigger: () =>
            props.value ? props.value : <span class="block p-4"></span>,
        }}
      </NPopconfirm>
    );
  },
});

export const Lights = defineComponent({
  props: ["row"],
  setup(props) {
    return () => (
      <div class="flex items-center justify-center gap-x-1">
        {props.row.green_light ? (
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
        ) : null}
        {props.row.yellow_light ? (
          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
        ) : null}
        {props.row.red_light ? (
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
        ) : null}
      </div>
    );
  },
});
