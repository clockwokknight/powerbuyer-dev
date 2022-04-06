import axios from "axios";
import { computed, toRaw } from "vue";
import { useQuery } from "vue-query";

export const getAllLanes = (filter = { page: 1 }) => {
  const stringifyFilter = computed(() => JSON.stringify(filter))
  return useQuery(
    ["lanes"],
    ({ queryKey }) => {
      return axios
        .get("/lanes?" + new URLSearchParams(JSON.parse(stringifyFilter.value)).toString())
        .then((res) => res.data);
    },
    {
      keepPreviousData: true,
      refetchOnMount: false,
    }
  )
}
