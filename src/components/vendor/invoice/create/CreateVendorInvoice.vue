<script setup>
import { computed, ref, watch } from "vue";
import { useMessage } from "naive-ui";
import { useMutation, useQueryClient } from "vue-query";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { clone, objectFilter, omit } from "@/lib/helper.js";
import axios from "axios";
import { format } from "v-money3";
import { getVendorById } from "@/hooks/vendor.js";
import { getInvoiceStatus } from "@/hooks/common_query.js";

const message = useMessage();
const queryClient = useQueryClient();
const route = useRoute();

const showDrawer = ref(false);
const formRef = ref(null);
const initialForm = {
  vendor_id: parseInt(route.params?.id),
  amount_due: 0,
  amount_paid: 0,
  balance: 0,
  invoice_number: "",
  status: 1,
  due_date: dayjs().add(30, "day").valueOf(),
  expenses: [
    // {
    //   expense_date: Date.now(),
    //   deal_id: null,
    //   files: [],
    //   name: "",
    //   description: "",
    //   amount: 0,
    //   showSelect: true,
    //   expense_type_id: null,
    // },
  ],
};
const form = ref(clone(initialForm));

const vendor_id = ref(route.params?.id);
const { data: current_vendor } = getVendorById(vendor_id);
watch(
  () => route.params,
  (toParams) => {
    if (toParams?.id) {
      vendor_id.value = route.params?.id;
    }
  },
  { immediate: true }
);
watch(
  showDrawer,
  (newValue) => {
    if (newValue) {
      form.value.vendor_id = parseInt(route.params?.id);
    } else form.value = clone(initialForm);
  },
  { immediate: true }
);
watch(
  () => form.value?.expenses,
  (newFormValue) => {
    if (newFormValue.length > 0) {
      form.value.amount_due = newFormValue?.reduce(
        (prev, curr) => prev + curr.amount,
        0
      );
    } else {
      form.value.amount_due = 0;
    }
  },
  { deep: true }
);
const rules = {
  amount_due: {
    type: "number",
    required: true,
    validator(rule, value) {
      if (value <= 0.01) {
        return new Error("Amount should be more than 0.01");
      }
    },
    trigger: "change",
  },
  // invoice_number: {
  //   required: true,
  //   message: "Invoice Number is required",
  //   trigger: "input",
  // },
  due_date: {
    required: true,
    type: "number",
    message: "Date is required",
    trigger: ["blur", "change"],
  },
};

const { mutateAsync: createExpense, isLoading } = useMutation(
  (data) => axios.post("/vendor_invoices", data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendorInvoices", vendor_id.value]);
    },
  }
);
const { data: invoice_status } = getInvoiceStatus();
const invoiceStatusOptions = computed(() =>
  invoice_status.value?.map((status) => ({
    label: status.name,
    value: status.id,
  }))
);

async function submitInvoice() {
  const convertDate = (date) => dayjs(date).format("YYYY-MM-DD");
  try {
    await formRef.value.validate();
    // const modifiedForm = omit(form.value, ['cost'])
    const modifiedForm = { ...form.value };
    modifiedForm.amount_paid = 0;
    modifiedForm.due_date = convertDate(modifiedForm.due_date);
    modifiedForm.expenses = modifiedForm.expenses.map((item) => {
      const obj = objectFilter(
        {
          ...omit(item, ["showSelect", "expense_type_id", "files"]),
          type: String(item.expense_type_id),
          expense_date: convertDate(item.expense_date),
          expense_files_ids: item.files.map((exp) => exp.file_id),
        },
        (key, value) => value
      );

      return obj;
    });
    // await createExpense(modifiedForm);
    console.log(modifiedForm);
    showDrawer.value = false;

    message.success("Expense Created Successfully");

    // onCreateExpense(modifiedForm);
  } catch (e) {
    console.error(e);
    message.error("Invalid data");
  }
}

const themeOverrides = {
  Input: {
    color: "rgba(255, 255, 255, 0)",
    border: "none",
  },
  Form: {
    labelPaddingVertical: "0 0 0 0",
  },
};
</script>

<template>
  <n-button class="w-[220px]" @click="showDrawer = true" v-bind="$attrs">
    <n-icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 24"
      >
        <path
          d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
          fill="currentColor"
        ></path>
      </svg>
    </n-icon>
    Create Invoice
  </n-button>
  <n-modal
    preset="card"
    title="Create an Invoice"
    class="custom-modal max-w-screen-md"
    v-model:show="showDrawer"
  >
    <n-form :model="form" :rules="rules" size="medium" ref="formRef">
      <header class="flex content-center justify-between">
        <section class="space-y-4">
          <div class="h-10"></div>
          <div class="text-left">
            <span class="block text-xs uppercase">Inv Date</span>
            <span class="text-sm font-bold">{{
              dayjs().format("MM/DD/YYYY")
            }}</span>
          </div>
          <div class="text-left">
            <span class="block text-xs uppercase">Vendor</span>
            <span class="text-sm font-bold">{{ current_vendor?.name }}</span>
          </div>
        </section>
        <section class="flex flex-col items-end gap-y-3">
          <div
            class="ml-auto max-w-[80px] border border-primary bg-primary/10 px-4 py-1 font-bold uppercase"
          >
            open
          </div>
          <div>
            <n-select
              :options="invoiceStatusOptions"
              v-model:value="form.status"
              filterable
            />
          </div>
          <n-config-provider
            inline-theme-disabled
            :theme-overrides="themeOverrides"
          >
            <div class="text-right">
              <n-form-item
                size="small"
                label-align="right"
                label="Due Date"
                path="due_date"
              >
                <n-date-picker
                  format="MM/dd/yyyy"
                  class="custom-date-picker max-w-[130px]"
                  v-model:value="form.due_date"
                  :is-date-disabled="(ts) => ts <= Date.now()"
                />
              </n-form-item>
            </div>
          </n-config-provider>
          <div class="text-right">
            <span class="block text-xs uppercase">Terms</span>
            <span class="text-sm font-bold">Net 30</span>
          </div>
        </section>
      </header>
      <main>
        <section
          class="dark:bg- mt-5 ml-auto w-full max-w-xs rounded bg-dark_border p-4"
        >
          <div class="bg-foreground_dark p-4">
            <h5 class="font-medium uppercase">Inv Total</h5>
            <span class="text-lg font-bold"
              >${{ format(form.amount_due) }}</span
            >
          </div>
          <div class="space-y-2 px-4 pt-5">
            <div>
              <h5 class="font-medium uppercase">Payments</h5>
              <span class="text-lg font-bold">${{ form.amount_paid }}</span>
            </div>
            <div>
              <h5 class="font-medium uppercase">Balance</h5>
              <span class="text-lg font-bold">${{ format(form.balance) }}</span>
            </div>
          </div>
        </section>
      </main>
    </n-form>
    <template #footer>
      <div class="flex gap-x-5">
        <button
          class="rounded border-2 border-primary bg-primary/40 px-8 py-3 text-sm font-bold text-white"
          @click.prevent="submitInvoice"
        >
          SAVE
        </button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="scss" scoped>
.custom-date-picker {
  :deep(.n-input__input-el) {
    @apply font-bold;
  }
  :deep(.n-input__suffix) {
    display: none;
  }
}
//.custom-select {
//  :deep(.n-base-selection .n-base-selection-label) {
//    background-color: rgb(2 123 255 / 0.1);
//    @apply border border-primary text-center font-bold uppercase;
//  }
//}
</style>
