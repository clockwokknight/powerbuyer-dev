<script setup>
import ActionButtonGroup from "./ActionButtonGroup.vue";
import { getGmtvLocations } from "@/hooks/location.js";
import { vendorInvoices } from "@/hooks/vendor.js";
import { clone, omit } from "@/lib/helper.js";
import axios from "axios";
import dayjs from "dayjs";
import { useMessage } from "naive-ui";
import { computed, ref, toRaw, watch, watchEffect } from "vue";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { useRoute } from "vue-router";
import PaymentInvoiceFormModal from "./PaymentInvoiceFormModal.vue";
import { selectOptions, getPaymentTypes } from "./payment.hook.js";
import { themeOverrides } from "./payment.helper.js";

const { paymentStatusOptions, gmtvLocationsOptions, routeParamId } =
  selectOptions();
const showDrawer = ref(false);
const initialForm = {
  // recipient_id: null,
  // recipient_type: null,
  payment_status_id: null,
  check_number: "",
  amount: 0,
  type: null,
  payment_date: dayjs().valueOf(),
  invoice_number: "",
  account_number: null,
  ach_transfer_number: "",
  notes: "",
  gmtv_location_id: null,
  payment_invoices: [
    // { vendor_invoice_id: null, payment_amount: 0, balance: 0 }
  ],
};
const form = ref({ ...initialForm });

// Payment Invoice Modal related
const showPaymentInvoiceModal = ref(false);
const currentPaymentInvoiceIndex = ref(null);
const currentPaymentInvoiceData = ref(null);

const onCreatePaymentInvoice = (index) => {
  showPaymentInvoiceModal.value = true;
  currentPaymentInvoiceIndex.value = index ?? 0;
  currentPaymentInvoiceData.value = null;
};
const onEditPaymentInvoice = (index) => {
  currentPaymentInvoiceIndex.value = index;
  currentPaymentInvoiceData.value = form.value.payment_invoices[index];
  showPaymentInvoiceModal.value = true;
};
const onDeletePaymentInvoice = (index) => {
  form.value.payment_invoices.splice(index, 1);
};

const onSavePaymentInvoice = (paymentInvoice) => {
  console.log("saving", { paymentInvoice: toRaw(paymentInvoice) });
  showPaymentInvoiceModal.value = false;
  if (currentPaymentInvoiceData.value) {
    form.value.payment_invoices[currentPaymentInvoiceIndex.value] = {
      ...toRaw(paymentInvoice),
    };
    currentPaymentInvoiceData.value = null;
  } else {
    form.value.payment_invoices.splice(
      currentPaymentInvoiceIndex.value + 1,
      0,
      paymentInvoice
    );
  }
  currentPaymentInvoiceIndex.value = null;
};

const { data: payment_types } = getPaymentTypes();
const paymentTypeOptions = computed(() =>
  payment_types.value?.map((paymentType) => ({
    label: paymentType.name,
    value: paymentType.id,
  }))
);
const currentPaymentType = computed(() =>
  form.value?.type
    ? payment_types.value
        ?.find((pmtOption) => pmtOption.id === form.value?.type)
        .name.toLowerCase()
    : null
);

