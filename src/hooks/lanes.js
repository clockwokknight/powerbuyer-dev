import axios from "axios";
import { computed, toRaw } from "vue";
import { useQuery } from "vue-query";
import { objectFilter } from "@/lib/helper";

export const getAllLanes = (filter = { page: 1 }) => {
  return useQuery(
    ["lanes", filter],
    ({ queryKey }) => {
      return axios
        .get(
          "/lanes?" +
            new URLSearchParams(
              objectFilter(queryKey[1], (key, value) =>
                typeof value === "number" ? true : value
              )
            ).toString()
        )
        .then((res) => res.data);
    },
    {
      keepPreviousData: true,
      refetchOnMount: false,
    }
  );
};

export const getLaneReports = () =>
  useQuery("lanes_reports", () =>
    axios.get("/lanes_reports").then((res) => res.data)
  );
