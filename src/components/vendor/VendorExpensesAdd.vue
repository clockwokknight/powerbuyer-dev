<script setup>
import { ref, computed, onMounted, watch, toRef } from "vue";
import { useMessage } from "naive-ui";
import { getAllDeals, searchDealByVin } from "@/hooks/deals";
import { useDebounce } from "@vueuse/core";
import { useRoute } from "vue-router";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { getExpenseTypes, getVendorExpenseItems } from "@/hooks/expense";
import { pick } from "@/lib/helper";

const props = defineProps({
  showDrawer: Boolean,
  row: {
    type: Object,
    default: null,
  },
  isLoading: Boolean,
});
const emits = defineEmits(["submit", "update:show", "delete"]);
const message = useMessage();

const expenseItemsOptions = computed(
  () =>
    expenseItems.value?.map((item) => ({
      label: item.name,
      value: JSON.stringify(
        pick(item, ["name", "description", "amount", "expense_type_id"])
      ),
    })) ?? []
);

const { data: expense_types } = getExpenseTypes();

const expenseTypeOptions = computed(() =>
  expense_types.value?.map((expense) => ({
    label: expense.name,
    value: expense.id,
  }))
);

const formRef = ref(null);

const initialForm = {
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
};

const form = ref({ ...initialForm });
const showDrawer = toRef(props, "showDrawer");
watch(showDrawer, (newValue) => {
  if (newValue) {
    form.value = { ...form.value, ...props.row };
    vendor_id.value = form.value?.vendor_id;
  }
});

const vendor_id = ref(props.row?.vendor_id);

const { data: expenseItems } = getVendorExpenseItems(vendor_id, {
  enabled: showDrawer,
});
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
async function submitExpense() {
  try {
    await formRef.value.validate();
    emits("submit", form.value);
  } catch (e) {}
}

const onVisibleForm = () => {
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
const updateShow = (show) => {
  emits("update:show", show);
  form.value = { ...initialForm };
};
</script>
<template>
  <n-drawer :show="showDrawer" @update:show="updateShow" :width="500">
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
        <n-select
          :options="expenseItemsOptions"
          filterable
          @update-value="onExpenseSelect"
          :disabled="isLoading"
          :loading="isLoading"
        />

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
              <n-input
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
          <currency-input clearable v-model="form.cost" :loading="isLoading" />
        </n-form-item>
        <n-form-item label="Invoice Number">
          <n-input
            clearable
            v-model:value="form.invoice_number"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Expense Date">
          <n-date-picker
            v-model:value="form.expense_date"
            format="yyyy-MM-dd"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Notes">
          <n-input
            placeholder="Notes"
            type="textarea"
            clearable
            v-model:value="form.notes"
            :loading="isLoading"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button size="large" @click="submitExpense">Submit</n-button>
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
