import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getAllDeals = () =>
  useInfiniteQuery(
    "allDeals",
    ({ pageParam = 1 }) =>
      axios.get("/deals?per_page=10&page" + pageParam).then((res) => res.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );

export const searchDealByVin = (vin) =>
  useQuery(["searchDealByVin", vin], ({ queryKey }) =>
    queryKey[1] === "" || !queryKey[1]
      ? null
      : axios.get("/deals/search_by_vin/" + queryKey[1]).then((res) => res.data)
  );
