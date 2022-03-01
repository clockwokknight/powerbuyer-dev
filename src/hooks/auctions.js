import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getAuctions = () =>
  useInfiniteQuery(
    "auctions",
    ({ pageParam = 1 }) =>
      axios.get("/auctions?page=" + pageParam).then((r) => r.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );

export const getAuctionById = (id) =>
  useQuery(["auction", id], ({ queryKey }) => {
    return axios.get(`/auctions/${queryKey[1]}`).then((res) => res.data);
  });
