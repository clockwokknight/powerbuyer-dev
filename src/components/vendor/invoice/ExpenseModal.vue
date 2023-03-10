<script setup>
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import { omit, pick } from "@/lib/helper";
import { useDebounce } from "@vueuse/core";
import axios from "axios";
import { computed, ref, toRaw, unref, watch } from "vue";
import CurrencyInput from "@/components/common/CurrencyInput.vue";

const props = defineProps({
  expense: {
    type: [Object, null],
  },
  vendor_id: {
    type: [String, Number],
    required: true,
  },
});
const emits = defineEmits(["save:expense"]);
const isLoading = false;
const searchVinSelect = ref("");
const formRef = ref(null);
const debouncedSearchVin = useDebounce(searchVinSelect, 500);
// VIN search
const handleSearch = (query) => {
  searchVinSelect.value = query;
};
const { data: searchDealResult, isLoading: isVendorSearchLoading } =
  searchDealByVin(debouncedSearchVin);
const searchVinResultOptions = computed(() =>
  searchDealResult?.value?.map((deal) => ({
    value: deal.id,
    label: deal.vin,
  }))
);

const { data: expenseItems } = getVendorExpenseItems(String(props.vendor_id));

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
  invoice_number: "",
  deal_id: null,
  name: "",
  description: "",
  files: [],
  amount: 0,
  showSelect: true,
  type: null,
  deal: {},
  expense_type: {},
};
const form = ref({ ...initialForm, ...props.expense });

// Queries
const {
  data: expense_types,
  hasNextPage: hasExpenseTypeNextPage,
  fetchNextPage: fetchNextExpenseTypePage,
} = getExpenseTypes();

const expenseTypeOptions = computed(() => {
  let expenseTypeComputed = expense_types.value?.pages.reduce(
    (prev, current) =>
      prev.concat(
        current?.data.map((expense) => ({
          label: expense.name,
          value: expense.id,
        })) ?? []
      ),
    []
  );
  /**
   * Concat all the expense types from expense items so that
   * expense type doesn't show id instead of showing the label
   */
  expenseTypeComputed = expenseTypeComputed.concat(
    expenseItems.value?.map((expense_item) => ({
      value: expense_item.expense_item_type.id,
      label: expense_item.expense_item_type.name,
    })) ?? []
  );
  if (props.expense?.expense_type) {
    expenseTypeComputed = expenseTypeComputed.concat([
      {
        value: props.expense.expense_type.id,
        label: props.expense.expense_type.name,
      },
    ]);
  }
  expenseTypeComputed = expenseTypeComputed.filter(
    (el, index, array) =>
      index === array.findIndex((arr) => arr.value === el.value)
  );
  return expenseTypeComputed;
});

const { data: deals } = getAllDeals();
const dealOptions = computed(() => {
  let computedDeals =
    deals.value?.pages.reduce(
      (prev, current) =>
        prev.concat(
          current?.data.map((deal) => ({
            value: deal.id,
            label: deal.vin,
          })) ?? []
        ),
      []
    ) ?? [];
  if (props.expense && props.expense?.deal) {
    computedDeals = computedDeals
      .concat([{ value: props.expense.deal.id, label: props.expense.deal.vin }])
      .filter(
        (el, index, array) =>
          index === array.findIndex((arr) => arr.value === el.value)
      );
  }
  return computedDeals;
});

const getResultFromArray = (arr, id) => {
  return arr.find((val) => val.value === id);
};

/**
 * watching deal_id and type so that we are returning deal and expense_type object
 * back to the table showing deal and expense type information
 */
watch(
  () => form.value.deal_id,
  (newValue) => {
    if (newValue) {
      form.value.deal = {
        id: form.value.deal_id,
        vin: searchVinSelect.value
          ? getResultFromArray(searchVinResultOptions.value, newValue).label
          : getResultFromArray(dealOptions.value, newValue).label,
      };
    }
  }
);

watch(
  () => form.value.type,
  (newValue) => {
    if (newValue) {
      form.value.expense_type = {
        id: form.value.type,
        name:
          getResultFromArray(expenseTypeOptions.value, newValue)?.label ?? "",
      };
    }
  }
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
    trigger: ["blur", "change"],
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
const onRemoveImage = async ({ file }) => {
  if (typeof file.id === "number") {
    await axios.delete("/expense_files/" + file.id);
  } else if (file.file_id) {
    await axios.delete("/expense_files/" + file.file_id);
  }
  return true;
};
const onSubmitForm = async () => {
  try {
    await formRef.value.validate();
    const expense = unref(form.value);
    expense.files = expense.files.filter((file) => file.status === "finished");
    emits("save:expense", form.value);
  } catch (error) {}
};
/**
 * Update list of files
 * @param {object} data
 * @param {import('naive-ui').UploadFileInfo[]} data.fileList
 * @param {import('naive-ui').UploadFileInfo} data.file
 * @param {ProgressEvent} data.event
 */
const handleChangeImage = ({ file, fileList, event }) => {
  if (event?.target?.status === 200 && event?.target.response) {
    const response = JSON.parse(event?.target.response);
    const index = fileList.findIndex(
      (currentFile) => currentFile.id === file.id
    );
    fileList[index].file_id = response?.expense_files_id[0].id ?? undefined;
    fileList[index].url = response?.expense_files_id[0].storage ?? null;
  }
};
</script>

<template>
  <n-form
    :model="form"
    ref="formRef"
    @submit.prevent="onSubmitForm"
    :rules="rules"
  >
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
    <n-form-item label="Images">
      <n-upload
        action="https://gmtvinventory.com/api/expense_files"
        multiple
        v-model:file-list="form.files"
        :data="form.id ? { expense_id: form.id } : undefined"
        name="files[]"
        accept="image/*"
        @change="handleChangeImage"
        list-type="image-card"
        @remove="onRemoveImage"
      />
    </n-form-item>
    <div class="sm:grid sm:grid-cols-2 sm:justify-between sm:gap-x-5">
      <n-form-item path="name" label="Name">
        <n-select
          :options="expenseItemsOptions"
          filterable
          @update-value="onExpenseSelect"
          :loading="isLoading"
          v-if="form.showSelect"
        />
        <n-input v-else v-model:value="form.name" :loading="isLoading" />
      </n-form-item>
      <n-form-item label="Vendor Invoice Number">
        <n-input v-model:value="form.invoice_number" />
      </n-form-item>
    </div>
    <n-form-item label="Description">
      <n-input type="textarea" v-model:value="form.description" />
    </n-form-item>
    <div class="sm:flex sm:gap-x-5">
      <n-form-item path="type" label="Expense Type">
        <n-select
          :options="expenseTypeOptions"
          filterable
          v-model:value="form.type"
          @scroll="handleExpenseTypeSelectScroll"
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
