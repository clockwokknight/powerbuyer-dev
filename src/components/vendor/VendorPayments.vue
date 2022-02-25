<template>
  <n-message-provider>
    <div class="-mt-4 font-sans antialiased">
      <div class="flex justify-end items-center translate-y-[68px] pr-10">
        <VendorPaymentsAdd />
      </div>

      <div class="rounded-xl border-2 py-8 px-8 bg-white">
        <div><p class="text-2xl font-bold pb-8">Payments</p></div>
        <n-data-table
          class="rounded-lg"
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          :bordered="false"
        />
      </div>
    </div>

    <n-drawer v-model:show="showOuterRef" :width="500">
      <n-drawer-content title="Payment Details">
        <n-form :model="formValue" :label-width="90" size="medium" ref="formRef">
          <n-form-item label="Inv #" class="pr-12">
            <UpdatableButtonWrapper
              v-model="formValue.invoice_number"
              :reset-value="formValue.invoice_number"
              :shouldUpdate="show.invoice_number"
              @revert="handleKeyDown('invoice_number')"
              @save="(val) => updateVendor('invoice_number', val)"
            >
              <n-input
                style="width: 400px"
                class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0"
                :default-value="formValue.invoice_number"
                type="text"
                v-model:value="formValue.invoice_number"
                :loading="isLoading"
                @keyup="handleKeyUp('invoice_number')"
              />
            </UpdatableButtonWrapper>
          </n-form-item>
          <n-form-item label="Check Number" class="pr-12">
            <UpdatableButtonWrapper
              v-model="formValue.check_number"
              :reset-value="formValue.check_number"
              :shouldUpdate="show.check_number"
              @revert="handleKeyDown('check_number')"
              @save="(val) => updateVendor('check_number', val)"
            >
              <n-input
                style="width: 400px"
                class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0"
                :default-value="formValue.check_number"
                type="text"
                v-model:value="formValue.check_number"
                :loading="isLoading"
                @keyup="handleKeyUp('check_number')"
              />
            </UpdatableButtonWrapper>
          </n-form-item>

          <n-form-item label="Amount" class="pr-12">
            <UpdatableButtonWrapper
              v-model="formValue.amount"
              :reset-value="formValue.amount"
              :shouldUpdate="show.amount"
              @revert="handleKeyDown('amount')"
              @save="(val) => updateVendor('amount', val)"
            >
              <n-input
                style="width: 400px"
                class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0"
                :default-value="formValue.amount"
                type="text"
                v-model:value="formValue.amount"
                :loading="isLoading"
                placeholder="Enter Amount"
                @keyup="handleKeyUp('amount')"
              />
            </UpdatableButtonWrapper>
          </n-form-item>

          <n-form-item label="Status" class="pr-12">
            <UpdatableButtonWrapper
              v-model="formValue.payment_status_id"
              :reset-value="formValue.payment_status_id"
              :shouldUpdate="show.payment_status_id"
              @revert="handleKeyDown('payment_status_id')"
              @save="(val) => updateVendor('payment_status_id', val)"
            >
              <n-input
                style="width: 400px"
                class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0"
                :default-value="formValue.payment_status_id"
                type="text"
                placeholder="Enter Type"
                v-model:value="formValue.payment_status_id"
                :loading="isLoading"
                @keyup="handleKeyUp('payment_status_id')"
              />
            </UpdatableButtonWrapper>
          </n-form-item>
        </n-form>
      </n-drawer-content>
    </n-drawer>
  </n-message-provider>
</template>

<script setup>
import { h, defineComponent, ref, watch, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { NTag, NButton, useMessage } from "naive-ui";
import vendors from "@/api/vendors";
import payments from "@/api/payments";
import MaskedInput from "@/components/common/MaskedInput.vue";
import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import VendorPaymentsAdd from "@/components/vendor/VendorPaymentsAdd.vue";

const tableData = ref([]);
const showOuterRef = ref(false);
const route = useRoute();

const isLoading = ref(false);

const formValue = ref({
  vendor_id: 0,
  invoice_number: "",
  check_number: "",
  type: "",
  amount: "",
});

const show = ref({
  invoice_number: false,
  check_number: false,
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
    payments.all().then((res) => {
      tableData.value = res.data;
    });
  }
);

payments.all().then((res) => {
  // console.log(res.data)
  tableData.value = res.data;
});

const doShowOuter = (row) => {
  console.log(row);
  console.log(formValue.value.invoice_number);
  console.log(row.invoice_number);
  formValue.value.vendor_id = row.vendor_id;
  formValue.value.invoice_number = row.invoice_number;
  formValue.value.check_number = row.check_number;
  formValue.value.amount = row.amount;
  formValue.value.payment_status_id = row.payment_status_id;

  console.log(formValue.value);
  showOuterRef.value = true;
};

function updateVendor(key, val) {}

const columns = [
  {
    title: "Inv #",
    key: "invoice_number",
    //fixed: 'left'
  },
  {
    title: "Check Number",
    key: "check_number",
    //fixed: 'left'
  },
  {
    title: "Amount",
    key: "amount",
    //fixed: 'left'
  },
  {
    title: "Status",
    key: "payment_status_id",
    //fixed: 'left'
  },
  {
    title: "Payment Date",
    key: "payment_date",
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
