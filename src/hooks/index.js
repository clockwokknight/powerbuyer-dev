import axios from "axios";
import { useInfiniteQuery, useQuery } from "vue-query";

// ------------ generic getters ------------

export function fetchPaginatedData(path) {
  return useInfiniteQuery(queryName(path, 'Paginated'), ({ pageParam = 1 }) => 
    axios.get(`${path}?limit=10&page=${pageParam}`).then((r) => r.data), {
      getNextPageParam: (lastPage, pages) => lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : null
    }
  )
}

export function fetchById(path, paramId) {
  return useQuery([queryName(path, 'ById'), paramId], () => axios.get(`${path}/${paramId.value}`).then((res) => res.data));
}

// ------------ Vendor hooks ------------

export function fetchInvoiceTotalByVendor(vendorId) {
  return useQuery(["totalInvoiceAmount", vendorId], ({ queryKey }) =>
    axios.get("vendor_invoices/open_total/" + queryKey[1]).then((res) => res.data[0] ?? "0.00")
  )
}

export function fetchInvoicesByVendor(vendorId) {
  return useQuery(["vendorInvoices", vendorId], ({ queryKey }) =>
    axios.get("/vendor_invoices/search_by_vendor/" + queryKey[1]).then((res) => res.data)
  )
}

// ------------ helpers ------------

function queryName(path, context) {
    return path.substring(1, path.length) + context;
}