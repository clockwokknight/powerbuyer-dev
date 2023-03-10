<script setup>
import {
  reactive,
  computed,
  ref,
  unref,
  watchEffect,
  toRaw,
  watch,
  h,
} from "vue";
import { useInfiniteQuery, useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import { getGmtvLocations } from "@/hooks/location";
import { getVehicleMakes, laneFilter } from "./lanes.hook";
import { clone, omit } from "@/lib/helper";
import {
  allFilterPossibleOptions,
  sortOptions,
} from "@/components/lanes/lanes.helper";
import CustomInput from "@/components/common/CustomInput.vue";
import dayjs from "dayjs";
import { NFormItem, NInput, NTooltip, useDialog, useMessage } from "naive-ui";

const emits = defineEmits(["filter"]);
const dialog = useDialog();
const message = useMessage();
const queryClient = useQueryClient();

const {
  vehicleColorOptions,
  gmtvLocationOptions,
  vehicleMakeOptions,
  vehicle_makes,
  auctionOptions,
} = laneFilter();
const selectedLaneReport = ref(null);
const { data: lanes_reports } = useQuery("lanes_reports", () =>
  axios.get("/lanes_reports").then((res) => res.data)
);
const lanes_report_options = computed(() =>
  lanes_reports.value?.map((report) => ({
    label: report.name,
    value: report.data,
  }))
);
const filters = ref([
  {
    type: null,
  },
]);

const filterOptions = ref([]);

watchEffect(() => {
  filterOptions.value = allFilterPossibleOptions.map(
    (filterPossibleOption) => ({
      label: filterPossibleOption.label,
      value: filterPossibleOption.value,
      disabled:
        (filterPossibleOption?.depends &&
          !filters.value.some((filter) =>
            filterPossibleOption?.depends?.includes(filter.id)
          )) ||
        filters.value.some((filter) => filter?.id === filterPossibleOption.id),
    })
  );
});

const vehicleMakeId = computed(
  () => filters?.value.find((filter) => filter?.id === "make_id")?.field
);
const isVehicleMakeIdSelected = computed(() =>
  filters?.value.some((filter) => filter?.id === "make_id" && filter?.field)
);
const { data: vehicleModels, isLoading: vehicleModelLoading } =
  useInfiniteQuery(
    ["vehicle", "model", vehicleMakeId],
    ({ queryKey, pageParam = 1 }) =>
      axios
        .get(
          "/vehicle_models?page=" +
            pageParam +
            "&vehicle_make_master_id=" +
            queryKey[2]
        )
        .then((res) => res.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
      enabled: isVehicleMakeIdSelected,
    }
  );

const vehicleModelOptions = computed(() =>
  vehicleModels.value?.pages.reduce(
    (prev, current) =>
      prev.concat(
        current?.data.map((model) => ({
          label: model.name,
          value: model.id,
        })) ?? []
      ),
    []
  )
);

watch(
  filters,
  (newValue) => {
    newValue.forEach((field, fieldIdx) => {
      if (field.filter_type === "select") {
        if (field.id === "color") {
          filters.value[fieldIdx].options = vehicleColorOptions;
        } else if (field.id === "gmtv_location_id") {
          filters.value[fieldIdx].options = gmtvLocationOptions;
        } else if (field.id === "auction_id") {
          filters.value[fieldIdx].options = auctionOptions;
        } else if (field.id === "make_id") {
          filters.value[fieldIdx].options = vehicleMakeOptions;
        } else if (field.id === "model") {
          filters.value[fieldIdx].options = vehicleModelOptions;
        } else if (field.id === "order_by") {
          filters.value[fieldIdx].options = sortOptions;
        }
      }
    });
  },
  { deep: true }
);
const order_dir = ref("asc");
const onFilter = () => {
  let filterObj = {};
  filters.value?.forEach((filter) => {
    if (filter?.fields) {
      if (filter.filter_type === "date_picker_range") {
        const fieldsToObj = filter.id
          .split(",")
          .map((field, index) => [
            field,
            dayjs(filter.fields[index]).format("YYYY-MM-DD"),
          ]);
        filterObj = { ...filterObj, ...Object.fromEntries(fieldsToObj) };
      } else if (filter.filter_type === "input_range") {
        filterObj[filter.id] = filter.fields.filter((field) => field).join("-");
      }
    } else if (filter?.field) {
      filterObj[filter.id] = filter.field;
    }
  });
  if (filterObj.hasOwnProperty("order_by")) {
    filterObj.order_dir = order_dir.value;
  }
  console.log(filterObj);
  emits("filter", Object.assign({}, filterObj));
};

const onFilterSelect = (value, index) => {
  // console.log({ value, index });
  const parsedValue = JSON.parse(value);
  let obj = {
    filter_type: parsedValue.filter_type,
    id: parsedValue.fields,
  };
  if (parsedValue?.options) {
    obj.options = parsedValue?.options;
  }
  if (parsedValue.filter_type.includes("range")) {
    obj.fields = null;
  } else {
    obj.field = null;
  }
  filters.value[index] = { type: value, ...obj };
};

const filter_name = ref("");
const onFilterSave = () => {
  if (filters.value[0].type === null) {
    message.error("You need at least one filter to save");
    return;
  }
  const currentDialog = dialog.create({
    title: "Please enter a name",
    positiveText: "Submit",
    positiveButtonProps: {
      disabled: computed(() => !filter_name.value),
    },
    content: () =>
      h(
        NFormItem,
        {
          rule: {
            trigger: ["input", "blur"],
            validator() {
              if (!filter_name.value) {
                return new Error("Name is required");
              }
            },
          },
        },
        {
          default: () =>
            h(NInput, {
              value: filter_name.value,
              "onUpdate:value": (val) => (filter_name.value = val),
            }),
        }
      ),
    onPositiveClick: () => {
      let filter = unref(filters).map((filter) => omit(filter, ["options"]));
      currentDialog.loading = true;
      return new Promise((resolve) => {
        axios
          .post("/lanes_reports", {
            name: filter_name.value,
            data: JSON.stringify(filter),
          })
          .then(() => {
            resolve();
            queryClient.invalidateQueries("lanes_reports");
          })
          .catch((e) => {
            message.error("Error");
            currentDialog.loading = false;
          });
      });
    },
  });
};
const onLaneReportSelect = (val) => {
  selectedLaneReport.value = val;
  filters.value = JSON.parse(val);
};
const selectRenderOption = ({ node, option }) =>
  h(NTooltip, null, {
    trigger: () => node,
    default: () => option.label,
  });
</script>

<template>
  <div class="flex justify-between py-2">
    <h3 class="mb-3 text-lg font-bold">Lane Filters</h3>
    <n-popover trigger="click" placement="bottom">
      <template #trigger>
        <n-button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </n-button>
      </template>
      <CustomInput
        type="select"
        label="Select Filter"
        basic
        :options="lanes_report_options"
        @update:value="onLaneReportSelect"
        :value="selectedLaneReport"
      />
    </n-popover>
  </div>
  <div style="flex: 1 0 0" class="overflow-hidden">
    <n-dynamic-input
      class="custom-dynamic-input h-full overflow-auto"
      v-model:value="filters"
      @create="() => ({ type: null })"
      #="{ value, index }"
      :min="1"
    >
      <div style="grid-area: a">
        <!--    TODO: add tool tip on select option using :render-option -->
        <CustomInput
          basic
          type="select"
          label="Filter By"
          @update:value="(value) => onFilterSelect(value, index)"
          :options="filterOptions"
          :value="value.type"
        />
      </div>
      <div style="grid-area: c" class="flex flex-col gap-y-3">
        <n-input
          :value="value?.field"
          v-if="value?.filter_type === 'input'"
          @update:value="(val) => (value.field = val)"
        />
        <n-date-picker
          type="daterange"
          :value="value?.fields"
          format="MM/dd/yyyy"
          @update:value="(val) => (value.fields = val)"
          v-if="value?.filter_type === 'date_picker_range'"
        />
        <n-input
          pair
          separator="-"
          :value="value?.fields"
          @update:value="(val) => (value.fields = val)"
          v-if="value?.filter_type === 'input_range'"
        />
        <n-select
          :value="value?.field"
          :options="value?.options"
          :render-option="selectRenderOption"
          filterable
          @update:value="(val) => (value.field = val)"
          v-if="value?.filter_type === 'select' && value?.id !== 'order_by'"
        />
        <div
          v-if="value?.filter_type === 'select' && value?.id === 'order_by'"
          class="flex gap-x-1"
        >
          <n-select
            :value="value?.field"
            filterable
            @update:value="(val) => (value.field = val)"
            :render-option="selectRenderOption"
            :options="value?.options"
          />
          <n-select
            v-model:value="order_dir"
            class="max-w-[62px]"
            :options="[
              { label: 'Asc', value: 'asc' },
              { label: 'Desc', value: 'desc' },
            ]"
          />
        </div>
      </div>
    </n-dynamic-input>
  </div>
  <div class="mt-6 flex gap-x-5 border-t border-gray-500 py-5">
    <n-button type="primary" @click="onFilter"> Filter </n-button>
    <n-button @click="onFilterSave"> Save</n-button>
  </div>
</template>

<style lang="scss" scoped>
.custom-dynamic-input {
  :deep(.n-dynamic-input-item) {
    @apply grid gap-y-3 gap-x-4 bg-gray-50 p-5 dark:bg-background_dark;
    grid-template-areas:
      "a a b"
      "c c c";
    grid-template-rows: 40px 1fr;
    grid-template-columns: repeat(3, 1fr);
  }
  :deep(.n-dynamic-input-item__action) {
    margin: initial;
    place-self: self-end;
    align-self: center;
    grid-area: b;
  }
}
</style>
