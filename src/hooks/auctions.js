import { useQuery } from "vue-query";
import axios from "axios";

export const getAuctions = () =>
  useQuery("auctions", () => axios.get("/auctions").then((r) => r.data));
