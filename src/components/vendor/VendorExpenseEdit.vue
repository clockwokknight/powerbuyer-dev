<script setup>
import { computed, markRaw, ref, toRaw, toRef, unref, watch } from "vue";
import { useDebounce } from "@vueuse/core";
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { clone, objectFilter, objectHas, omit, pick } from "@/lib/helper";
import { useMutation, useQueryClient } from "vue-query";
import axios from "axios";
import dayjs from "dayjs";
import { useMessage } from "naive-ui";

const props = defineProps(["showDrawer", "initialData", "isDisabled"]);
const emits = defineEmits(["update:show"]);

const message = useMessage();
const queryClient = useQueryClient();

const initialForm = {
  vendor_id: null,
  amount_due: 0,
  invoice_number: "",
  due_date: null,
  expenses: [
    {
      expense_date: dayjs().format("YYYY-MM-DD"),
      deal_id: null,
      name: "",
      description: "",
      images: [],
      amount: 0,
      showSelect: true,
      type: null,
    },
  ],
};
const form = ref({ ...initialForm });
const formRef = ref(null);
const vendor_id = ref(form.value.vendor_id);
const showModal = ref(false);
const searchVinSelect = ref("");
const debouncedSearchVin = useDebounce(searchVinSelect, 500);

const showDrawer = toRef(props, "showDrawer");
watch(showDrawer, (newValue) => {
  if (newValue) {
    form.value = clone(props.initialData);
    form.value.expenses = form.value.expenses.map((expense) => ({
      ...expense,
      showSelect: false,
    }));
    vendor_id.value = form.value.vendor_id;
  } else {
    form.value = clone(initialForm);
  }
});
const deletedExpenses = ref([]);
watch(
  () => form.value?.expenses,
  (newFormValue, prevValue) => {
    if (newFormValue.length > 0) {
      form.value.amount_due = newFormValue?.reduce(
        (prev, curr) => prev + parseFloat(curr.amount),
        0
      );
    } else {
      form.value.amount_due = 0;
    }
    // Detect if removed index is number
    if (prevValue && typeof currentRemovedIndex.value === "number") {
      // if the removed object has id, then store it in deleteExpense state for later use
      const removedObj = toRaw(prevValue[currentRemovedIndex.value]);
      if (objectHas(removedObj, ["id"]))
        deletedExpenses.value.push({
          ...omit(removedObj, ["expense_types", "showSelect"]),
          delete_record: 1,
        });
    }
  },
  { deep: true, flush: "post" }
);
// Mutations
const { mutate: updateExpense, isLoading: updateExpenseLoading } = useMutation(
  ({ id, ...data }) =>
    axios.put(`/vendor_invoices/${id}`, {
      ...data,
      amount_paid: 0,
      balance: data.amount_due,
    }),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendorInvoices", String(vendor_id.value)]);
      emits("update:show", false);
      message.success("Expense updated successfully.");
    },
  }
);

const { mutateAsync: deleteExpense, isLoading: deleteExpenseLoading } = useMutation(
  (id) => axios.delete("/vendor_invoices/" + id),
  {
    onSuccess() {
      emits("update:show", false);
      queryClient.invalidateQueries(["vendorInvoices", String(vendor_id.value)]);
      message.success("Expense deleted successfully.");
    },
  }
);

// Queries
const {
  data: expense_types,
  hasNextPage: hasExpenseTypeNextPage,
  fetchNextPage: fetchNextExpenseTypePage,
} = getExpenseTypes();

//TODO: will have to add all the current expense's expense_type to make sure we don't get any error
// filter(
//   (el, index, array) => index === array.findIndex((arr) => arr.id === el.id)
// )
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

// VIN search
const handleSearch = (query) => {
  searchVinSelect.value = query;
};
const { data: searchDealResult, isLoading: isVendorSearchLoading } = searchDealByVin(
  debouncedSearchVin
);
const searchVinResultOptions = computed(() =>
  searchDealResult?.value?.map((deal) => ({
    value: deal.id,
    label: deal.vin,
  }))
);

