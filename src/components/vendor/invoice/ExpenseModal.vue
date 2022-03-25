<script setup>
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { computed, ref } from "vue";
import { useDebounce } from "@vueuse/core";
import { omit, pick } from "@/lib/helper";
import CurrencyInput from "@/components/common/CurrencyInput.vue";

const props = defineProps({
  expense: {
    type: Object,
    required: true,
  },
  vendor_id: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(["submit"]);
const isLoading = false;
const searchVinSelect = ref("");
const debouncedSearchVin = useDebounce(searchVinSelect, 500);
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

const { data: expenseItems } = getVendorExpenseItems(props.vendor_id);

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

const initialForm = {
  expense_date: Date.now(),
  deal_id: null,
  name: "",
  description: "",
  // files: [],
  amount: 0,
  showSelect: true,
  type: null,
};
const form = ref({ ...initialForm, ...props.expense });

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

const rules = {
  expense_date: {
    required: true,
    type: "number",
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

const onExpenseSelect = (value) => {
  let obj;
  if (value === "add") {
    obj = {
      name: "",
      amount: 0,
      type: null,
    };
  } else {
    obj = JSON.parse(value);
    obj.amount = parseFloat(obj.amount);
    obj.type = obj.expense_type_id;
    delete obj.expense_type_id;
  }
  form.value = {
    ...form.value,
    ...obj,
    showSelect: false,
  };
};

const onSubmitForm = () => {
  emits("submit", omit(form.value, ["showSelect"]));
};
</script>

<template>
  <n-form :model="form" @submit.prevent="onSubmitForm" :rules="rules">
    <div class="sm:grid sm:grid-cols-2 sm:justify-between sm:gap-x-5">
      <n-form-item label="VIN" path="deal_id">
        <n-select
          placeholder="Search VIN"
          :options="searchVinResultOptions || dealOptions"
          v-model:value="form.deal_id"
          :loading="isLoading || isVendorSearchLoading"
          filterable
          remote
          @search="handleSearch"
        />
      </n-form-item>

      <n-form-item label="Expense Date" path="expense_date">
        <n-date-picker v-model:value="form.expense_date" format="MM/dd/yyyy" />
      </n-form-item>
    </div>
    <!-- <n-form-item label="Upload Images">
            <n-upload
              action="https://gmtvinventory.com/api/expenses/expense_files"
              multiple
              :data="{
                expense_id: form.id,
              }"
              :custom-request="customRequest"
              list-type="image-card"
            />
          </n-form-item> -->
    <n-form-item path="name" label="Name">
      <n-select
        :options="expenseItemsOptions"
        filterable
        @update-value="onExpenseSelect"
        :loading="isLoading"
        @scroll="handleExpenseTypeSelectScroll"
        v-if="form.showSelect"
      />
      <n-input v-else v-model:value="form.name" :loading="isLoading" />
    </n-form-item>
    <n-form-item label="Description">
      <n-input type="textarea" v-model:value="form.description" />
    </n-form-item>
    <div class="sm:flex sm:gap-x-5">
      <n-form-item path="type" label="Expense Type">
        <n-select
          :options="expenseTypeOptions"
          filterable
          v-model:value="form.type"
          :loading="isLoading"
        />
      </n-form-item>
      <n-form-item path="amount" label="Amount">
        <CurrencyInput v-model="form.amount" :loading="isLoading" />
      </n-form-item>
    </div>
    <n-space>
      <n-button attr-type="submit">Save</n-button>
    </n-space>
  </n-form>
</template>
