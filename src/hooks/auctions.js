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
