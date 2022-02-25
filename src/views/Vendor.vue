<script setup>
import { computed, onMounted, defineAsyncComponent, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQueryClient } from "vue-query";
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
import CustomInput from "@/components/common/CustomInput.vue";
import Tabs from "@/components/common/Tabs.vue";

const VendorContacts = defineAsyncComponent({
  loader: () => import("@/components/vendor/VendorContacts.vue"),
});

const route = useRoute();
const router = useRouter();

const message = useMessage();
const queryClient = useQueryClient();

const currentActiveField = ref(null);
const routeParamId = ref(route.params?.id);

let form = ref({});

const vendorTabs = ref([
  {
    title: "EXPENSES",
    value: "#expenses",
  },
  {
    title: "PAYMENTS",
    value: "#payments",
  },
  {
    title: "EXPENSE ITEMS",
    value: "#expense-items",
  },
  {
    title: "CONTACTS",
    value: "#contacts",
  },
]);

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
      console.log("successfully mutated data");
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
  console.log("resetting value...");
  console.log("old value", vendor.value[key]);
  form[key] = vendor.value[key];
  currentActiveField.value = null;
}

function submitValue(key) {
  console.log("submitting value");
  console.log("new value: ", form[key]);
  if (!compare(vendor.value[key], form[key])) {
    mutateAsync({ [key]: form[key] }).then(() => {
      currentActiveField.value = null;
    });
  }
  currentActiveField.value = null;
}

function handleTabClick(e) {
  window.location.hash = e;
}

function handleScroll(e) {
  console.log(e);
}

onMounted(() => {
  console.log("mounted vendors");
});
// LOAD TABLE DATA
</script>

<template>
  <div
    @scroll="handleScroll(e)"
    class="__vendor-card grid grid-cols-12 rounded-xl border-2 bg-white p-6"
  >
    <!-- left side -->

    <div class="__form col-span-8">
      <h3 class="font-bold translate-x-4 mb-4">VENDOR</h3>

      <CustomInput
        type="header"
        :value="vendor?.name"
        v-model="form.name"
        placeholder="Company Name"
        @save="submitValue('name')"
        @cancel="resetValue('name')"
        @focus="currentActiveField = 'name'"
      />

      <div class="grid grid-cols-12 gap-4 mt-12">
        <!-- row 1 -->
        <div class="col-span-6">
          <CustomInput
            label="Address"
            :value="vendor?.address_one"
            v-model="form.address_one"
            placeholder=""
            @save="submitValue('address_one')"
            @cancel="resetValue('address_one')"
            @focus="currentActiveField = 'address_one'"
          />
        </div>
        <div class="col-span-6">
          <CustomInput
            label="Address 2"
            :value="vendor?.address_two"
            v-model="form.address_two"
            placeholder=""
            @save="submitValue('address_two')"
            @cancel="resetValue('address_two')"
            @focus="currentActiveField = 'address_two'"
          />
        </div>
        <!-- row 2 -->
        <div class="col-span-4">
          <CustomInput
            label="City"
            :value="vendor?.city"
            v-model="form.city"
            placeholder=""
            @save="submitValue('city')"
            @cancel="resetValue('city')"
            @focus="currentActiveField = 'city'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            type="select"
            label="State"
            :options="statesList"
            :value="vendor?.state"
            v-model="form.state"
            placeholder=""
            @save="submitValue('state')"
            @cancel="resetValue('state')"
            @focus="currentActiveField = 'state'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            label="Zip Code"
            :value="vendor?.zip"
            v-model="form.zip"
            placeholder=""
            @save="submitValue('zip')"
            @cancel="resetValue('zip')"
            @focus="currentActiveField = 'zip'"
          />
        </div>
        <!-- row 3 -->
        <div class="col-span-4">
          <CustomInput
            label="Email"
            :value="vendor?.email"
            v-model="form.email"
            placeholder=""
            @save="submitValue('email')"
            @cancel="resetValue('email')"
            @focus="currentActiveField = 'email'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            label="Phone"
            placeholder=""
            :value="vendor?.phone"
            v-model="form.phone"
            @save="submitValue('phone')"
            @cancel="resetValue('phone')"
            @focus="currentActiveField = 'phone'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            label="Fax"
            :value="vendor?.fax"
            v-model="form.fax"
            placeholder=""
            @save="submitValue('fax')"
            @cancel="resetValue('fax')"
            @focus="currentActiveField = 'fax'"
          />
        </div>
        <!-- row 4 -->
        <div class="col-span-4">
          <CustomInput
            label="DIN"
            :value="vendor?.din"
            v-model="form.din"
            placeholder=""
            @save="submitValue('din')"
            @cancel="resetValue('din')"
            @focus="currentActiveField = 'din'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            label="Tax ID"
            :value="vendor?.tax_id_number"
            v-model="form.text_id_number"
            placeholder=""
            @save="submitValue('tax_id_number')"
            @cancel="resetValue('tax_id_number')"
            @focus="currentActiveField = 'tax_id_number'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            type="select"
            label="Category"
            :options="vendorCategoryOptions"
            :value="vendor?.vendor_category_id"
            v-model="form.vendor_category_id"
            placeholder=""
            @save="submitValue('vendor_category_id')"
            @cancel="resetValue('vendor_category_id')"
            @focus="currentActiveField = 'vendor_category_id'"
          />
        </div>
      </div>
    </div>

    <!-- right side -->

    <div class="col-span-4 flex flex-col justify-between items-end">
      <div class="__invoice-info">
        <div class="flex justify-end">
          <p class="text-sm font-bold">Open Invoices</p>
        </div>
        <div class="flex justify-end pb-20">
          <p class="font-bold text-2xl">$10,193</p>
        </div>
      </div>

      <div class="__invoice-buttons flex flex-col justify-center items-end min-w-max">
        <button class="__invoice-button">
          <span><b>+</b> Add payment</span>
        </button>
        <button class="__invoice-button">
          <span><b>+</b> Create expense</span>
        </button>
      </div>
    </div>
  </div>

  <Tabs
    class="bg-white rounded-xl border-2 border-gray-200 mt-4 sticky top-0 z-50"
    :items="vendorTabs"
    @click="handleTabClick"
  />

  <VendorExpenses />
  <VendorPayments />
  <VendorExpensesItems />
  <Suspense>
    <template #default><VendorContacts /></template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>

<style lang="scss">
.__invoice-button {
  transition-timing-function: ease;
  @apply h-10 w-full mt-[14px] flex justify-center items-center text-center duration-[200ms] px-3 rounded-md border-[1px] border-lightgray;
  &:hover {
    @apply text-secondary border-secondary;
  }
  svg {
    transition-timing-function: $overshoot;
    @apply mr-2 h-full duration-[400ms];
  }
}
</style>
