<!--script setup>
import { computed, h, ref, watch } from "vue";
import ActionButtons from "@/components/vendor/ActionButtons.vue";
import { vendorInvoices } from "@/hooks/vendor";
import { clone, omit, pick } from "@/lib/helper";
import dayjs from "dayjs";

const rowKey = (row) => row?.id;
const columns = [
  {
    title: "Invoice",
    key: "invoice_number",
  },
  {
    title: "Amount Due",
    key: "amount_due",
    //fixed: 'left'
  },
  {
    title: "Balance",
    key: "balance",
  },
  {
    title: "Amount Paid",
    key: "amount_paid",
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return h(ActionButtons, {
        onEdit: () => showEditExpenseForm(row),
      });
    },
  },
];

const pagination = { pageSize: 10 };
const visibleEditForm = ref(false);
const formRow = ref(null);
const formDisabled = ref(false);

function showEditExpenseForm(row) {
  let obj = clone(row);
  obj.expenses = clone(row.expenses).map((expense) =>
    pick(expense, [
      "id",
      "amount",
      "type",
      "expense_date",
      "deal_id",
      "name",
      "description",
      "expense_types",
    ])
  );
  obj = omit(obj, [
    "payments",
    "balance",
    "amount_paid",
    "children",
    "vendor_name",
  ]);

  formDisabled.value = Boolean(row?.payments.length);
  formRow.value = obj;
  visibleEditForm.value = true;
}
</script-->

<!--template>
  <div
    id="expenses"
    class="mt-[24px] scroll-smooth border-[1px] border-transparent dark:border-dark_border"
  >
    <div class="font-sans">
      <div
        class="rounded-round border-2 bg-white py-8 px-8 dark:border-0 dark:bg-foreground_dark"
      >
        <div class="flex justify-between">
          <p class="pb-8 text-2xl font-bold">Invoices & Expenses</p>
        </div>
        <n-data-table
          class="rounded-round"
          striped
          :columns="columns"
          :data="invoicesData"
          :pagination="pagination"
          :bordered="false"
          :loading="expensesDataLoading"
          :row-key="rowKey"
        />
      </div>
    </div>
  </div>
</template-->
