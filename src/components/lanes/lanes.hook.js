import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";
import { computed } from "vue";
import { getGmtvLocations } from "@/hooks/location";

export const getVehicleMakes = () =>
  useQuery(["vehicle", "makes"], () =>
    axios.get("/vehicle_makes").then((res) => res.data)
  );
export const laneFilter = () => {
  const { data: vehicleColors } = useInfiniteQuery(
    ["vehicle", "colors"],
    ({ pageParam = 1 }) =>
      axios.get("/vehicle_colors?page=" + pageParam).then((res) => res.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );
  const vehicleColorOptions = computed(() =>
    vehicleColors.value?.pages.reduce(
      (prev, current) =>
        prev.concat(
          current?.data.map((model) => ({
            label: model.color,
            value: model.color.toLowerCase(),
          })) ?? []
        ),
      []
    )
  );
  // GMTV location
  const { data: gmtvLocations, isLoading: gmtvLocationLoading } =
    getGmtvLocations();
  const gmtvLocationOptions = computed(() =>
    gmtvLocations.value?.map((location) => ({
      label: location.name,
      value: location.id,
    }))
  );

  // Vehicle Makes
  const { data: vehicle_makes, isLoading: isVehicleMakeLoading } =
    getVehicleMakes();
  const vehicleMakeOptions = computed(() =>
    vehicle_makes.value?.map((make) => ({
      label: make.name,
      value: make.id,
    }))
  );
  // Vehicle Models

  return {
    vehicleColorOptions,
    gmtvLocationOptions,
    vehicleMakeOptions,
    vehicle_makes,
  };
};
