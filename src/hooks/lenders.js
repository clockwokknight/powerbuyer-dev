import { useInfiniteQuery } from "vue-query";
import axios from "axios";

export const getLenders = () =>
  useInfiniteQuery(
    "lenders",
    ({ pageParam = 1 }) =>
      axios.get("/lenders?page=" + pageParam).then((r) => r.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );
