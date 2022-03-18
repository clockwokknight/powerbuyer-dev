<script setup>
import { ref, computed, onMounted, watch, toRef } from "vue";
import { useRoute } from "vue-router";
import { useDebounce } from "@vueuse/core";
import { useMutation, useQueryClient } from "vue-query";
import { clone, objectFilter, omit, pick } from "@/lib/helper";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { useMessage } from "naive-ui";
import dayjs from "dayjs";
import axios from "axios";

import CurrencyInput from "@/components/common/CurrencyInput.vue";

const message = useMessage();
const queryClient = useQueryClient();
const route = useRoute();

const showDrawer = ref(false);
const formRef = ref(null);
const initialForm = {
  vendor_id: null,
  amount_due: 0,
  invoice_number: "",
  due_date: dayjs().add(30, "day").format("YYYY-MM-DD"),
  expenses: [
    {
      expense_date: dayjs().format("YYYY-MM-DD"),
      deal_id: null,
      name: "",
      description: "",
      amount: 0,
      showSelect: true,
      expense_type_id: null,
    },
  ],
};
const form = ref(clone(initialForm));

const vendor_id = ref(route.params?.id);

watch(
  showDrawer,
  (newValue) => {
    if (newValue) {
      if (route.params?.id) {
        vendor_id.value = route.params?.id;
        form.value.vendor_id = parseInt(route.params?.id);
      }
    } else {
      form.value = clone(initialForm);
    }
  },
  { immediate: true }
);

const { data: expenseItems } = getVendorExpenseItems(vendor_id, {
  enabled: showDrawer,
});

const expenseItemsOptions = computed(() =>
  [{ label: "+ Add new", value: "add" }].concat(
    expenseItems.value?.map((item) => ({
      label: item.name,
      value: JSON.stringify(
        pick(item, ["name", "description", "amount", "expense_type_id"])
      ),
    }))
  )
);

const {
  data: expense_types,
  hasNextPage: hasExpenseTypeNextPage,
  fetchNextPage: fetchNextExpenseTypePage,
} = getExpenseTypes();

const expenseTypeOptions = computed(() =>
  expense_types.value?.pages.reduce(
    (prev, current) =>
      prev.concat(
        current?.data.map((expense) => ({
          label: expense.name,
          value: expense.id,
        })) ?? []
      ),
    []
  )
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
    message: "Date is required",
    trigger: ["blur", "change"],
  },
  expenses: {
    expense_date: {
      required: true,
      message: "Please pick a date",
      trigger: ["blur", "change"],
    },
    deal_id: {
      type: "number",
      required: true,
      trigger: ["blur", "change"],
      message: "Please select a VIN",
    },
    name: {
      required: true,
      message: "Name is required",
      trigger: "input",
    },
    expense_type_id: {
      type: "number",
      required: true,
      message: "Expense type is required",
      trigger: "blur",
    },
    amount: {
      required: true,
      validator(rule, value) {
        if (value <= 0.01) {
          return new Error("Amount should be more than 0.01");
        }
      },
      trigger: "input",
    },
  },
};

const { data: deals } = getAllDeals();

const dealOptions = computed(() =>
  deals.value?.pages.reduce(
    (prev, current) =>
      prev.concat(
        current.data.map((deal) => ({
          value: deal.id,
          label: deal.vin,
        }))
      ),
    []
  )
);
const searchVinSelect = ref("");
const debouncedSearchVin = useDebounce(searchVinSelect, 500);

const { data: searchDealResult, isLoading: isVendorSearchLoading } =
  searchDealByVin(debouncedSearchVin);
const searchVinResultOptions = computed(() =>
  searchDealResult.value?.map((deal) => ({
    value: deal.id,
    label: deal.vin,
  }))
);

const handleSearch = (query) => {
  searchVinSelect.value = query;
};

const { mutateAsync: createExpense, isLoading } = useMutation(
  (data) => axios.post("/vendor_invoices", { ...data, amount_paid: 0 }),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendorInvoices", vendor_id.value]);
    },
  }
);

async function submitExpense() {
  try {
    await formRef.value.validate();
    // const modifiedForm = omit(form.value, ['cost'])
    const modifiedForm = { ...form.value };

    modifiedForm.expenses = modifiedForm.expenses.map((item) =>
      objectFilter(
        {
          ...omit(item, ["showSelect", "expense_type_id"]),
          type: String(item.expense_type_id),
        },
        (key, value) => value
      )
    );
    console.log({ modifiedForm });
    await createExpense(modifiedForm);
    showDrawer.value = false;

    message.success("Expense Created Successfully");

    // onCreateExpense(modifiedForm);
  } catch (e) {
    message.error("Invalid data");
  }
}

const onExpenseSelect = (value, index) => {
  let obj;
  if (value === "add") {
    obj = { ...onCreateExpenseItems() };
  } else {
    obj = JSON.parse(value);
    obj.amount = parseFloat(obj.amount);
  }

  form.value.expenses[index] = {
    ...form.value.expenses[index],
    ...obj,
    showSelect: false,
  };
};

const onCreateExpenseItems = () => {
  return {
    name: "",
    description: "",
    amount: 0,
    expense_type_id: null,
    showSelect: true,
    expense_date: dayjs().format("YYYY-MM-DD"),
  };
};
</script>
<template>
  <n-button class="w-[220px]" @click="showDrawer = true">
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
    class="custom-modal max-w-screen-md"
    v-model:show="showDrawer"
  >
    <n-form
      :model="form"
      :rules="rules"
      size="medium"
      ref="formRef"
      :disabled="isLoading"
    >
      <div class="flex flex-col gap-x-5 sm:flex-row">
        <n-form-item label="Amount Due" path="amount_due">
          <currency-input
            clearable
            v-model="form.amount_due"
            :loading="isLoading"
            disabled
          />
        </n-form-item>
        <n-form-item label="Due Date" path="due_date">
          <n-date-picker
            v-model:formatted-value="form.due_date"
            value-format="yyyy-MM-dd"
          />
        </n-form-item>
      </div>
      <div>Expenses</div>
      <n-dynamic-input
        v-model:value="form.expenses"
        class="custom-dynamic-input my-5"
        @create="onCreateExpenseItems"
        #="{ index, value }"
        show-sort-button
        :min="1"
      >
        <div class="rounded-roundbg-gray-200/50 p-3 dark:bg-gray-800/50">
          <div class="sm:grid sm:grid-cols-2 sm:justify-between sm:gap-x-5">
            <n-form-item
              label="VIN"
              :path="`expenses[${index}].deal_id`"
              :rule="rules.expenses.deal_id"
            >
              <n-select
                placeholder="Search VIN"
                :options="searchVinResultOptions || dealOptions"
                v-model:value="form.expenses[index].deal_id"
                :loading="isLoading || isVendorSearchLoading"
                filterable
                clearable
                remote
                @search="handleSearch"
              />
            </n-form-item>
            <n-form-item
              label="Expense Date"
              ignore-path-change
              :path="`expenses[${index}].expense_date`"
              :rule="rules.expenses.expense_date"
            >
              <n-date-picker
                v-model:formatted-value="form.expenses[index].expense_date"
                value-format="yyyy-MM-dd"
              />
            </n-form-item>
          </div>

          <n-form-item
            ignore-path-change
            :path="`expenses[${index}].name`"
            :rule="rules.expenses.name"
            label="Name"
            class="max-w-sm"
          >
            <n-select
              :options="expenseItemsOptions"
              filterable
              @update-value="(val) => onExpenseSelect(val, index)"
              :disabled="isLoading"
              :loading="isLoading"
              v-if="form.expenses[index].showSelect"
            />
            <n-input
              v-else
              v-model:value="form.expenses[index].name"
              :loading="isLoading"
              :disabled="isLoading"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-form-item label="Description">
            <n-input
              type="textarea"
              v-model:value="form.expenses[index].description"
              :loading="isLoading"
              :disabled="isLoading"
              @keydown.enter.prevent
            />
          </n-form-item>
          <div class="sm:flex sm:gap-x-5">
            <n-form-item
              ignore-path-change
              :path="`expenses[${index}].expense_type_id`"
              :rule="rules.expenses.expense_type_id"
              label="Expense Type"
              class="sm:w-3/4"
            >
              <n-select
                :options="expenseTypeOptions"
                filterable
                v-model:value="form.expenses[index].expense_type_id"
                :loading="isLoading"
                :disabled="isLoading"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item
              ignore-path-change
              :path="`expenses[${index}].amount`"
              :rule="rules.expenses.amount"
              label="Amount"
              class="sm:w-1/4"
            >
              <CurrencyInput
                v-model="form.expenses[index].amount"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </n-form-item>
          </div>
        </div>
      </n-dynamic-input>
    </n-form>
    <template #footer>
      <n-button
        :disabled="isLoading"
        :loading="isLoading"
        size="large"
        @click="submitExpense"
        >Submit</n-button
      >
    </template>
  </n-modal>
</template>

<style lang="scss">
.n-dynamic-input.custom-dynamic-input {
  .n-dynamic-input-item {
    --action-margin: 10px 0 0 0;
    @apply flex-col;
    &__action {
      align-self: flex-end;
    }
  }
}
</style>
