<script setup>
import { ref, computed } from "vue";
import { useMessage } from "naive-ui";
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { useDebounce } from "@vueuse/core";
import { useRoute } from "vue-router";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import { pick } from "@/lib/helper";

const visible = ref(false);
const route = useRoute();
const routeParamId = ref(route.params?.id);

const { data: expenseItems } = getVendorExpenseItems(routeParamId);

const expenseItemsOptions = computed(() =>
  expenseItems.value?.map((item) => ({
    label: item.name,
    value: JSON.stringify(
      pick(item, ["name", "description", "amount", "expense_type_id"])
    ),
  }))
);

const { data: expense_types } = getExpenseTypes();

const expenseTypeOptions = computed(() =>
  expense_types.value?.map((expense) => ({
    label: expense.name,
    value: expense.id,
  }))
);

const formRef = ref(null);
const form = ref({
  deal_id: null,
  vendor_id: null,
  cost: 0,
  expense_date: null,
  invoice_number: "",
  notes: "",
  expense_items: [
    // {
    //   name: "",
    //   description: "",
    //   amount: 0,
    //   expense_type_id: null,
    // },
  ],
});
const message = useMessage();
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

const { data: searchDealResult, isLoading } =
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
async function addExpense() {
  try {
    await formRef.value.validate();
  } catch (e) {}
}

const onVisibleForm = () => {
  visible.value = !visible.value;
  routeParamId.value = route.params?.id;
  form.value.vendor_id = parseInt(route.params?.id);
};

const onExpenseSelect = (value) => {
  const obj = JSON.parse(value);
  obj.amount = parseFloat(obj.amount);
  form.value.expense_items = form.value.expense_items.concat([obj]);
};

const onCreateExpenseItems = () => {
  return {
    name: "",
    description: "",
    amount: 0,
    expense_type_id: null,
  };
};
</script>
<template>
  <n-button @click="onVisibleForm">
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
  <n-drawer v-model:show="visible" :width="500">
    <n-drawer-content title="Add Expense">
      <n-form
        :model="form"
        :rules="rules"
        :label-width="90"
        @submit.prevent="addExpense"
        size="medium"
        ref="formRef"
      >
        <n-form-item label="VIN" path="deal_id" class="pt-0">
          <n-select
            placeholder="Search VIN"
            :options="searchVinResultOptions || dealOptions"
            v-model:value="form.vin"
            :loading="isLoading"
            filterable
            clearable
            remote
            @search="handleSearch"
          />
        </n-form-item>
        <n-select
          :options="expenseItemsOptions"
          filterable
          @update-value="onExpenseSelect"
        />

        <n-dynamic-input
          v-model:value="form.expense_items"
          class="my-5 custom-dynamic-input"
          @create="onCreateExpenseItems"
          #="{ index, value }"
        >
          <div class="bg-gray-200 rounded p-3">
            <n-form-item
              ignore-path-change
              :path="`expense_items[${index}].name`"
              :rule="rules.expense_items.name"
              label="Name"
            >
              <n-input
                v-model:value="form.expense_items[index].name"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item label="description">
              <n-input
                type="textarea"
                v-model:value="form.expense_items[index].description"
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
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item
              ignore-path-change
              :path="`expense_items[${index}].amount`"
              :rule="rules.expense_items.amount"
              label="Amount"
            >
              <CurrencyInput v-model="form.expense_items[index].amount" />
            </n-form-item>
          </div>
        </n-dynamic-input>

        <n-form-item label="Cost" path="cost" class="pt-0">
          <currency-input clearable v-model="form.cost" />
        </n-form-item>

        <n-form-item label="Notes">
          <n-input
            placeholder="Notes"
            type="textarea"
            clearable
            v-model:value="form.notes"
          />
        </n-form-item>

        <button type="submit" class="invisible">Add</button>
      </n-form>
      <template #footer>
        <n-button size="large" @click="addExpense">Add</n-button>
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
