<script setup>
import { computed, ref, toRaw, toRef, unref, watch, watchPostEffect } from "vue";
import { useMessage } from "naive-ui";
import dayjs from "dayjs";
import { clone, pick } from "@/lib/helper";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { useRoute } from "vue-router";
import { vendorInvoices } from "@/hooks/vendor.js";
import { getGmtvLocations } from "@/hooks/location.js";
import { getPaymentTypes } from "@/hooks/payments.js";

const props = defineProps(["showDrawer", "initialData"]);
defineEmits(["update:showDrawer"]);
const route = useRoute();
const queryClient = useQueryClient();
const message = useMessage();
const formRef = ref(null);

const showDrawer = toRef(props, "showDrawer");
watch(showDrawer, (newValue) => {
  if (newValue) {
    form.value = {
      ...props.initialData,
      payment_date: dayjs(props.initialData.payment_date).valueOf(),
    };
  } else {
    form.value = clone(initialForm);
  }
});
const initialForm = {
  // recipient_id: null,
  // recipient_type: null,
  payment_status_id: null,
  check_number: "",
  amount: 0,
  type: null,
  payment_date: dayjs().valueOf(),
  invoice_number: "",
  account_number: "",
  notes: "",
  gmtv_location_id: null,
  payment_invoices: [{ vendor_invoice_id: null, payment_amount: 0 }],
};
const form = ref({ ...initialForm });

const routeParamId = ref(route.params?.id);
watch(
  () => route.params,
  (toParam) => {
    if (toParam?.id) routeParamId.value = toParam?.id;
  }
);

const { data: payment_types } = getPaymentTypes();
const paymentTypeOptions = computed(() =>
  payment_types.value?.map((paymentType) => ({
    label: paymentType.name,
    value: paymentType.id,
  }))
);

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

// const { data: paymentRecipientTypes } = useQuery("payment_receipt_types", () =>
//   axios.get("/payment_receipt_types").then((r) => r.data)
// );

// const paymentRecipientTypesOptions = computed(() =>
//   paymentRecipientTypes.value?.map((type) => ({
//     label: type.name,
//     value: type.id,
//   }))
// );
const rules = {
  gmtv_location_id: {
    required: true,
    type: "number",
    message: "Please select a location",
    trigger: "blur",
  },
  payment_status_id: {
    required: true,
    type: "number",
    message: "Payment Status is required",
    trigger: "blur",
  },
  check_number: {
    required: true,
    message: "Check Number is required",
    trigger: ["input", "blur"],
  },
  type: {
    type: "number",
    required: true,
    message: "Payment type is required",
    trigger: ["blur", "change"],
  },
  description: {
    required: false,
    message: "Please enter a valid Description",
    trigger: ["input", "blur"],
  },
  account_number: {
    required: true,
    message: "Please enter the Account Number",
    trigger: ["input", "blur"],
  },
  amount: {
    required: true,
    message: "Please select a valid amount",
    type: "number",
    trigger: ["input", "blur"],
  },
  payment_invoices: {
    vendor_invoice_id: {
      required: true,
      type: "number",
      message: "Please select an invoice",
      trigger: ["input", "blur"],
    },
    payment_amount: {
      type: "number",
      required: true,
      trigger: ["input", "blur", "change"],
      validator(rule, value) {
        if (value <= 0.01) {
          return new Error("Payment Amount is required");
        }
        // Getting the balance field from current payment invoice index
        const payment_invoicesIdx = parseInt(/(.*)([\d])(.*)/.exec(rule.field)[2]);
        const balance = form.value.payment_invoices[payment_invoicesIdx].balance;
        // and throwing error if the balance is greater than balance
        if (value > balance) {
          return new Error("Payment can't exceed current invoice balance $" + balance);
        }
      },
    },
  },
  payment_date: {
    required: true,
    type: "number",
    message: "Please enter a valid Date",
    trigger: ["input", "blur"],
  },
};

watch(
  () => form.value?.payment_invoices,
  (newFormValue) => {
    if (newFormValue?.length > 0) {
      form.value.amount = newFormValue?.reduce(
        (prev, curr) => prev + parseFloat(curr.payment_amount),
        0
      );
    } else {
      form.value.amount = 0;
    }
  },
  { deep: true }
);

// Getting invoice data options
const { data: invoicesData } = vendorInvoices(routeParamId);
const invoiceDataOptions = ref([]);
watchPostEffect(() => {
  if (invoicesData.value && !invoicesData.debug && invoicesData.length > 0) {
    console.log("invoicesData.value: ", invoicesData.value);
    invoiceDataOptions.value = invoicesData.value?.map((inv) => ({
      label: inv.invoice_number,
      value: inv.id,
      disabled: form.value.payment_invoices.some(
        (invoice) => invoice.vendor_invoice_id === inv.id
      ),
    }));
  }
});

