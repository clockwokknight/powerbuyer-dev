import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export function fetchPages(pathName, limit) {
  return useInfiniteQuery(pathName, ({ pageParam = 1 }) => axios
          .get(`/${pathName}?limit=${limit || 10}&page=` + pageParam)
          .then((r) => r.data), {
            getNextPageParam: (lastPage, pages) => 
              lastPage.current_page < lastPage.last_page 
                ? lastPage.current_page + 1 
                : null
         });
}

export function fetchById(pathName, paramId) {
  useQuery([pathName, paramId], () => axios
    .get(`/${pathName}/${paramId.value}`)
    .then((res) => res.data));
}