// Form Rules
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
  invoice_number: {
    required: true,
    message: "Invoice Number is required",
    trigger: "input",
  },
  due_date: {
    required: true,
    message: "Date is required",
    trigger: ["blur", "change"],
  },
  expenses: {
    expense_date: {
      required: true,
      message: "Date is required",
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
    type: {
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

const submitForm = async () => {
  try {
    await formRef.value.validate();
    let obj = unref(form);
    // remove Proxy from expenses array
    obj.expenses = toRaw(form.value.expenses);
    // remove Proxy each object from array and remove 'showSelect' and 'expense_types'
    obj.expenses = obj.expenses
      .map((expense) => omit(toRaw(expense), ["expense_types", "showSelect"]))
      // Also add deleted Expense array so that it removes from the database as well.
      .concat(unref(deletedExpenses));

    obj = omit(obj, ["invoice_number"]);

    updateExpense(obj);
  } catch (e) {}
};

/**
 *
 * @param {Event} e Event
 */
const handleExpenseTypeSelectScroll = (e) => {
  const currentTarget = e.currentTarget;

  if (
    currentTarget.scrollTop + currentTarget.offsetHeight >=
    currentTarget.scrollHeight
  ) {
    if (hasExpenseTypeNextPage.value) {
      fetchNextExpenseTypePage.value();
    }
  }
};

const isLoading = computed(
  () => unref(updateExpenseLoading) || unref(deleteExpenseLoading)
);
const onExpenseSelect = (value, index) => {
  let obj;
  if (value === "add") {
    obj = { ...onCreateExpenseItems() };
  } else {
    obj = JSON.parse(value);
    obj.amount = parseFloat(obj.amount);
    obj.type = obj.expense_type_id;
    delete obj.expense_type_id;
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
    type: null,
    showSelect: true,
    expense_date: dayjs().format("YYYY-MM-DD"),
  };
};
const currentRemovedIndex = ref();
const onRemoveExpenseItem = (index) => {
  currentRemovedIndex.value = index;
};
const customRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress,
}) => {
  const formData = new FormData();
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  }
  formData.append("files", file.file);
  axios
    .post(action, formData, {
      withCredentials,
      headers,
      onUploadProgress: ({ loaded, total }) => {
        onProgress({ percent: Math.ceil((loaded / total) * 100) });
      },
    })
    .then((e) => {
      message.success(e.data);
      onFinish();
    })
    .catch((error) => {
      message.success(error.message);
      onError();
    });
};
</script>

<template>
  <n-modal
    :show="showDrawer"
    @update:show="$emit('update:show', false)"
    size="huge"
    preset="card"
    class="custom-modal relative max-w-screen-md"
  >
    <n-form
      :model="form"
      :rules="rules"
      size="medium"
      ref="formRef"
      :disabled="isLoading || isDisabled"
    >
      <n-form-item label="Invoice Number" path="invoice_number">
        <n-input v-model:value="form.invoice_number" disabled :loading="isLoading" />
      </n-form-item>
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
        @remove="onRemoveExpenseItem"
        #="{ index, value }"
        show-sort-button
        :min="1"
        :max="isDisabled ? form.expenses?.length : undefined"
      >
        <div class="rounded-round bg-gray-200/50 grid p-3 dark:bg-gray-800/50">
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
          <n-form-item label="Upload Images">
            <n-upload
              :disabled="false"
              action="https://gmtvinventory.com/api/expenses/file_upload"
              multiple
              :data="{
                expense_id: form.expenses[index].id,
              }"
              :custom-request="customRequest"
              list-type="image-card"
            />
          </n-form-item>
          <n-form-item
            ignore-path-change
            :path="`expenses[${index}].name`"
            :rule="rules.expenses.name"
            label="Name"
          >
            <n-select
              :options="expenseItemsOptions"
              filterable
              @update-value="(val) => onExpenseSelect(val, index)"
              :loading="isLoading"
              @scroll="handleExpenseTypeSelectScroll"
              v-if="form.expenses[index].showSelect"
            />
            <n-input
              v-else
              v-model:value="form.expenses[index].name"
              :loading="isLoading"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-form-item label="Description">
            <n-input
              type="textarea"
              v-model:value="form.expenses[index].description"
              :loading="isLoading"
              @keydown.enter.prevent
            />
          </n-form-item>
          <div class="sm:flex sm:gap-x-5">
            <n-form-item
              ignore-path-change
              :path="`expenses[${index}].type`"
              :rule="rules.expenses.type"
              label="Expense Type"
            >
              <n-select
                :options="expenseTypeOptions"
                filterable
                v-model:value="form.expenses[index].type"
                :loading="isLoading"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item
              ignore-path-change
              :path="`expenses[${index}].amount`"
              :rule="rules.expenses.amount"
              label="Amount"
            >
              <CurrencyInput v-model="form.expenses[index].amount" :loading="isLoading" />
            </n-form-item>
          </div>
        </div>
      </n-dynamic-input>
    </n-form>
    <template #footer>
      <div class="flex justify-end gap-x-4" v-if="!isDisabled">
        <n-button
          size="large"
          :disabled="isLoading"
          :loading="isLoading"
          type="error"
          @click="showModal = true"
        >
          Delete
        </n-button>
        <n-button
          size="large"
          :disabled="isLoading"
          :loading="isLoading"
          @click.prevent="submitForm"
          >Update</n-button
        >
      </div>
    </template>
  </n-modal>
  <n-modal
    v-model:show="showModal"
    @positive-click="deleteExpense(form?.id)"
    content="Are you sure you want to delete?"
    positive-text="Yes"
    preset="dialog"
    type="error"
    @mask-click="showModal = false"
    @negative-click="showModal = false"
    negative-text="Cancel"
    title="Delete"
  />
</template>

<style lang="scss">
.custom-modal .n-card__footer {
  background: var(--n-color-modal);
  @apply sticky bottom-0 pt-3;
}
</style>
