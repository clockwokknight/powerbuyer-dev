<script setup>
import dayjs from "dayjs";
import { h } from "vue";

defineProps({
  showDrawer: {
    type: Boolean,
    default: false,
  },
  formRow: {
    type: Object,
  },
});
defineEmits(["update:showDrawer"]);

const columns = [
  {
    title: "VIN",
    key: "deal.vin",
  },
  {
    title: "Item",
    key: "name",
  },
  {
    title: "Description",
    key: "description",
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
];
</script>
<template>
  <n-modal
    preset="card"
    class="max-w-screen-lg"
    :show="showDrawer"
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
        <button class="bg-primary/10 border-primary border px-4 py-1 font-bold uppercase">
          open
        </button>
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
        row-class-name="group py-2"
      />

      <section class="dark:bg- bg-dark_border ml-auto mt-5 w-full max-w-xs rounded p-4">
        <div class="bg-foreground_dark p-4">
          <h5 class="font-medium uppercase">Inv Total</h5>
          <span class="text-lg font-bold">${{ formRow.amount_due }}</span>
        </div>

        <div class="">
          <h5 class="font-medium uppercase">Payments</h5>
          <!-- <span>{{formRow?.payment_invoices}}</span> -->
        </div>
      </section>
    </main>
  </n-modal>
</template>
