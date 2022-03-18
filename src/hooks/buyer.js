import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const BUYER_TYPE = {
  Manager: 1,
  Buyer: 2,
  FiedBuyer: 3,
};

export const getBuyerTypes = () =>
  useQuery("buyer_types", () =>
    axios.get("/buyer_type").then((res) => res.data)
  );
export const getBuyerManagers = () =>
  useQuery("buyer_managers", () =>
    axios.get("/buyers/managers").then((res) => res.data)
  );

export const getBuyers = () =>
  useInfiniteQuery(
    "buyers",
    ({ pageParam = 1 }) =>
      axios.get("/buyers?page=" + pageParam).then((r) => r.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );
