<script setup>
import { computed, ref, watch } from "vue";
import { getExpenseTypes } from "@/hooks/expense";
import CurrencyInput from "@/components/common/CurrencyInput.vue";

const props = defineProps({
  showDrawer: Boolean,
  row: {
    type: Object,
    default: null,
  },
  isLoading: Boolean,
});
const emits = defineEmits(["submit", "update:show", "delete"]);

const formRef = ref(null);
const showModal = ref(false);

const initialForm = {
  name: "",
  description: "",
  expense_type_id: null,
  amount: 0,
};
const form = ref({
  ...initialForm,
});
watch(
  () => props.showDrawer,
  () => {
    if (props.showDrawer) {
      form.value = { ...initialForm, ...props.row };
    } else {
      form.value = { ...initialForm };
    }
  }
);
const rules = {
  name: {
    required: true,
    message: "Please enter a Name",
  },
  expense_type_id: {
    required: true,
    message: "Please enter a valid type",
  },
  amount: {
    required: true,
    message: "Please select a valid amount",
  },
};
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

const onSubmitForm = async () => {
  try {
    await formRef.value.validate();
    emits("submit", form.value);
    // mutate(objectFilter(form.value, (key, value) => value));
  } catch {}

  //message.success('Valid')
};
const updateShow = (show) => {
  emits("update:show", show);
  // form.value = { ...initialForm };
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
  <n-drawer :show="showDrawer" @update:show="updateShow" :width="500">
    <n-drawer-content title="Add Expense Item">
      <n-form
        :model="form"
        :rules="rules"
        size="medium"
        ref="formRef"
        :disabled="isLoading"
      >
        <n-form-item label="Name" path="name" class="pt-0">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Name"
            clearable
            v-model:value.trim="form.name"
            :loading="isLoading"
          />
        </n-form-item>

        <n-form-item label="Description">
          <n-input
            placeholder="Enter Description"
            clearable
            v-model:value="form.description"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Type" path="expense_type_id">
          <n-select
            :options="expenseTypeOptions"
            v-model:value="form.expense_type_id"
            filterable
            clearable
            :loading="isLoading"
            @scroll="handleExpenseTypeSelectScroll"
          />
        </n-form-item>
        <n-form-item label="Amount" path="amount">
          <CurrencyInput
            placeholder="Enter Amount"
            clearable
            v-model="form.amount"
            :loading="isLoading"
          />
        </n-form-item>
        <n-button size="large" attr-type="submit" class="invisible"
          >Add</n-button
        >
      </n-form>
      <template #footer>
        <div class="flex gap-x-4">
          <n-button
            size="large"
            type="error"
            v-if="form?.id"
            @click="showModal = true"
          >
            Delete
          </n-button>
          <n-button
            size="large"
            :loading="isLoading"
            :disabled="isLoading"
            @click="onSubmitForm"
          >
            Submit
          </n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
  <n-modal
    v-model:show="showModal"
    @positive-click="$emit('delete', form?.id)"
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
