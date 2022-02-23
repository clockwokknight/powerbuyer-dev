<script setup>
import { ref, computed, onMounted, watch, toRef } from "vue";
import { useMessage } from "naive-ui";
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { useDebounce } from "@vueuse/core";
import { useRoute } from "vue-router";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import { objectFilter, omit, pick } from "@/lib/helper";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "vue-query";
import axios from "axios";

const message = useMessage();
const queryClient = useQueryClient();
const route = useRoute();

const showDrawer = ref(false);
const formRef = ref(null);
const isLoading = ref(false);
const initialForm = {
  deal_id: null,
  vendor_id: null,
  cost: 0,
  expense_date: null,
  invoice_number: "",
  expense_items: [
    // {
    //   name: "",
    //   description: "",
    //   amount: 0,
    //   expense_type_id: null,
    // },
  ],
};
const form = ref({ ...initialForm });

const vendor_id = ref(route.params?.id);

watch(
  () => route.params?.id,
  () => {
    if (route.params?.id) {
      vendor_id.value = route.params?.id;
      form.value.vendor_id = parseInt(route.params?.id);
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
  () => form.value?.expense_items,
  (newFormValue) => {
    if (newFormValue.length > 0) {
      form.value.cost = newFormValue?.reduce(
        (prev, curr) => prev + curr.amount,
        0
      );
    }
  },
  { deep: true }
);

const rules = {
  deal_id: {
    required: true,
    message: "Please select a VIN",
  },
  cost: {
    required: true,
    validator(rule, value) {
      if (value <= 0.01) {
        return new Error("Amount should be more than 0.01");
      }
    },
  },
  expense_date: {
    required: true,
    message: "Date is required",
  },
  expense_items: {
    name: {
      required: true,
      message: "Name is required",
    },
    expense_type_id: {
      required: true,
      message: "Expense type is required",
    },
    amount: {
      required: true,
      validator(rule, value) {
        if (value <= 0.01) {
          return new Error("Amount should be more than 0.01");
        }
      },
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

const { mutateAsync: createExpense } = useMutation((data) =>
  axios.post("/expenses", data)
);

const onCreateExpense = (formValue) => {
  const { expense_items, ...rest } = formValue;
  if (expense_items.length > 0) {
    const msg = message.loading("Submitting", { duration: 10000 });
    isLoading.value = true;
    Promise.all(
      expense_items.map(async (item) => {
        return new Promise(async (resolve) => {
          setTimeout(async () => {
            let obj = {
              ...rest,
              ...omit(item, ["expense_type_id"]),
            };
            obj = objectFilter(obj, (key, value) => value);
            await createExpense(obj);
            resolve("working");
          }, 1000);
        });
      })
    ).then(() => {
      showDrawer.value = false;
      queryClient.invalidateQueries(["expensesByVendor", vendor_id.value]);
      console.log(["expensesByVendor", vendor_id]);
      msg.type = "success";
      msg.content = "Expense Created Successfully";
      isLoading.value = false;
      form.value = { ...initialForm };
      setTimeout(() => {
        msg.destroy();
      }, 3000);
    });
  }
};

async function submitExpense() {
  try {
    await formRef.value.validate();
    // const modifiedForm = omit(form.value, ['cost'])
    const modifiedForm = { ...form.value };
    if (modifiedForm.expense_date)
      modifiedForm.expense_date = dayjs(modifiedForm.expense_date).format(
        "YYYY-MM-DD"
      );
    else delete modifiedForm.expense_date;

    modifiedForm.expense_items = modifiedForm.expense_items.map((item) => ({
      ...omit(item, ["showSelect", "expense_type_id"]),
      type: String(item.expense_type_id),
    }));
    onCreateExpense(modifiedForm);
  } catch (e) {
    message.error("Invalid data");
  }
}

const onExpenseSelect = (value, index) => {
  let obj = {};
  if (value === "add") {
    obj = { ...onCreateExpenseItems() };
  } else {
    obj = JSON.parse(value);
    obj.amount = parseFloat(obj.amount);
  }

  form.value.expense_items[index] = { ...obj, showSelect: false };
};

const onCreateExpenseItems = () => {
  return {
    name: "",
    description: "",
    amount: 0,
    expense_type_id: null,
    showSelect: true,
  };
};
</script>
<template>
  <n-button @click="showDrawer = true">
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
    Add Expense
  </n-button>
  <n-drawer v-model:show="showDrawer" :width="500">
    <n-drawer-content title="Add Expense">
      <n-form
        :model="form"
        :rules="rules"
        :label-width="90"
        size="medium"
        ref="formRef"
        :disabled="isLoading"
      >
        <n-form-item label="VIN" path="deal_id" class="pt-0">
          <n-select
            placeholder="Search VIN"
            :options="searchVinResultOptions || dealOptions"
            v-model:value="form.deal_id"
            :loading="isLoading || isVendorSearchLoading"
            filterable
            clearable
            remote
            @search="handleSearch"
          />
        </n-form-item>

        <n-dynamic-input
          v-model:value="form.expense_items"
          class="custom-dynamic-input my-5"
          @create="onCreateExpenseItems"
          #="{ index, value }"
          show-sort-button
        >
          <div class="rounded bg-gray-200/50 p-3">
            <n-form-item
              ignore-path-change
              :path="`expense_items[${index}].name`"
              :rule="rules.expense_items.name"
              label="Name"
            >
              <n-select
                :options="expenseItemsOptions"
                filterable
                @update-value="(val) => onExpenseSelect(val, index)"
                :disabled="isLoading"
                :loading="isLoading"
                v-if="form.expense_items[index].showSelect"
              />
              <n-input
                v-else
                v-model:value="form.expense_items[index].name"
                :loading="isLoading"
                :disabled="isLoading"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item label="Description">
              <n-input
                type="textarea"
                v-model:value="form.expense_items[index].description"
                :loading="isLoading"
                :disabled="isLoading"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item
              ignore-path-change
              :path="`expense_items[${index}].expense_type_id`"
              :rule="rules.expense_items.expense_type_id"
              label="Expense Type"
            >
              <n-select
                :options="expenseTypeOptions"
                filterable
                v-model:value="form.expense_items[index].expense_type_id"
                :loading="isLoading"
                :disabled="isLoading"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item
              ignore-path-change
              :path="`expense_items[${index}].amount`"
              :rule="rules.expense_items.amount"
              label="Amount"
            >
              <CurrencyInput
                v-model="form.expense_items[index].amount"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </n-form-item>
          </div>
        </n-dynamic-input>

        <n-form-item label="Cost" path="cost">
          <currency-input
            clearable
            v-model="form.cost"
            :loading="isLoading"
            disabled
          />
        </n-form-item>
        <n-form-item label="Invoice Number">
          <n-input
            clearable
            v-model:value="form.invoice_number"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Expense Date" path="expense_date">
          <n-date-picker
            v-model:value="form.expense_date"
            format="yyyy-MM-dd"
            :loading="isLoading"
          />
        </n-form-item>
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
    </n-drawer-content>
  </n-drawer>
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
