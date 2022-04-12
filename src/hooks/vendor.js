import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";
import { computed, unref } from "vue";

export const useVendorCategories = () =>
  useInfiniteQuery("vendorCategory", ({ pageParam = 1 }) =>
      axios.get("/vendor_categories?page=" + pageParam).then((res) => res.data),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );
export const getVendors = () =>
  useInfiniteQuery(
    "vendors",
    ({ pageParam = 1 }) =>
      axios.get("/vendors?limit=10&page=" + pageParam).then((r) => r.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );

export const getVendorById = (paramId) => {
  const id = computed(() => parseInt(unref(paramId)))
  return useQuery(["vendor", id], ({queryKey}) =>
    axios.get(`/vendors/${queryKey[1]}`).then((res) => res.data)
  )
}

export const getInvoiceTotalByVendor = (vendorId) =>
  useQuery(["totalInvoiceAmount", vendorId], ({ queryKey }) =>
    axios
      .get("vendor_invoices/open_total/" + queryKey[1])
      .then((res) => res.data[0] ?? "0.00")
  );
export const vendorInvoices = (vendorId) =>
  useQuery(["vendorInvoices", vendorId], ({ queryKey }) =>
    axios
      .get("/vendor_invoices/search_by_vendor/" + queryKey[1])
      .then((res) => res.data)
  );

export const singleVendorInvoice = (invoiceId) =>
  useQuery(["singleInvoice", invoiceId], ({ queryKey }) =>
    axios.get("/vendor_invoices/" + queryKey[1]).then((res) => res.data)
  );
