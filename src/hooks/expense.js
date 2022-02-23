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
        .then((res) => {
          if (Array.isArray(res.data?.data)) return [];
          return Object.entries(res.data.data).map(([key, value]) => ({
            deal_id: key,
            vin: value[0].vin,
            children: value,
          }));
        }),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );

export const getExpenseTypes = () =>
  useInfiniteQuery(
    "expense_types",
    ({ pageParam = 1 }) =>
      axios.get("/expense_types?&page=" + pageParam).then((res) => res.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,

      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );
