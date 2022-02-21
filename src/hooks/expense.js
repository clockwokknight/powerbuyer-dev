import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getVendorExpenseItems = (
  vendor_id,
  { enabled } = { enabled: true }
) =>
  useQuery(
    ["vendorExpenseItems", vendor_id],
    ({ queryKey }) =>
      axios.get(`/expense_items/vendor/${queryKey[1]}`).then((res) => res.data),
    {
      retry: 0,
      enabled,
    }
  );

export const getExpensesByVendor = (vendor_id) =>
  useInfiniteQuery(
    ["expensesByVendor", vendor_id],
    ({ queryKey, pageParam = 1 }) =>
      axios
        .get(`/expenses/vendor/${queryKey[1]}?page=${pageParam}`)
        .then((r) => r.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );

export const getExpenseTypes = () =>
  useQuery(
    "expense_types",
    () => axios.get("/expense_types").then((res) => res.data),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );
