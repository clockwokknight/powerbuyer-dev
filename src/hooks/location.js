import { useQuery } from "vue-query";
import axios from "axios";

export const getGmtvLocations = () =>
  useQuery(
    "gmtv_locations",
    () => axios.get("/gmtv_locations").then((res) => res.data),
    {
      refetchOnMount: false,
    }
  );
