<script setup>
import { computed, ref, watch, h, toRaw } from "vue";
import { typographyDark, useMessage } from "naive-ui";
import { useMutation, useQueryClient } from "vue-query";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { clone, objectFilter, omit } from "@/lib/helper.js";
import axios from "axios";
import { format } from "v-money3";
import { getVendorById } from "@/hooks/vendor.js";
import { getInvoiceStatus } from "@/hooks/common_query.js";
import VendorExpenseAction from "@/components/vendor/invoice/VendorExpenseAction.vue";
import ExpenseModal from "@/components/vendor/invoice/ExpenseModal.vue";
import ExpenseTableImage from "@/components/vendor/invoice/ExpenseTableImage.vue";
import { themeOverrides } from "./invoice.helper";

const message = useMessage();
const queryClient = useQueryClient();
const route = useRoute();

const showDrawer = ref(false);
const formRef = ref(null);
const currentExpense = ref(null);
const editExpenseIndex = ref();
const showExpenseModal = ref(false);

const initialForm = {
  vendor_id: parseInt(route.params?.id),
  amount_due: 0,
  amount_paid: 0,
  balance: 0,
  status: 1,
  due_date: dayjs().add(30, "day").valueOf(),
  invoice_date: dayjs().valueOf(),
  invoice_number: "",
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
const form = ref({ ...initialForm });

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
      form.value.amount_due = form.value.balance = newFormValue?.reduce(
        (prev, curr) => parseFloat((prev + curr.amount).toFixed(2)),
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
        return new Error("Invoice Amount can't be less than 0.01");
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
  invoice_date: {
    required: true,
    type: "number",
    message: "Date is required",
    trigger: ["blur", "change"],
  },
};
const columns = [
  {
    title: "",
    key: "files",
    width: "80",
    render(row) {
      return h(ExpenseTableImage, {
        files: row.files,
      });
    },
  },
  {
    title: "VIN",
    key: "deal.vin",
    width: "200px",
  },
  {
    title: "Item",
    key: "name",
    width: "130",
  },
  {
    title: "Description",
    key: "description",
    width: "200",
    render(row) {
      return h(
        "span",
        { class: "text-[8px] text-center" },
        { default: () => row.description }
      );
    },
  },
  {
    title: "DOS",
    key: "expense_date",
    render(row) {
      return h(
        "span",
        {},
        {
          default: () => dayjs(row.expense_date).format("MM/DD/YYYY"),
        }
      );
    },
  },
  {
    title: "Type",
    key: "expense_type.name",
  },
  {
    title: "Amount",
    key: "amount",
    width: "150",
    fixed: "right",
    render(row) {
      return form.value.amount_paid > 0
        ? h("div")
        : h(
            "span",
            {
              class:
                "font-semibold bg-gray-800/10 border-2 rounded border-gray-500 px-3 py-2",
            },
            {
              default: () => `$${row.amount}`,
            }
          );
    },
  },
  {
    key: "action",
    fixed: "right",
    width: "140",
    render(row, rowIndex) {
      return h(VendorExpenseAction, {
        onAdd: onAddExpense,
        onEdit: () => {
          currentExpense.value = toRaw(row);
          currentExpense.value.expense_date = dayjs(
            currentExpense.value.expense_date
          ).valueOf();
          showExpenseModal.value = true;
          editExpenseIndex.value = rowIndex;
        },
        onDelete: () => {
          form.value.expenses.splice(rowIndex, 1);
        },
      });
    },
  },
];
const onAddExpense = () => {
  showExpenseModal.value = true;
  currentExpense.value = null;
  editExpenseIndex.value = null;
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
  invoice_status.value
    ?.filter((status) => status.name.toLowerCase() !== "paid")
    .map((status) => ({
      label: status.name,
      value: status.id,
    }))
);

const onSaveExpense = (expense) => {
  showExpenseModal.value = false;
  if (editExpenseIndex.value !== null) {
    form.value.expenses[editExpenseIndex.value] = expense;
  } else {
    form.value.expenses.push({ ...expense });
  }
};

async function submitInvoice() {
  const convertDate = (date) => dayjs(date).format("YYYY-MM-DD");
  try {
    await formRef.value.validate();
    // const modifiedForm = omit(form.value, ['cost'])
    const modifiedForm = { ...form.value };
    modifiedForm.due_date = convertDate(modifiedForm.due_date);
    modifiedForm.invoice_date = convertDate(modifiedForm.invoice_date);
    modifiedForm.expenses = modifiedForm.expenses.map((item) =>
      objectFilter(
        {
          ...omit(item, [
            "showSelect",
            "expense_type",
            "deal",
            "expense_type_id",
            "files",
          ]),
          type: String(item.type),
          expense_date: convertDate(item.expense_date),
          expense_files_ids: item.files.map((exp) => exp.file_id),
        },
        (key, value) => value
      )
    );
    await createExpense(modifiedForm);
    showDrawer.value = false;

    message.success("Expense Created Successfully");

    // onCreateExpense(modifiedForm);
  } catch (e) {
    if (Array.isArray(e)) {
      e.flat().forEach((err) => message.error(err.message));
    }
  }
}
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
    class="custom-modal relative max-w-screen-lg lg:max-w-[80vw]"
    v-model:show="showDrawer"
  >
    <n-form
      :model="form"
      :rules="rules"
      :disabled="isLoading"
      size="medium"
      ref="formRef"
    >
      <n-config-provider
        inline-theme-disabled
        :theme-overrides="themeOverrides"
      >
        <header class="flex content-center justify-between">
          <section class="space-y-4">
            <div class="text-left">
              <n-form-item size="small" label="Vendor Invoice Number">
                <n-input v-model:value="form.invoice_number" />
              </n-form-item>
            </div>
            <div class="text-left">
              <n-form-item
                size="small"
                label-align="left"
                label="Invoice Date"
                path="invoice_date"
              >
                <n-date-picker
                  format="MM/dd/yyyy"
                  class="custom-date-picker max-w-[130px]"
                  v-model:value="form.invoice_date"
                  :clearable="false"
                />
              </n-form-item>
            </div>
            <div class="text-left">
              <span class="block text-xs uppercase">Vendor</span>
              <span class="text-sm font-bold">{{ current_vendor?.name }}</span>
            </div>
          </section>
          <section class="flex flex-col items-end gap-y-3">
            <div>
              <n-select
                :options="invoiceStatusOptions"
                class="custom-select max-w-[90px]"
                v-model:value="form.status"
                filterable
              />
            </div>

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
                  :clearable="false"
                  :is-date-disabled="(ts) => ts <= Date.now()"
                />
              </n-form-item>
            </div>
            <div class="text-right">
              <span class="block text-xs uppercase">Terms</span>
              <span class="text-sm font-bold">Net 30</span>
            </div>
          </section>
        </header>
      </n-config-provider>
      <main class="mt-4">
        <h3 class="text-sm font-bold">Expenses</h3>
        <n-data-table
          :data="form.expenses"
          :columns="columns"
          :bordered="false"
          class="pt-2"
          :max-height="500"
          :scroll-x="1300"
          row-class-name="group py-2"
          v-if="form.expenses.length > 0"
        />
        <div v-else class="mt-4">
          <n-button @click="onAddExpense" dashed type="primary" class="w-full">
            + Add Expense</n-button
          >
        </div>
        <section
          class="w-full max-w-xs p-4 mt-5 ml-auto bg-gray-100 rounded dark:bg-dark_border"
        >
          <div class="p-4 bg-foreground_light dark:bg-foreground_dark">
            <h5 class="font-medium uppercase">Inv Total</h5>
            <span class="text-lg font-bold"
              >${{ format(form.amount_due) }}</span
            >
            <n-form-item class="hidden" path="amount_due">
              <n-input-number v-model:value="form.amount_due" />
            </n-form-item>
          </div>
          <div class="px-4 pt-5 space-y-2">
            <div>
              <h5 class="font-medium uppercase">Payments</h5>
              <span class="text-lg font-bold"
                >${{ format(form.amount_paid) }}</span
              >
            </div>
            <div>
              <h5 class="font-medium uppercase">Balance</h5>
              <span class="text-lg font-bold">${{ format(form.balance) }}</span>
            </div>
          </div>
        </section>
      </main>
      <div class="sticky flex bottom-2 gap-x-5">
        <n-button
          type="primary"
          :loading="isLoading"
          @click.prevent="submitInvoice"
        >
          SAVE
        </n-button>
      </div>
    </n-form>
  </n-modal>
  <n-modal
    preset="card"
    class="max-w-screen-sm"
    :title="(currentExpense ? 'Edit' : 'Add') + ' Expense'"
    v-model:show="showExpenseModal"
  >
    <ExpenseModal
      :expense="currentExpense"
      :vendor_id="vendor_id"
      @save:expense="onSaveExpense"
    />
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
.custom-select {
  :deep(.n-base-selection .n-base-selection-label) {
    --n-padding-single: 0 12px;
    background-color: rgb(2 123 255 / 0.1);
    @apply border border-primary text-center font-bold uppercase;
  }
}
</style>
