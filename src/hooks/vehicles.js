import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export function getVehicles() {
  return useInfiniteQuery("vehicles", ({ pageParam = 1 }) => axios.get("/vehicles?limit=10&page=" + pageParam).then((r) => r.data), {
    getNextPageParam: (lastPage, pages) => lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : null,
  });
}

export function getVehiclesById(paramId) {
  useQuery(["vendor", paramId], () => axios.get(`/vehicles/${paramId.value}`).then((res) => res.data));
}