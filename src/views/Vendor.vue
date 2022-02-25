<script setup>
import { computed, defineAsyncComponent, reactive, ref, watch } from "vue";
import { useMutation, useQueryClient } from "vue-query";
import { useRoute } from "vue-router";
import { getVendorById, useVendorCategories } from "@/hooks/vendor";
import { pick } from "@/lib/helper";
import { useMessage } from "naive-ui";
import { getPaymentTerms, getStates } from "@/hooks/common_query";
import compare from "just-compare";
import axios from "axios";

import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import MaskedInput from "@/components/common/MaskedInput.vue";
import VendorExpensesItems from "@/components/vendor/VendorExpensesItems.vue";
import VendorExpenses from "@/components/vendor/VendorExpenses.vue";
import VendorPayments from "@/components/vendor/VendorPayments.vue";

const VendorContacts = defineAsyncComponent({
  loader: () => import("@/components/vendor/VendorContacts.vue"),
});

const route = useRoute();
const message = useMessage();
const queryClient = useQueryClient();

const currentActiveField = ref(null);
const routeParamId = ref(route.params?.id);

let form = reactive({});

const { data: vendorCategory } = useVendorCategories();
const vendorCategoryOptions = computed(() =>
  vendorCategory.value?.pages.reduce(
    (prev, current) =>
      prev.concat(
        current.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      ),
    []
  )
);

const { data: paymentTerms } = getPaymentTerms();
const paymentTermOptions = computed(() =>
  paymentTerms.value?.map((payment) => ({
    label: payment.name,
    value: payment.name,
  }))
);

const { data: statesList } = getStates();
const { data: vendor } = getVendorById(routeParamId);

const { isLoading, mutateAsync } = useMutation(
  (data) => axios.put(`/vendors/${vendor.value.id}`, data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendor", routeParamId.value]);
    },
  }
);

watch(
  () => route.params?.id,
  () => {
    if (route.params?.id) {
      routeParamId.value = route.params?.id;
    }
  }
);

watch(vendor, (newValue) => {
  if (newValue) {
    const obj = pick(newValue, [
      "name",
      "payment_terms",
      "din",
      "vendor_category_id",
      "vendor_type",
      "tax_id_number",
      "address_one",
      "address_two",
      "city",
      "state",
      "country",
      "zip",
      "phone",
      "email",
      "comments",
      "accounting_code",
    ]);
    Object.keys(obj).forEach((key) => {
      form[key] = obj[key];
    });
  }
});

function resetValue(key) {
  form[key] = vendor.value[key];
  currentActiveField.value = null;
}

function submitValue(key) {
  if (!compare(vendor.value[key], form[key])) {
    mutateAsync({ [key]: form[key] }).then(() => {
      currentActiveField.value = null;
    });
  }
  currentActiveField.value = null;
}

// LOAD TABLE DATA
</script>

<template>
  <div class="mt-4 px-4 pb-8">
    <div class="__vendor-card rounded-lg border-4 bg-white p-12">
      <!-- left side -->

      <!-- right side -->

      <div class="__invoice-info">
        <div class="flex justify-end">
          <p class="text-sm font-bold">Open Invoices</p>
        </div>
        <div class="flex justify-end pb-20">
          <p class="font-bold text-[2.5rem]">$10,193</p>
        </div>
      </div>

      <div class="__invoice-buttons flex justify-end items-center w-full">
        <button class="__invoice-button bg-lightergray hover:bg-lightgray text-primary">
          <svg class="fill-primary" viewBox="0 0 24 24">
            <path
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 5a.75.75 0 0 0-.743.648l-.007.102v3.5h-3.5a.75.75 0 0 0-.102 1.493l.102.007h3.5v3.5a.75.75 0 0 0 1.493.102l.007-.102v-3.5h3.5a.75.75 0 0 0 .102-1.493l-.102-.007h-3.5v-3.5A.75.75 0 0 0 12 7z"
            ></path>
          </svg>
          <span>Add expense items</span>
        </button>
        <button class="__invoice-button bg-lightergray hover:bg-lightgray text-primary">
          <svg class="fill-primary" viewBox="0 0 24 24">
            <path
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 5a.75.75 0 0 0-.743.648l-.007.102v3.5h-3.5a.75.75 0 0 0-.102 1.493l.102.007h3.5v3.5a.75.75 0 0 0 1.493.102l.007-.102v-3.5h3.5a.75.75 0 0 0 .102-1.493l-.102-.007h-3.5v-3.5A.75.75 0 0 0 12 7z"
            ></path>
          </svg>
          <span>Add payment</span>
        </button>
        <button class="__invoice-button bg-primary hover:bg-primarydark text-white">
          <svg class="fill-white" viewBox="0 0 24 24">
            <path
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 5a.75.75 0 0 0-.743.648l-.007.102v3.5h-3.5a.75.75 0 0 0-.102 1.493l.102.007h3.5v3.5a.75.75 0 0 0 1.493.102l.007-.102v-3.5h3.5a.75.75 0 0 0 .102-1.493l-.102-.007h-3.5v-3.5A.75.75 0 0 0 12 7z"
            ></path>
          </svg>
          <span>Create expense</span>
        </button>
      </div>
    </div>
  </div>

  <Suspense>
    <template #default><VendorContacts /></template>
    <template #fallback> Loading... </template>
  </Suspense>

  <VendorExpensesItems />
  <VendorExpenses />
  <VendorPayments />
</template>

<style lang="scss">
.__invoice-button {
  transition-timing-function: ease;
  @apply h-12 ml-6 flex justify-between items-center duration-[300ms] pl-2 pr-6 py-2 rounded-full tracking-wider font-bold;
  &:hover {
    svg {
      @apply scale-[1.3] rotate-90;
    }
  }
  svg {
    transition-timing-function: $overshoot;
    @apply mr-4 h-full duration-[400ms];
  }
}
</style>
