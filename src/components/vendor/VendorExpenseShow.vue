<script setup>
import dayjs from "dayjs";
import { h, ref, toRaw, watch, toRef, unref } from "vue";
import VendorExpenseAction from "./invoice/VendorExpenseAction.vue";
import ExpenseModal from "./invoice/ExpenseModal.vue";
import { clone, pick, omit } from "@/lib/helper";
import { useQueryClient, useMutation } from "vue-query";
import { useMessage } from "naive-ui";
import axios from "axios";
import CustomInput from "../common/CustomInput.vue";
import { format } from "v-money3";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
  },
});
const emits = defineEmits(["update:show"]);

const showExpenseModal = ref(false);
const currentExpense = ref(null);
const vendor_id = ref();
const deletedExpenses = ref([]);
const deleteInvoiceModal = ref(false);

const initialForm = {
  vendor_id: null,
  amount_due: 0,
  amount_paid: 0,
  balance: 0,
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
const rules = {
  amount_due: {
    type: "number",
    required: true,
    validator(rule, value) {
      if (value <= 0.01) {
        return new Error("Amount should be more than 0.01");
      }
    },
    trigger: "change",
  },
  invoice_number: {
    required: true,
    message: "Invoice Number is required",
    trigger: "input",
  },
  due_date: {
    required: true,
    type: "number",
    message: "Date is required",
    trigger: ["blur", "change"],
  },
};
const form = ref({ ...initialForm });
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      form.value = clone(props.initialData);
      form.value.due_date = dayjs(form.value.due_date).valueOf();
      form.value.amount_due = parseFloat(props.initialData.amount_due);
      form.value.amount_paid = parseFloat(props.initialData.amount_paid);
      form.value.balance = parseFloat(props.initialData.balance);
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
        files: expense.files.map((file) => ({
          id: file.id,
          name: file.filename,
          url: file.storage,
          type: file.mime_type,
          status: "finished",
        })),
        amount: parseFloat(expense.amount),
        showSelect: false,
      }));
      vendor_id.value = form.value.vendor_id;
    } else {
      form.value = clone(initialForm);
    }
  }
);
watch(
  () => form.value?.expenses,
  (newFormValue) => {
    if (newFormValue && newFormValue?.length > 0) {
      form.value.amount_due = form.value.balance = newFormValue?.reduce(
        (prev, curr) => prev + parseFloat(curr.amount),
        0
      );
    } else {
      form.value.amount_due = 0;
    }
  },
  { deep: true, flush: "post" }
);

// Mutations
const queryClient = useQueryClient();
const message = useMessage();
const { mutate: updateExpense, isLoading: updateExpenseLoading } = useMutation(
  ({ id, ...data }) => axios.put(`/vendor_invoices/${id}`, data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendorInvoices", String(vendor_id.value)]);
      emits("update:show", false);
      message.success("Expense updated successfully.");
    },
  }
);

const { mutateAsync: deleteExpense, isLoading: deleteExpenseLoading } = useMutation(
  (id) => axios.delete("/vendor_invoices/" + id),
  {
    onSuccess() {
      emits("update:show", false);
      queryClient.invalidateQueries(["vendorInvoices", String(vendor_id.value)]);
      message.success("Expense deleted successfully.");
    },
  }
);
const editExpenseIndex = ref();
const columns = [
  // {
  //   title: "",
  //   key: "files",
  //   render(row) {
  //      return h()
  //   },
  // },
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
    render(row) {
      return form.value.amount_paid > 0
        ? h("div")
        : h(
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
          editExpenseIndex.value = null;
        },
        onEdit: () => {
          vendor_id.value = props.initialData.vendor[0].id;
          currentExpense.value = toRaw(row);
          currentExpense.value.expense_date = dayjs(
            currentExpense.value.expense_date
          ).valueOf();
          showExpenseModal.value = true;
          editExpenseIndex.value = rowIndex;
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
  if (editExpenseIndex.value !== null) {
    form.value.expenses[editExpenseIndex.value] = expense;
  } else {
    form.value.expenses.push({ ...expense });
  }
};
const onDeleteInvoice = () => {
  deleteExpense(initialData.id);
};
const submitForm = async () => {
  // try {
  // await formRef.value.validate();
  let obj = omit(unref(form), ["vendor", "payment_invoices"]);
  // remove Proxy from expenses array
  obj.expenses = toRaw(form.value.expenses);
  // remove Proxy each object from array and remove 'showSelect' and 'expense_types'
  obj.expenses = obj.expenses
    .map((expense) => {
      const modifiedExpense = {
        ...omit(toRaw(expense), ["expense_type", "showSelect", "deal", "files"]),
        expense_date: dayjs(expense.expense_date).format("YYYY-MM-DD"),
      };
      if (!modifiedExpense?.id) {
        modifiedExpense.expense_files_ids = toRaw(expense).files.map(
          (exp) => exp.file_id
        );
      }
      return modifiedExpense;
    })
    // Also add deleted Expense array so that it removes from the database as well.
    .concat(unref(deletedExpenses));
  obj.due_date = dayjs(obj.due_date).format("YYYY-MM-DD");
  obj = omit(obj, ["invoice_number"]);
  console.log(obj);
  updateExpense(obj);
  // } catch (e) {}
};
const onInvoiceDelete = () => {
  console.log("deleting");
};
</script>
<template>
  <n-modal
    preset="card"
    class="max-w-screen-lg lg:max-w-[80vw]"
    :show="show"
    v-bind="$attrs"
    @update:show="(val) => $emit('update:show', val)"
  >
    <n-form :model="form" :rules="rules">
      <header class="flex content-center justify-between">
        <section class="space-y-4">
          <div class="font-bold">
            <h3 class="text-xl">Invoice</h3>
            <h4># {{ initialData.invoice_number }}</h4>
          </div>
          <div class="text-left">
            <span class="block text-xs uppercase">Inv Date</span>
            <span class="text-sm font-bold">{{
              dayjs(initialData.created_at).format("MM/DD/YYYY")
            }}</span>
          </div>
          <div class="text-left">
            <span class="block text-xs uppercase">Vendor</span>
            <span class="text-sm font-bold">{{ initialData?.vendor[0]?.name }}</span>
          </div>
        </section>
        <section class="space-y-3">
          <div class="border-primary bg-primary/10 border px-4 py-1 font-bold uppercase">
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

        <section class="dark:bg- bg-dark_border mt-5 ml-auto w-full max-w-xs rounded p-4">
          <div class="bg-foreground_dark p-4">
            <h5 class="font-medium uppercase">Inv Total</h5>
            <span class="text-lg font-bold">${{ format(form.amount_due) }}</span>
          </div>
          <div class="space-y-2 px-4 pt-5">
            <div>
              <h5 class="font-medium uppercase">Payments</h5>
              <span class="text-lg font-bold">${{ initialData.amount_paid }}</span>
            </div>
            <div>
              <h5 class="font-medium uppercase">Balance</h5>
              <span class="text-lg font-bold">${{ format(form.balance) }}</span>
            </div>
          </div>
        </section>
      </main>
    </n-form>
    <template #footer>
      <div class="flex gap-x-5" v-if="form.amount_paid === 0">
        <button
          class="border-primary bg-primary/40 rounded border-2 px-8 py-3 text-sm font-bold text-white"
          @click.prevent="submitForm"
        >
          SAVE
        </button>
        <button
          class="border-primary rounded border-2 px-5 py-3 text-sm font-bold text-white"
          @click.prevent="onInvoiceDelete"
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
