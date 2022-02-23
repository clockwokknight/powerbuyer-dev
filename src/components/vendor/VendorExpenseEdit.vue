<script setup>
import { computed, ref, toRef, watch } from "vue";
import { useDebounce } from "@vueuse/core";
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { objectFilter, pick } from "@/lib/helper";
import { useMutation, useQueryClient } from "vue-query";
import axios from "axios";
import dayjs from "dayjs";
import { useMessage } from "naive-ui";

const props = defineProps(["showDrawer", "initialData"]);
const emits = defineEmits(["update:show"]);

const message = useMessage();
const queryClient = useQueryClient();

const initialForm = {
  deal_id: null,
  vendor_id: null,
  amount: 0,
  description: "",
  expense_date: null,
  invoice_number: "",
  type: null,
};
const form = ref({ ...initialForm });
const formRef = ref(null);
const searchVinSelect = ref("");
const debouncedSearchVin = useDebounce(searchVinSelect, 500);

const showDrawer = toRef(props, "showDrawer");
watch(showDrawer, (newValue) => {
  if (newValue) {
    form.value = { ...props.initialData };
  } else {
    form.value = { ...initialForm };
  }
});
// Mutations
const { mutate: updateExpense, isLoading: updateExpenseLoading } = useMutation(
  ({ id, ...data }) => axios.put(`/expenses/${id}`, data),
  {
    onSuccess() {
      queryClient.invalidateQueries([
        "expensesByVendor",
        String(form.value.vendor_id),
      ]);
      emits("update:show", false);
      message.success("Expense updated successfully.");
    },
  }
);

// Queries
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

// const { data: expenseItems } = getVendorExpenseItems(vendor_id, {
//   enabled: showDrawer,
// });
// const expenseItemsOptions = computed(() =>
//   [{ label: "+ Add new", value: "add" }].concat(
//     expenseItems.value?.map((item) => ({
//       label: item.name,
//       value: JSON.stringify(
//         pick(item, ["name", "description", "amount", "expense_type_id"])
//       ),
//     }))
//   )
// );

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

// VIN search
const handleSearch = (query) => {
  searchVinSelect.value = query;
};
const { data: searchDealResult, isLoading: isVendorSearchLoading } =
  searchDealByVin(debouncedSearchVin);
const searchVinResultOptions = computed(() =>
  searchDealResult.value?.map((deal) => ({
    value: deal.id,
    label: deal.vin,
  }))
);

// Form Rules
const rules = {
  deal_id: {
    required: true,
    message: "Please select a VIN",
  },
  amount: {
    required: true,
    validator(rule, value) {
      if (value <= 0.01) {
        return new Error("Amount should be more than 0.01");
      }
    },
  },
  name: {
    required: true,
    message: "Name is required",
  },
  type: {
    required: true,
    message: "Expense type is required",
  },
  expense_date: {
    required: true,
    message: "Date is required",
  },
  description: {
    required: true,
    message: "Description is required",
  },
  invoice_number: {
    required: true,
    message: "Invoice Number is required",
  },
};

const submitForm = async () => {
  try {
    await formRef.value.validate();
    let obj = { ...form.value };
    obj.type = String(form.value.type);
    if (obj.expense_date) {
      obj.expense_date = dayjs(obj.expense_date).format("YYYY-MM-DD");
    }
    // obj = objectFilter(obj, (key, value) => value)
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
</script>

<template>
  <n-drawer
    :show="showDrawer"
    @update:show="$emit('update:show', false)"
    :width="500"
  >
    <n-drawer-content title="Add Expense">
      <n-form
        :model="form"
        :rules="rules"
        :label-width="90"
        size="medium"
        ref="formRef"
        :disabled="updateExpenseLoading"
      >
        <n-form-item label="VIN" path="deal_id" class="pt-0">
          <n-select
            placeholder="Search VIN"
            :options="searchVinResultOptions || dealOptions"
            v-model:value="form.deal_id"
            :loading="updateExpenseLoading || isVendorSearchLoading"
            filterable
            clearable
            remote
            @search="handleSearch"
          />
        </n-form-item>

        <n-form-item path="name" label="Name">
          <n-input
            v-model:value="form.name"
            :loading="updateExpenseLoading"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input
            type="textarea"
            v-model:value="form.description"
            :loading="updateExpenseLoading"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="type" label="Expense Type">
          <n-select
            :options="expenseTypeOptions"
            filterable
            v-model:value="form.type"
            :loading="updateExpenseLoading"
            @scroll="handleExpenseTypeSelectScroll"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="amount" label="Amount">
          <CurrencyInput
            v-model="form.amount"
            :loading="updateExpenseLoading"
          />
        </n-form-item>
        <n-form-item label="Invoice Number" path="invoice_number">
          <n-input
            clearable
            v-model:value="form.invoice_number"
            :loading="updateExpenseLoading"
          />
        </n-form-item>
        <n-form-item label="Expense Date" path="expense_date">
          <n-date-picker
            v-model:value="form.expense_date"
            format="yyyy-MM-dd"
            :loading="updateExpenseLoading"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button
          size="large"
          :disabled="updateExpenseLoading"
          :loading="updateExpenseLoading"
          @click.prevent="submitForm"
          >Update</n-button
        >
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
