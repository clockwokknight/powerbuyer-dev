import { useMutation, useQuery } from "vue-query";
import axios from "axios";
import { computed } from "vue";
import { getGmtvLocations } from "@/hooks/location.js";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import { useMessage } from "naive-ui";

export const selectOptions = () => {
  const route = useRoute();
  const routeParamId = ref(route.params?.id);

  const { data: paymentStatus } = useQuery(
    "payment_status",
    () => axios.get("/payment_status").then((res) => res.data),
    {
      refetchOnMount: false,
    }
  );
  const paymentStatusOptions = computed(() =>
    paymentStatus.value?.map((pmtStatus) => ({
      label: pmtStatus.name,
      value: pmtStatus.id,
    }))
  );

  const { data: gmtvLocations } = getGmtvLocations();
  const gmtvLocationsOptions = computed(() =>
    gmtvLocations.value?.map((location) => ({
      label: location.name,
      value: location.id,
    }))
  );

  // const { data: paymentRecipientTypes } = useQuery("payment_receipt_types", () =>
  //   axios.get("/payment_receipt_types").then((r) => r.data)
  // );

  // const paymentRecipientTypesOptions = computed(() =>
  //   paymentRecipientTypes.value?.map((type) => ({
  //     label: type.name,
  //     value: type.id,
  //   }))
  // );

  watch(
    () => route.params,
    (toParam) => {
      if (toParam?.id) routeParamId.value = toParam?.id;
    }
  );

  return { paymentStatusOptions, gmtvLocationsOptions, routeParamId };
};

export const getPaymentTypes = () =>
  useQuery("payment_type", () =>
    axios.get("/payment_type").then((res) => res.data)
  );
export const createPaymentMutation = () => {
  const message = useMessage();
  return useMutation((data) => axios.post("/payments", data), {
    onSuccess() {
      message.success("Payment has been created");
      queryClient.invalidateQueries(["payments_vendor", routeParamId.value]);
      queryClient.invalidateQueries(["vendorInvoices", routeParamId.value]);
    },
  });
};
