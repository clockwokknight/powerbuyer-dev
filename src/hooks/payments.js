import axios from "axios";
import { useQuery } from "vue-query";

export const getPaymentTypes = () =>
  useQuery("payment_type", () =>
    axios.get("/payment_type").then((res) => res.data)
  );
