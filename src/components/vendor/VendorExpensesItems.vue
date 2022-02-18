<script setup>
import { h, defineComponent, ref, watch, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { NTag, NButton, useMessage } from "naive-ui";
import vendors from "@/api/vendors";
import expenses from "@/api/expenses";
import MaskedInput from "@/components/common/MaskedInput.vue";
import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import VendorExpensesItemsAdd from "@/components/vendor/VendorExpensesItemsAdd.vue";
import { useQuery } from "vue-query";
import axios from "axios";

const showOuterRef = ref(false);
const route = useRoute();

const formValue = ref({
  vendor_id: 0,
  name: "",
  description: "",
  type: "",
  amount: "",
});

const show = ref({
  name: false,
  description: false,
  type: false,
  amount: false,
});

const routeParamId = ref(route.params?.id);

const handleKeyUp = (val) => {
  show.value[val] = true;
};

const handleKeyDown = (val) => {
  show.value[val] = false;
};

watch(
  () => route.params?.id,

  () => {
    routeParamId.value = route.params?.id;
  }
);
const { data: expenseItems } = useQuery(
  ["vendorExpenseItems", routeParamId],
  ({ queryKey }) =>
    axios
      .get(`/expense_items/vendor/${queryKey[1]}`)
      .then((res) => (Array.isArray(res.data) ? res.data : [])),
  {
    retry: 0,
  }
);

const doShowOuter = (row) => {
  console.log(row);
  console.log(formValue.value.name);
  console.log(row.name);
  formValue.value.vendor_id = row.vendor_id;
  formValue.value.name = row.name;
  formValue.value.description = row.description;
  formValue.value.amount = row.amount;
  formValue.value.expense_type_id = row.expense_type_id;

  console.log(formValue.value);
  showOuterRef.value = true;
};

function updateVendor(key, val) {
  console.log(key);
  console.log(val);
  const data = {
    [key]: formValue.value[key],
  };

  // console.log(sendToAPI);
  vendors.updateContacts(data, formValue.value.vendor_id).then((res) => {
    console.log("Vendor Updated Successfully");

    update.value++;
    //debounceChange();
  });
}

const columns = [
  {
    title: "Name",
    key: "name",
    //fixed: 'left'
  },
  {
    title: "Description",
    key: "description",
    //fixed: 'left'
  },
  {
    title: "Expense Type",
    key: "expense_type_id",
    //fixed: 'left'
  },
  {
    title: "Amount",
    key: "amount",
    //fixed: 'left'
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return h(
        NButton,
        {
          strong: true,

          size: "medium",
          onClick: () => doShowOuter(row),
        },
        { default: () => "View / Edit" }
      );
    },
  },
];
const pagination = { pageSize: 10 };
</script>
<template>
  <div class="mt-4 px-4 font-sans antialiased">
    <div class="pb-4 justify-end"><VendorExpensesItemsAdd /></div>

    <div class="py-8 px-8 rounded-lg border-2">
      <div><p class="text-2xl font-bold pb-8">Expense Items</p></div>
      <n-data-table
        class="rounded-lg"
        :columns="columns"
        :data="expenseItems"
        :pagination="pagination"
        :bordered="false"
      />
    </div>
  </div>

  <n-drawer v-model:show="showOuterRef" :width="500">
    <n-drawer-content title="Expense Item Details">
      <n-form :model="formValue" :label-width="90" size="medium" ref="formRef">
        <n-form-item label="Name" class="pr-12">
          <n-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            type="text"
            v-model:value="formValue.name"
          />
        </n-form-item>
        <n-form-item label="Description" class="pr-12">
          <n-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            type="text"
            v-model:value="formValue.description"
          />
        </n-form-item>

        <n-form-item label="Type" class="pr-12">
          <n-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            type="text"
            placeholder="Enter Type"
            v-model:value="formValue.expense_type_id"
          />
        </n-form-item>

        <n-form-item label="Amount" class="pr-12">
          <n-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            type="text"
            v-model:value="formValue.amount"
            placeholder="Enter Amount"
          />
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