// GMTV locations select options
const { data: gmtvLocations } = getGmtvLocations();
const gmtvLocationsOptions = computed(() =>
  gmtvLocations.value?.map((location) => ({
    label: location.name,
    value: location.id,
  }))
);

// Payment Update Mutation
const { mutate: updatePayment } = useMutation((data) => axios.post("/update", data), {
  onSuccess() {
    message.success("Payment has been updated");
    queryClient.invalidateQueries(["payments_vendor", routeParamId.value]);
    showDrawer.value = false;
  },
});

async function submitForm() {
  try {
    await formRef.value.validate();
    const obj = clone(form.value);
    // obj.recipient_type = 1;
    // obj.recipient_id = routeParamId.value;
    obj.payment_date = dayjs(form.value.payment_date).format("YYYY-MM-DD");

    updatePayment(obj);
  } catch (e) {
    if (Array.isArray(e)) {
      e.flat().forEach((err) => message.error(err.message));
    }
  }
}
const onCreatePaymentInvoice = () => {
  return {
    vendor_invoice_id: null,
    payment_amount: 0,
  };
};
const onInvoiceSelect = (val, index) => {
  const vendor_invoiceIdx = invoicesData.value.findIndex((inv) => inv.id === val);
  const vendor_invoice = invoicesData.value[vendor_invoiceIdx];

  form.value.payment_invoices[index] = {
    vendor_invoice_id: vendor_invoice.id,
    payment_amount: parseFloat(vendor_invoice.balance),
    balance: parseFloat(vendor_invoice.balance),
  };
};
</script>

<template>
  <n-modal
    :show="showDrawer"
    @update:show="$emit('update:showDrawer', false)"
    preset="card"
    size="huge"
    class="max-w-screen-md"
  >
    <n-form :model="form" :label-width="90" :rules="rules" size="medium" ref="formRef">
      <div class="sm:grid sm:grid-cols-2 sm:gap-x-5">
        <n-form-item label="GMTV print location" path="gmtv_location_id">
          <n-select
            :options="gmtvLocationsOptions"
            v-model:value="form.gmtv_location_id"
          />
        </n-form-item>
        <n-form-item label="Payment Status" path="payment_status_id">
          <n-select
            :options="paymentStatusOptions"
            v-model:value="form.payment_status_id"
            filterable
          />
        </n-form-item>
      </div>
      <div class="sm:grid sm:grid-cols-2 sm:gap-x-5">
        <n-form-item label="Check Number" path="check_number">
          <n-input type="text" clearable v-model:value.trim="form.check_number" />
        </n-form-item>
        <n-form-item label="Account Number" path="account_number">
          <n-input v-model:value="form.account_number" clearable />
        </n-form-item>
      </div>
      <div class="sm:grid sm:grid-cols-2 sm:gap-x-5">
        <n-form-item label="Payment Type" path="type">
          <n-select filterable :options="paymentTypeOptions" v-model:value="form.type" />
        </n-form-item>
        <n-form-item label="ACH transfer Number">
          <n-input v-model:value="form.ach_transfer_number" />
        </n-form-item>
      </div>
      <div>Payment Invoice</div>
      <n-dynamic-input
        v-model:value="form.payment_invoices"
        class="custom-dynamic-input my-5"
        @create="onCreatePaymentInvoice"
        #="{ index, value }"
        show-sort-button
        :min="1"
      >
        <div
          class="rounded-round bg-gray-200/50 p-3 dark:bg-gray-800/50 sm:grid sm:grid-cols-2 sm:gap-x-5"
        >
          <n-form-item
            label="Vendor Invoice"
            :path="`payment_invoices[${index}].vendor_invoice_id`"
            :rule="rules.payment_invoices.vendor_invoice_id"
          >
            <n-select
              :options="invoiceDataOptions"
              clearable
              @update:value="(val) => onInvoiceSelect(val, index)"
              :value="form.payment_invoices[index].vendor_invoice_id"
            />
          </n-form-item>
          <n-form-item
            :path="`payment_invoices[${index}].payment_amount`"
            :rule="rules.payment_invoices.payment_amount"
            label="Payment Amount"
          >
            <CurrencyInput v-model="form.payment_invoices[index].payment_amount" />
          </n-form-item>
        </div>
      </n-dynamic-input>
      <div class="sm:grid sm:grid-cols-2 sm:gap-x-5">
        <n-form-item label="Payment Date" path="payment_date">
          <n-date-picker
            v-model:value="form.payment_date"
            format="MM/dd/yyyy"
            class="w-full"
          />
        </n-form-item>
        <n-form-item label="Amount" path="amount">
          <CurrencyInput
            placeholder="Enter Amount"
            clearable
            disabled
            v-model="form.amount"
          />
        </n-form-item>
      </div>
      <n-form-item label="Notes" path="notes">
        <n-input type="textarea" clearable v-model:value="form.notes" />
      </n-form-item>

      <n-button attr-type="submit" size="large" @click="submitForm">Update</n-button>
    </n-form>
  </n-modal>
</template>