const rules = {
  gmtv_location_id: {
    required: true,
    type: "number",
    message: "Please select a location",
    trigger: ["blur", "change"],
  },
  payment_status_id: {
    required: true,
    type: "number",
    message: "Payment Status is required",
    trigger: ["blur", "change"],
  },
  check_number: {
    trigger: ["input", "blur"],
    validator(rule, value) {
      if (currentPaymentType.value === "check" && !value) {
        return new Error("Check Number is required");
      }
    },
  },
  ach_transfer_number: {
    trigger: ["input", "blur"],
    validator(rule, value) {
      if (currentPaymentType.value === "ach" && !value) {
        return new Error("ACH Number is required");
      }
    },
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
  payment_date: {
    required: true,
    type: "number",
    message: "Please enter a valid Date",
    trigger: ["input", "blur"],
  },
};

const message = useMessage();

const formRef = ref(null);

watch(showDrawer, (newValue) => {
  if (newValue) {
    form.value = clone(initialForm);
    paymentStatusOptions.value.forEach((status) => {
      if (status.label?.toLowerCase() === "draft") {
        form.value.payment_status_id = status.value;
      }
    });
  }
});

watch(
  () => form.value?.payment_invoices,
  (newFormValue) => {
    if (newFormValue.length > 0) {
      form.value.amount = newFormValue?.reduce(
        (prev, curr) => parseFloat((prev + curr.payment_amount).toFixed(2)),
        0
      );
    } else {
      form.value.amount = 0;
    }
  },
  { deep: true }
);

const { data: invoicesData, isLoading: expensesDataLoading } =
  vendorInvoices(routeParamId);
const invoiceDataOptions = ref([]);

watchEffect(() => {
  if (invoicesData.value)
    invoiceDataOptions.value = invoicesData.value
      ?.filter((inv) => parseFloat(inv.balance) !== 0)
      .map((inv) => ({
        label: inv.invoice_number,
        value: inv.id,
        disabled: form.value.payment_invoices.some(
          (invoice) => invoice.vendor_invoice_id === inv.id
        ),
      }));
});

const queryClient = useQueryClient();
const { mutate: createPayment } = useMutation(
  (data) => axios.post("/payments", data),
  {
    onSuccess() {
      message.success("Payment has been created");
      queryClient.invalidateQueries(["payments_vendor", routeParamId.value]);
      showDrawer.value = false;
    },
  }
);

async function submitForm() {
  try {
    await formRef.value.validate();
    const obj = clone(form.value);
    obj.recipient_type = 1;
    obj.recipient_id = Number(routeParamId.value);
    obj.payment_date = dayjs(form.value.payment_date).format("YYYY-MM-DD");
    obj.payment_invoices = obj.payment_invoices.map((inv) =>
      omit(inv, ["invoices"])
    );
    createPayment(obj);
  } catch (e) {
    if (Array.isArray(e)) {
      e.flat().forEach((err) => message.error(err.message));
    }
  }
}
</script>

<template>
  <n-button @click="showDrawer = true" v-bind="$attrs">
    <n-icon>
      <svg viewBox="0 0 24 24">
        <path
          d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0itl2 0v5h5a1 1 0 0 1 0 2z"
          fill="currentColor"
        ></path>
      </svg>
    </n-icon>
    Add Payment
  </n-button>
  <n-modal
    v-model:show="showDrawer"
    preset="card"
    size="huge"
    class="max-w-screen-lg print:shadow-none lg:max-w-[80vw]"
  >
    <n-form
      :model="form"
      :label-width="90"
      :rules="rules"
      size="medium"
      ref="formRef"
    >
      <n-config-provider
        inline-theme-disabled
        :theme-overrides="themeOverrides"
      >
        <header class="flex content-center justify-between">
          <section class="flex flex-col">
            <n-form-item
              size="small"
              label="GMTV print location"
              path="gmtv_location_id"
            >
              <n-select
                :options="gmtvLocationsOptions"
                class="other-select min-w-md w-full"
                filterable
                v-model:value="form.gmtv_location_id"
              />
            </n-form-item>
            <n-form-item size="small" label="Payment Type" path="type">
              <n-select
                filterable
                :options="paymentTypeOptions"
                v-model:value="form.type"
                class="other-select"
              />
            </n-form-item>
            <n-form-item
              label="Check Number"
              show-require-mark
              size="small"
              v-if="currentPaymentType === 'check'"
              path="check_number"
            >
              <n-input
                type="text"
                class="custom-input"
                clearable
                v-model:value.trim="form.check_number"
              />
            </n-form-item>
            <n-form-item
              size="small"
              path="ach_transfer_number"
              show-require-mark
              v-if="currentPaymentType === 'ach'"
              label="ACH transfer Number"
            >
              <n-input
                class="custom-input"
                v-model:value="form.ach_transfer_number"
              />
            </n-form-item>
          </section>

          <section class="flex flex-col items-end gap-y-2">
            <n-form-item size="small" path="payment_status_id">
              <n-select
                :options="paymentStatusOptions"
                v-model:value="form.payment_status_id"
                class="custom-select max-w-[90px]"
                filterable
              />
            </n-form-item>
            <n-form-item
              size="small"
              label="Payment Date"
              label-align="right"
              path="payment_date"
            >
              <n-date-picker
                v-model:value="form.payment_date"
                format="MM/dd/yyyy"
                class="custom-date-picker max-w-[130px] text-right"
              />
            </n-form-item>
            <n-form-item
              label="Account Number"
              size="small"
              label-align="right"
              class="text-right"
              path="account_number"
            >
              <n-select
                :options="[{ label: '001', value: '001' }]"
                class="other-select"
                v-model:value="form.account_number"
              />
            </n-form-item>
          </section>
        </header>
      </n-config-provider>
      <main class="mx-auto max-w-xl">
        <h3 class="mb-4">Payment Invoice</h3>
        <n-table v-if="form.payment_invoices?.length">
          <thead>
            <tr>
              <th>Vendor Invoice</th>
              <th>Payment Amount</th>
              <th class="print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(form_invoice, index) in form.payment_invoices"
              :key="`form_invoice_${index}`"
            >
              <tr class="group">
                <td>
                  {{ form_invoice.invoices[0].invoice_number }}
                </td>
                <td>
                  {{ form_invoice.payment_amount }}
                </td>
                <td>
                  <action-button-group
                    @add="onCreatePaymentInvoice(index)"
                    @edit="onEditPaymentInvoice(index)"
                    @delete="onDeletePaymentInvoice(index)"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </n-table>
        <n-button
          v-else
          dashed
          type="primary"
          @click="onCreatePaymentInvoice(0)"
          class="mt-4 w-full"
        >
          + Create
        </n-button>
        <n-modal
          v-model:show="showPaymentInvoiceModal"
          title="Payment Invoice"
          preset="card"
          size="small"
          class="max-w-xs"
        >
          <payment-invoice-form-modal
            :initial-data="currentPaymentInvoiceData"
            @save="onSavePaymentInvoice"
            :invoice-data="invoicesData"
            :invoice-data-options="invoiceDataOptions"
          />
        </n-modal>
      </main>
      <section
        class="mt-5 ml-auto w-full max-w-xs rounded bg-gray-100 p-4 dark:bg-dark_border"
      >
        <div class="bg-foreground_light p-4 dark:bg-foreground_dark">
          <h5 class="font-medium uppercase">Amount</h5>
          <span class="text-lg font-bold">${{ form.amount }}</span>
        </div>
        <n-form-item path="notes">
          <n-input
            placeholder="Notes"
            type="textarea"
            clearable
            v-model:value="form.notes"
          />
        </n-form-item>
      </section>

      <n-button class="print:hidden" size="large" @click="submitForm">
        Add
      </n-button>
    </n-form>
  </n-modal>
</template>
<style lang="scss" scoped>
.custom-date-picker {
  :deep(.n-input .n-input-wrapper) {
    --n-padding-left: 0;
    --n-padding-right: 0;
  }
  :deep(.n-input__input-el) {
    @apply font-bold;
  }
  :deep(.n-input__suffix) {
    display: none;
  }
}

.custom-input {
  --n-feedback-font-size: 12px;
  &:deep(.n-input .n-input-wrapper) {
    --n-padding-left: 0;
    --n-padding-right: 0;
  }
  :deep(.n-input__input-el) {
    @apply font-bold;
  }
}
.custom-select {
  :deep(.n-base-selection .n-base-selection-label) {
    --n-height: fit-content;
    --n-padding-single: 6px 12px;
    background-color: rgb(2 123 255 / 0.1);
    @apply border border-primary text-center font-bold uppercase;
  }
}

.other-select {
  :deep(.n-base-selection .n-base-selection-label) {
    --n-padding-single: 0;
    background-color: transparent;
    font-weight: 700;
  }
  :deep(.n-base-selection-input__content) {
    @apply font-bold;
  }
}
</style>
