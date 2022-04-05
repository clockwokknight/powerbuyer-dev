import axios from "axios";
import { toRaw } from "vue";
import { useQuery } from "vue-query";

export const getAllLanes = (filter = { page: 1 }) =>
  useQuery(
    ["lanes", filter],
    ({ queryKey }) => {
      return axios
        .get("/lanes?" + new URLSearchParams(queryKey[1]).toString())
        .then((res) => res.data);
    },
    {
      keepPreviousData: true,
      refetchOnMount: false,
    }
  );
