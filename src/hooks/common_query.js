import { useQuery } from "vue-query";
import axios from "axios";

export const getPaymentTerms = () =>
  useQuery("paymentTerms", () =>
    axios.get("/payment_terms").then((res) => res.data)
  );

export const getStates = () =>
  useQuery(
    "states",
    () =>
      axios
        .get("/states")
        .then((res) =>
          res.data?.map((el) => ({ label: el.name, value: el.name }))
        ),
    {
      refetchOnMount: false,
    }
  );
