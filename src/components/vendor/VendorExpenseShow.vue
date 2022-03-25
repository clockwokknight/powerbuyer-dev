<script setup>
import dayjs from "dayjs";
import { h, ref, watch } from "vue";
import VendorExpenseAction from "./invoice/VendorExpenseAction.vue";
import ExpenseModal from "./invoice/ExpenseModal.vue";

const props = defineProps({
  showDrawer: {
    type: Boolean,
    default: false,
  },
  formRow: {
    type: Object,
  },
});
defineEmits(["update:showDrawer"]);
watch(
  () => props.showDrawer,
  () => {
    console.log(props.formRow);
  }
);
const showExpenseModal = ref(false);
const currentExpense = ref(null);
const vendor_id = ref();

const columns = [
  {
    title: "VIN",
    key: "deal.vin",
    width: "200px",
    fixed: "left",
  },
  {
    title: "Item",
    key: "name",
    width: "100",
  },
  {
    title: "Description",
    key: "description",
    width: "200",
    render(row) {
      return h(
        "span",
        { class: "text-[8px] text-center" },
        { default: () => row.description }
      );
    },
  },
  {
    title: "DOS",
    key: "expense_date",
    render(row) {
      return h(
        "span",
        {},
        {
          default: () => dayjs(row.expense_date).format("MM/DD/YYYY"),
        }
      );
    },
  },
  {
    title: "Type",
    key: "expense_type.name",
  },
  {
    title: "Amount",
    key: "amount",
    render(row, index) {
      return h(
        "span",
        {
          class:
            "font-semibold bg-gray-800/10 border-2 rounded border-gray-500 px-3 py-2",
        },
        {
          default: () => `$${row.amount}`,
        }
      );
    },
  },
  {
    key: "action",
    render(row) {
      return h(VendorExpenseAction, {
        onAdd: () => {
          showExpenseModal.value = true;
          vendor_id.value = props.formRow.vendor[0].id;
          currentExpense.value = null;
        },
      });
    },
  },
];
const onSubmitExpense = (expense) => {};
</script>
<template>
  <n-modal
    preset="card"
    class="max-w-screen-lg"
    :show="showDrawer"
    v-bind="$attrs"
    @update:show="$emit('update:showDrawer')"
  >
    <header class="flex content-center justify-between">
      <section class="space-y-4">
        <div class="font-bold">
          <h3 class="text-xl">Invoice</h3>
          <h4># {{ formRow.invoice_number }}</h4>
        </div>
        <div class="text-left">
          <span class="block text-xs uppercase">Inv Date</span>
          <span class="text-sm font-bold">03/19/2022</span>
        </div>
        <div class="text-left">
          <span class="block text-xs uppercase">Vendor</span>
          <span class="text-sm font-bold">{{ formRow?.vendor[0]?.name }}</span>
        </div>
      </section>
      <section class="space-y-3">
        <div class="bg-primary/10 border-primary border px-4 py-1 font-bold uppercase">
          open
        </div>
        <div class="text-right">
          <span class="block text-xs uppercase">Due Date</span>
          <span class="text-sm font-bold">{{ formRow.due_date }}</span>
        </div>
        <div class="text-right">
          <span class="block text-xs uppercase">Terms</span>
          <span class="text-sm font-bold">Net 30</span>
        </div>
      </section>
    </header>
    <main class="mt-4">
      <h3 class="text-sm font-bold">Expenses</h3>
      <n-data-table
        :data="formRow.expenses"
        :columns="columns"
        striped
        class="pt-2"
        :max-height="500"
        :scroll-x="1300"
        row-class-name="group py-2"
      />

      <section class="dark:bg- bg-dark_border ml-auto mt-5 w-full max-w-xs rounded p-4">
        <div class="bg-foreground_dark p-4">
          <h5 class="font-medium uppercase">Inv Total</h5>
          <span class="text-lg font-bold">${{ formRow.amount_due }}</span>
        </div>
        <div class="space-y-2 px-4 pt-5">
          <div>
            <h5 class="font-medium uppercase">Payments</h5>
            <span class="text-lg font-bold">${{ formRow.amount_paid }}</span>
          </div>
          <div>
            <h5 class="font-medium uppercase">Balance</h5>
            <span class="text-lg font-bold">${{ formRow.balance }}</span>
          </div>
        </div>
      </section>
    </main>
    <template #footer>
      <div class="flex gap-x-5">
        <button
          class="border-primary bg-primary/40 rounded border-2 px-8 py-3 text-sm font-bold text-white"
        >
          SAVE
        </button>
        <button
          class="border-primary rounded border-2 px-5 py-3 text-sm font-bold text-white"
        >
          DELETE
        </button>
      </div>
    </template>
  </n-modal>
  <n-modal
    preset="card"
    class="max-w-screen-sm"
    :title="(currentExpense ? 'Edit' : 'Add') + ' Expense'"
    v-model:show="showExpenseModal"
  >
    <expense-modal
      :expense="currentExpense"
      :vendor_id="vendor_id"
      @save="onSubmitExpense"
    />
  </n-modal>
</template>
