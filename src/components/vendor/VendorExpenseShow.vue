<script setup>
import dayjs from "dayjs";
import { h, ref, toRaw, watch, toRef } from "vue";
import VendorExpenseAction from "./invoice/VendorExpenseAction.vue";
import ExpenseModal from "./invoice/ExpenseModal.vue";
import { clone, pick } from "@/lib/helper";
import { useQueryClient, useMutation } from "vue-query";
import { useMessage } from "naive-ui";
import axios from "axios";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
  },
});
defineEmits(["update:show"]);

const showExpenseModal = ref(false);
const currentExpense = ref(null);
const vendor_id = ref();
const deletedExpenses = ref([]);
const deleteInvoiceModal = ref(false);

const initialForm = {
  vendor_id: null,
  amount_due: 0,
  invoice_number: "",
  due_date: Date.now(),
  expenses: [
    // {
    //   expense_date: Date.now(),
    //   deal_id: null,
    //   name: "",
    //   description: "",
    //   files: [],
    //   amount: 0,
    //   showSelect: true,
    //   type: null,
    // },
  ],
};
const form = ref({ ...initialForm });
watch(
  () => props.show,
  (newValue) => {
    console.log(newValue);
    if (newValue) {
      form.value = clone(props.initialData);
      form.value.due_date = dayjs(form.value.due_date).valueOf();
      form.value.expenses = form.value.expenses.map((expense) => ({
        ...pick(expense, [
          "deal",
          "deal_id",
          "description",
          "expense_type",
          "type",
          "name",
          "expense_date",
          "id",
        ]),
        amount: parseFloat(expense.amount),
        showSelect: false,
      }));
      vendor_id.value = form.value.vendor_id;
    } else {
      form.value = clone(initialForm);
    }
  }
);

// Mutations
const queryClient = useQueryClient();
const message = useMessage();
const { mutate: updateExpense, isLoading: updateExpenseLoading } = useMutation(
  ({ id, ...data }) =>
    axios.put(`/vendor_invoices/${id}`, {
      ...data,
      amount_paid: 0,
      balance: data.amount_due,
    }),
  {
    onSuccess() {
      queryClient.invalidateQueries([
        "vendorInvoices",
        String(vendor_id.value),
      ]);
      emits("update:show", false);
      message.success("Expense updated successfully.");
    },
  }
);

const { mutateAsync: deleteExpense, isLoading: deleteExpenseLoading } =
  useMutation((id) => axios.delete("/vendor_invoices/" + id), {
    onSuccess() {
      emits("update:show", false);
      queryClient.invalidateQueries([
        "vendorInvoices",
        String(vendor_id.value),
      ]);
      message.success("Expense deleted successfully.");
    },
  });

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
    fixed: "right",
    width: "140",
    render(row, rowIndex) {
      return h(VendorExpenseAction, {
        onAdd: () => {
          showExpenseModal.value = true;
          vendor_id.value = props.initialData.vendor[0].id;
          currentExpense.value = null;
        },
        onEdit: () => {
          vendor_id.value = props.initialData.vendor[0].id;
          currentExpense.value = toRaw(row);
          currentExpense.value.expense_date = dayjs(
            currentExpense.value.expense_date
          ).valueOf();
          showExpenseModal.value = true;
        },
        onDelete: () => {
          if (row.id) {
            deletedExpenses.value.push({ id: row.id, delete_record: 1 });
          }
          form.value.expenses.splice(rowIndex, 1);
        },
      });
    },
  },
];
const onSaveExpense = (expense) => {
  showExpenseModal.value = false;
  if (expense.id) {
    console.log(expense);
  } else {
    form.value.expenses.push({ ...expense });
  }
};
const onDeleteInvoice = () => {
  deleteExpense(initialData.id);
};
</script>
<template>
  <n-modal
    preset="card"
    class="max-w-screen-lg"
    :show="show"
    v-bind="$attrs"
    @update:show="(val) => $emit('update:show', val)"
  >
    <header class="flex content-center justify-between">
      <section class="space-y-4">
        <div class="font-bold">
          <h3 class="text-xl">Invoice</h3>
          <h4># {{ initialData.invoice_number }}</h4>
        </div>
        <div class="text-left">
          <span class="block text-xs uppercase">Inv Date</span>
          <span class="text-sm font-bold">03/19/2022</span>
        </div>
        <div class="text-left">
          <span class="block text-xs uppercase">Vendor</span>
          <span class="text-sm font-bold">{{
            initialData?.vendor[0]?.name
          }}</span>
        </div>
      </section>
      <section class="space-y-3">
        <div
          class="border border-primary bg-primary/10 px-4 py-1 font-bold uppercase"
        >
          open
        </div>
        <div class="text-right">
          <span class="block text-xs uppercase">Due Date</span>
          <span class="text-sm font-bold">{{ initialData.due_date }}</span>
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
        :data="form.expenses"
        :columns="columns"
        striped
        class="pt-2"
        :max-height="500"
        :scroll-x="1300"
        row-class-name="group py-2"
      />

      <section
        class="dark:bg- ml-auto mt-5 w-full max-w-xs rounded bg-dark_border p-4"
      >
        <div class="bg-foreground_dark p-4">
          <h5 class="font-medium uppercase">Inv Total</h5>
          <span class="text-lg font-bold">${{ initialData.amount_due }}</span>
        </div>
        <div class="space-y-2 px-4 pt-5">
          <div>
            <h5 class="font-medium uppercase">Payments</h5>
            <span class="text-lg font-bold"
              >${{ initialData.amount_paid }}</span
            >
          </div>
          <div>
            <h5 class="font-medium uppercase">Balance</h5>
            <span class="text-lg font-bold">${{ initialData.balance }}</span>
          </div>
        </div>
      </section>
    </main>
    <template #footer>
      <div class="flex gap-x-5">
        <button
          class="rounded border-2 border-primary bg-primary/40 px-8 py-3 text-sm font-bold text-white"
        >
          SAVE
        </button>
        <button
          class="rounded border-2 border-primary px-5 py-3 text-sm font-bold text-white"
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
      @save:expense="onSaveExpense"
    />
  </n-modal>
  <n-modal
    preset="dialog"
    type="error"
    title="Delete Expense"
    content="Are you sure?"
    positive-text="Delete"
    negative-text="Cancel"
    @negative-click="deleteInvoiceModal = false"
    @positive-click="onDeleteInvoice"
    v-model:show="deleteInvoiceModal"
  />
</template>
