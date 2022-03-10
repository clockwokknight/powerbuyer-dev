<script setup>
import { computed, ref, unref, watch } from "vue";
import { useMessage } from "naive-ui";
import dayjs from "dayjs";
import { clone, pick } from "@/lib/helper";
import { useQuery } from "vue-query";
import axios from "axios";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { useRoute } from "vue-router";
import { vendorInvoices } from "@/hooks/vendor.js";

const route = useRoute();

const showDrawer = ref(false);
const initialForm = {
  recipient_id: null,
  recipient_type: null,
  payment_status_id: null,
  check_number: "",
  amount: 0,
  payment_date: dayjs().format("YYYY-MM-DD"),
  invoice_number: "",
  account_number: "",
  notes: "",
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

const { data: paymentStatus } = useQuery("payment_status", () =>
  axios.get("payment_status").then((res) => res.data)
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
  payment_status_id: {
    required: true,
    type: "number",
    message: "Payment Status is required",
    trigger: "blur",
  },
  check_number: {
    required: true,
    message: "Check Number is required",
  },
  description: {
    required: false,
    message: "Please enter a valid Description",
    trigger: ["input"],
  },
  type: {
    required: true,
    message: "Please enter a valid type",
    trigger: ["input"],
  },
  amount: {
    required: true,
    message: "Please select a valid amount",
    trigger: ["input"],
  },
  payment_invoices: {
    vendor_invoice_id: {
      required: true,
      type: "number",
      message: "Please select an invoice",
    },
    payment_amount: {
      type: "number",
      required: true,
      message: "Payment Amount is required",
    },
  },
};

const message = useMessage();

const formRef = ref(null);

watch(showDrawer, (newValue) => {
  if (newValue) {
    form.value = clone(initialForm);
  }
});

const { data: invoicesData, isLoading: expensesDataLoading } =
  vendorInvoices(routeParamId);

const invoiceDataOptions = computed(() =>
  invoicesData.value?.map((inv) => ({
    label: inv.invoice_number,
    value: inv.id,
  }))
);

async function submitForm() {
  await formRef.value.validate();
}
const onCreatePaymentInvoice = () => {
  return {
    vendor_invoice_id: null,
    payment_amount: 0,
  };
};
const onInvoiceSelect = (val, index) => {
  const vendor_invoiceIdx = invoicesData.value.findIndex(
    (inv) => inv.id === val
  );
  console.log({ vendor_invoiceIdx });
  const vendor_invoice = invoicesData.value[vendor_invoiceIdx];
  // form.value.payment_invoices[index].payment_amount =  vendor_invoice.balance
};
</script>

<template>
  <n-button @click="showDrawer = true">
    <n-icon>
      <svg viewBox="0 0 24 24">
        <path
          d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
          fill="currentColor"
        ></path>
      </svg>
    </n-icon>
    Add Payment
  </n-button>
  <n-drawer v-model:show="showDrawer" :width="500">
    <n-drawer-content title="Add Payment">
      <n-form
        :model="form"
        :label-width="90"
        :rules="rules"
        size="medium"
        ref="formRef"
      >
        <n-form-item label="Payment Status" path="payment_status_id">
          <n-select
            :options="paymentStatusOptions"
            v-model:value="form.payment_status_id"
            filterable
          />
        </n-form-item>
        <n-form-item label="Check Number" path="check_number">
          <n-input
            type="text"
            clearable
            v-model:value.trim="form.check_number"
          />
        </n-form-item>
        <div>Payment Invoice</div>
        <n-dynamic-input
          v-model:value="form.expenses"
          class="custom-dynamic-input my-5"
          @create="onCreatePaymentInvoice"
          #="{ index, value }"
          show-sort-button
          :min="1"
        >
          <div class="rounded bg-gray-200/50 p-3 dark:bg-gray-800/50">
            <n-form-item
              label="Vendor Invoice"
              :path="`payment_invoices[${index}].vendor_invoice_id`"
              :rule="rules.payment_invoices.vendor_invoice_id"
            >
              <n-select
                :options="invoiceDataOptions"
                clearable
                @update-value="onInvoiceSelect"
                :value="form.payment_invoices[index].vendor_invoice_id"
              />
            </n-form-item>
            <n-form-item
              :path="`payment_invoices[${index}].payment_amount`"
              :rule="rules.payment_invoices.payment_amount"
              label="Payment Amount"
            >
              <CurrencyInput
                v-model="form.payment_invoices[index].payment_amount"
              />
            </n-form-item>
          </div>
        </n-dynamic-input>
        <n-form-item label="Account Number" path="account_number">
          <n-input v-model:value="form.account_number" clearable />
        </n-form-item>
        <n-form-item label="Payment Date" path="payment_date">
          <n-date-picker
            v-model:formatted-value="form.payment_date"
            value-format="yyyy-MM-dd"
          />
        </n-form-item>
        <n-form-item label="Notes" path="notes">
          <n-input type="textarea" clearable v-model:value="form.notes" />
        </n-form-item>
        <n-form-item label="Amount" path="amount">
          <CurrencyInput
            placeholder="Enter Amount"
            clearable
            v-model="form.amount"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button size="large" @click="submitForm">Add</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
