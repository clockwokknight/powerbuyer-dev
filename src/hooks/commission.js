import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const COMMISSION_STATUS = {
  Pending: 2,
  Purchased: 3,
  InTransit: 4,
  AtAuction: 5,
  PendingSale: 6,
  Sold: 7,
  ArbitrationUnwind: 8,
  BuybackUnwind: 9,
};

export const getCommissions = (status_id, buyer_type) =>
  useQuery("commission", () =>
    axios
      .get(`/commission/lookup/${status_id}/${buyer_type}`)
      .then((res) => res.data)
  );
// useQuery(
//   "commission",
//   ({ pageParam = 1 }) =>
//     axios
//       .get(
//         `/commission/lookup/status/${status_id}/${buyer_type}?page=` +
//           pageParam
//       )
//       .then((r) => r.data),
//   {
//     getNextPageParam: (lastPage, pages) =>
//       lastPage.current_page < lastPage.last_page
//         ? lastPage.current_page + 1
//         : null,
//   }
// );

export const getCommissionTypes = (options = {}) =>
  useQuery(
    "commission_type",
    () => axios.get("/commission_type").then((res) => res.data),
    options
  );
