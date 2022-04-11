<script setup>
import { reactive, computed, ref, unref, watchEffect, toRaw } from "vue";
import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";
import { getGmtvLocations } from "@/hooks/location";
import { getVehicleMakes, laneFilter } from "./lanes.hook";
import { clone } from "@/lib/helper";
import { allFilterPossibleOptions } from "@/components/lanes/lanes.helper";
import CustomInput from "@/components/common/CustomInput.vue";
import dayjs from "dayjs";

const emits = defineEmits(["filter"]);
const {
  vehicleColorOptions,
  gmtvLocationOptions,
  vehicleMakeOptions,
  vehicle_makes,
} = laneFilter();

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
  () => filters?.value.find((filter) => filter?.id === "make")?.field
);
const isVehicleMakeIdSelected = computed(() =>
  filters?.value.some((filter) => filter?.id === "make")
);
const { data: vehicleModels, isLoading: vehicleModelLoading } =
  useInfiniteQuery(
    ["vehicle", "model", vehicleMakeId],
    ({ queryKey, pageParam = 1 }) =>
      axios
        .get(
          "/vehicle_models?page=" +
            pageParam +
            "&vehicle_make_id=" +
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
const onFilter = () => {
  // const getYearFromMakeId = vehicleYearOptions.value?.find(
  //   (option) => option.value === selectedVehicleMakeId.value
  // )?.label;
  // const filterObj = {
  //   make: unref(selectedVehicleMake),
  //   gmtv_location_id: unref(gmtv_location_id),
  //   year: getYearFromMakeId,
  // };
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
        filterObj[filter.id] = filter.fields.join("-");
      }
    } else if (filter?.field) {
      filterObj[filter.id] = filter.field;
    }
  });
  // TODO: will remove that once it's fixed
  if (filterObj.make) {
    filterObj.make = vehicle_makes.value
      ?.find((make) => make.id === filterObj.make)
      .name.toLowerCase();
  }
  console.log(filterObj);
  emits("filter", Object.assign({}, filterObj));
};

const onFilterSelect = (value, index) => {
  // console.log({ value, index });
  const parsedValue = JSON.parse(value);
  let obj = { filter_type: parsedValue.filter_type, id: parsedValue.fields };
  if (parsedValue.filter_type.includes("range")) {
    obj.fields = null;
  } else {
    obj.field = null;
  }
  if (parsedValue.filter_type === "select") {
    if (parsedValue.fields === "color") {
      obj.options = vehicleColorOptions;
    } else if (parsedValue.fields === "gmtv_location_id") {
      obj.options = gmtvLocationOptions;
    } else if (parsedValue.fields === "make") {
      obj.options = vehicleMakeOptions;
    } else if (parsedValue.fields === "model") {
      obj.options = vehicleModelOptions;
    }
  }
  filters.value[index] = { type: value, ...obj };
};
</script>

<template>
  <!--  <n-form-item label="Select GMTV location">-->
  <!--    <n-select-->
  <!--      :options="gmtvLocationOptions"-->
  <!--      filterable-->
  <!--      clearable-->
  <!--      v-model:value="gmtv_location_id"-->
  <!--      :loading="gmtvLocationLoading"-->
  <!--    />-->
  <!--  </n-form-item>-->
  <n-dynamic-input
    class="custom-dynamic-input"
    v-model:value="filters"
    @create="() => ({ type: null })"
    #="{ value, index }"
  >
    <div style="grid-area: a">
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
        @update:value="(val) => (value.field = val)"
        v-if="value?.filter_type === 'select'"
      />
    </div>
  </n-dynamic-input>
  <n-button type="primary" @click="onFilter" class="mt-6"> Filter </n-button>
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
