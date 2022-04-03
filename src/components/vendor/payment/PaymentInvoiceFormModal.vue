<script setup>
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { computed, ref, toRaw, unref, watch } from "vue";
import { useMessage } from "naive-ui";

const props = defineProps(["initialData", "invoiceData", "invoiceDataOptions"]);
const emits = defineEmits(["save"]);
const message = useMessage();

const initialForm = {
  vendor_invoice_id: null,
  payment_amount: 0,
  invoices: [],
};
const form = ref({ ...initialForm, ...toRaw(props.initialData) });
const getInvoiceById = (id) =>
  toRaw(props.invoiceData).find((inv) => inv.id === id);

const selectedInvoice = computed(() => {
  const vendor_invoice = getInvoiceById(form.value.vendor_invoice_id);
  form.value.invoices[0] = vendor_invoice;
  return vendor_invoice;
});
const formRef = ref(null);

const rules = {
  vendor_invoice_id: {
    required: true,
    type: "number",
    message: "Please select an invoice",
    trigger: ["blur", "change"],
  },
  payment_amount: {
    type: "number",
    required: true,
    trigger: ["input", "blur", "change"],
    validator(rule, value) {
      const calculatedBalance =
        parseFloat(selectedInvoice.value.balance) +
        (props.initialData?.id
          ? parseFloat(props.initialData.payment_amount)
          : 0);
      if (!selectedInvoice.value) {
        return new Error("Please select an invoice");
      } else if (value > calculatedBalance) {
        return new Error("Payment can't exceed $" + calculatedBalance);
      } else if (value <= 0.01) {
        return new Error("Payment Amount is required");
      }
    },
  },
};
const onInvoiceSelect = (val) => {
  const vendor_invoice = getInvoiceById(val);
  // const vendor_invoice = props.invoiceData[vendor_invoiceIdx];
  if (vendor_invoice) {
    console.log({ vendor_invoice });
    form.value = {
      vendor_invoice_id: vendor_invoice.id,
      payment_amount: parseFloat(vendor_invoice.balance),
      invoices: [selectedInvoice.value],
    };
  }
};
const onSubmit = async () => {
  try {
    await formRef.value.validate();
    emits("save", { ...unref(form) });
  } catch (e) {
    if (Array.isArray(e)) {
      e.flat().forEach((err) => message.error(err.message));
    }
  }
};
</script>
<template>
  <n-form :model="form" :rules="rules" ref="formRef">
    <n-form-item
      label="Vendor Invoice"
      path="vendor_invoice_id"
      @submit.prevent="onSubmit"
    >
      <n-select
        :options="invoiceDataOptions"
        clearable
        @update:value="onInvoiceSelect"
        v-model:value="form.vendor_invoice_id"
      />
    </n-form-item>
    <div v-if="selectedInvoice" class="flex flex-col pt-1 pb-4">
      <span class="block">Invoice Total: {{ selectedInvoice.amount_due }}</span>
      <span class="block">Balance: {{ selectedInvoice.balance }}</span>
    </div>
    <n-form-item path="payment_amount" label="Payment Amount">
      <CurrencyInput v-model="form.payment_amount" />
    </n-form-item>

    <n-button attr-type="submit" @click="onSubmit">Submit</n-button>
  </n-form>
</template>
