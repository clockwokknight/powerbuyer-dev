<script setup>
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { ref, toRaw } from "vue";
import { useMessage } from "naive-ui";

const props = defineProps(["initialData", "invoiceData", "invoiceDataOptions"]);
const emits = defineEmits(["save"]);
const message = useMessage();

const initialForm = {
  vendor_invoice_id: null,
  payment_amount: 0,
  invoices: [],
};
const form = ref({ ...initialForm, ...props.initialData });
const selectedInvoiceBalance = ref();
const formRef = ref(null);

const rules = {
  vendor_invoice_id: {
    required: true,
    type: "number",
    message: "Please select an invoice",
    trigger: ["input", "blur"],
  },
  payment_amount: {
    type: "number",
    required: true,
    trigger: ["input", "blur"],
    validator(rule, value) {
      if (value <= 0.01) {
        return new Error("Payment Amount is required");
      } else if (!selectedInvoiceBalance.value) {
        return new Error("Please select an invoice");
      } else if (value > selectedInvoiceBalance.value) {
        return new Error(
          "Payment can't exceed current invoice balance $" +
            selectedInvoiceBalance.value
        );
      }
    },
  },
};
const onInvoiceSelect = (val) => {
  const vendor_invoice = props.invoiceData.find((inv) => inv.id === val);
  // const vendor_invoice = props.invoiceData[vendor_invoiceIdx];
  selectedInvoiceBalance.value = parseFloat(vendor_invoice.balance);
  form.value = {
    vendor_invoice_id: vendor_invoice.id,
    payment_amount: parseFloat(vendor_invoice.balance),
    invoices: [
      {
        id: vendor_invoice.id,
        invoice_number: vendor_invoice.invoice_number,
      },
    ],
  };
};
const onSubmit = async () => {
  try {
    await formRef.value.validate();
    emits("save", form.value);
  } catch (e) {
    if (Array.isArray(e)) {
      e.flat().forEach((err) => message.error(err.message));
    }
  }
};
</script>
<template>
  <n-form :model="form" :rules="rules" @submit.prevent="onSubmit" ref="formRef">
    <n-form-item
      label="Vendor Invoice"
      path="vendor_invoice_id"
      @submit.prevent="onSubmit"
    >
      <n-select
        :options="invoiceDataOptions"
        clearable
        @update:value="onInvoiceSelect"
        :value="form.vendor_invoice_id"
      />
    </n-form-item>
    <n-form-item path="payment_amount" label="Payment Amount">
      <CurrencyInput v-model="form.payment_amount" />
    </n-form-item>

    <n-button attr-type="submit">Submit</n-button>
  </n-form>
</template>
