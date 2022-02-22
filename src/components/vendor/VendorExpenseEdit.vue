<script setup>
import { computed, ref, toRef, watch } from "vue";
import { useDebounce } from "@vueuse/core";
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { pick } from "@/lib/helper";
import { useMutation } from "vue-query";
import axios from "axios";

const props = defineProps(["showDrawer", "initialForm"]);
const emits = defineEmits(["update:show"]);

const initialForm = {
  deal_id: null,
  vendor_id: null,
  amount: 0,
  expense_date: null,
  invoice_number: "",
};
const form = ref({ ...initialForm });
const vendor_id = ref();
const searchVinSelect = ref("");
const debouncedSearchVin = useDebounce(searchVinSelect, 500);

const showDrawer = toRef(props, "showDrawer");
watch(showDrawer, (newValue) => {
  if (newValue) {
    form.value = { ...props.initialForm };
  }
});
// Mutations
const { mutate: updateExpense, isLoading: updateExpenseLoading } = useMutation(
  ({ id, ...data }) => axios.post("/expenses", data)
);

// Queries
const { data: expense_types } = getExpenseTypes();
const expenseTypeOptions = computed(() =>
  expense_types.value?.map((expense) => ({
    label: expense.name,
    value: expense.id,
  }))
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
        <n-form-item label="Description">
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
            v-model:value="form.expense_items[index].expense_type_id"
            :loading="updateExpenseLoading"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="amount" label="Amount">
          <CurrencyInput
            v-model="form.amount"
            :loading="updateExpenseLoading"
          />
        </n-form-item>
        <n-form-item label="Invoice Number">
          <n-input
            clearable
            v-model:value="form.invoice_number"
            :loading="updateExpenseLoading"
          />
        </n-form-item>
        <n-form-item label="Expense Date">
          <n-date-picker
            v-model:value="form.expense_date"
            format="yyyy-MM-dd"
            :loading="updateExpenseLoading"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button size="large">Update</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
