<script setup>
// Vehicle Make
import { computed, ref } from "vue";
import { getVehicleMakes } from "@/components/lanes/lanes.hook";
import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

const selectedVehicleMake = ref(null);
const isVehicleMakeSelected = computed(() => !!selectedVehicleMake.value);

const { data: vehicle_makes, isLoading: isVehicleMakeLoading } =
  getVehicleMakes();
const vehicleMakeOptions = computed(() =>
  vehicle_makes.value?.map((make) => ({
    label: make.name,
    value: make.name.toLowerCase(),
  }))
);

// Vehicle Year
const selectedVehicleMakeId = ref(null);
const isVehicleMakeIdSelected = computed(
  () => isVehicleMakeSelected.value && !!selectedVehicleMakeId.value
);

const { data: vehicle_years, isLoading: vehicleYearLoading } = useQuery(
  ["vehicle", "year", selectedVehicleMake],
  ({ queryKey }) =>
    axios
      .get("/vehicle_makes/year_make?make=" + queryKey[2])
      .then((res) => res.data),
  {
    enabled: isVehicleMakeSelected,
  }
);
const vehicleYearOptions = computed(() =>
  vehicle_years.value?.map((vehicle_make) => ({
    label: vehicle_make.year,
    value: vehicle_make.id,
  }))
);

// Vehicle Model
const selectedVehicleModelId = ref(null);
const isVehicleModelIdSelected = computed(
  () => isVehicleMakeIdSelected.value && !!selectedVehicleModelId.value
);

const { data: vehicleModels, isLoading: vehicleModelLoading } =
  useInfiniteQuery(
    ["vehicle", "model", selectedVehicleMakeId],
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

// Vehicle Trim
const selectedVehicleTrim = ref(null);
const isSelectedVehicleTrim = computed(
  () => isVehicleModelIdSelected.value && !!isSelectedVehicleTrim.value
);

const { data: vehicleTrims, isLoading: vehicleTrimLoading } = useQuery(
  ["vehicle", "trim", selectedVehicleModelId],
  ({ queryKey }) =>
    axios
      .get("/vehicle_model_trim?vehicle_model_id=" + queryKey[2])
      .then((res) => res.data),
  {
    enabled: isVehicleModelIdSelected,
  }
);
const vehicleTrimOptions = computed(() =>
  vehicleTrims.value?.map((trim) => ({
    label: trim.name,
    value: trim.id,
  }))
);

// Vehicle Color
const selectedVehicleColor = ref(null);
// const isVehicleColorSelected = computed(() => !!isVehicleColorSelected);

const { data: vehicleColors } = useQuery(["vehicle", "colors"], () =>
  axios.get("/vehicle_colors").then((res) => res.data)
);
</script>

<template>
  <n-form-item label="Vehicle Make">
    <n-select
      :options="vehicleMakeOptions"
      v-model:value="selectedVehicleMake"
      clearable
    />
  </n-form-item>
  <n-form-item label="Vehicle Year" v-if="isVehicleMakeSelected">
    <n-skeleton v-if="vehicleYearLoading" :width="300" size="medium" />
    <n-select
      v-else
      :loading="vehicleYearLoading"
      :options="vehicleYearOptions"
      v-model:value="selectedVehicleMakeId"
      clearable
    />
  </n-form-item>
  <n-form-item label="Vehicle Model" v-if="isVehicleMakeIdSelected">
    <n-skeleton size="medium" :width="300" v-if="vehicleModelLoading" />
    <n-select
      v-else
      :options="vehicleModelOptions"
      v-model:value="selectedVehicleModelId"
      clearable
    />
  </n-form-item>
  <n-form-item label="Vehicle Trim" v-if="isVehicleModelIdSelected">
    <n-skeleton size="medium" :width="300" v-if="vehicleTrimLoading" />
    <n-select
      v-else
      :options="vehicleTrimOptions"
      v-model:value="selectedVehicleTrim"
      clearable
    />
  </n-form-item>
  <!--  <n-form-item label="Vehicle Color" v-if="isSelectedVehicleTrim">-->
  <!--    <n-select :options="" />-->
  <!--  </n-form-item>-->
</template>
