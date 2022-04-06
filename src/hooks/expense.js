import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";
import { format } from "v-money3";
import { unref } from "vue";

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
      refetchOnMount: false,
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
            amount: format(
              value.reduce((prev, curr) => prev + parseFloat(curr.amount), 0)
            ),
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
