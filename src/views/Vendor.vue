<script setup>
import {
  computed,
  onMounted,
  defineAsyncComponent,
  getCurrentInstance,
  ref,
  watch,
  watchEffect,
  nextTick,
  unref,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQueryClient } from "vue-query";
import {
  getInvoiceTotalByVendor,
  getVendorById,
  useVendorCategories,
} from "@/hooks/vendor";
import { getPaymentTerms, getStates } from "@/hooks/common_query";
import { useGlobalState } from "@/store/global";
import { pick } from "@/lib/helper";
import { utils } from "@/lib/utils";
import { useMessage } from "naive-ui";
import compare from "just-compare";
import axios from "axios";

import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import MaskedInput from "@/components/common/MaskedInput.vue";
import VendorExpensesItems from "@/components/vendor/VendorExpensesItems.vue";
import VendorExpenses from "@/components/vendor/VendorExpenses.vue";
import VendorPayments from "@/components/vendor/VendorPayments.vue";
import CustomInput from "@/components/common/CustomInput.vue";
import Tabs from "@/components/common/Tabs.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useTabsViewStore } from "@/store/tabs";

const VendorContacts = defineAsyncComponent({
  loader: () => import("@/components/vendor/VendorContacts.vue"),
});

const instance = getCurrentInstance();

const global = useGlobalState();
const route = useRoute();
const router = useRouter();
const message = useMessage();
const queryClient = useQueryClient();

const currentActiveField = ref(null);
const routeParamId = ref(route.params?.id);

const vendorTabs = ref([
  {
    title: "DETAILS",
    value: "#details",
  },
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
const { data: getInvoicesTotal } = getInvoiceTotalByVendor(routeParamId);
const { data: statesList } = getStates();

const { data: vendor, isLoading: isVendorLoading } = getVendorById(routeParamId);

const form = ref({
  name: "",
  address_one: "",
  address_two: "",
  city: "",
  state: "",
  zip: "",
  email: "",
  phone: "",
  fax: "",
  din: "",
  tax_id_number: "",
  vendor_category_id: "",
  payment_terms: "",
});

watch(
  () => vendor.value,
  (newValue) => {
    if (newValue) form.value = { ...newValue };
  },
  { immediate: true }
);

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
  (val) => {
    if (route.params?.id) {
      routeParamId.value = route.params?.id;
    }
  },
  {
    immediate: true,
  }
);

function resetValue(key) {
  form.value = {
    ...form.value,
    [key]: vendor.value[key],
  };
  currentActiveField.value = null;
}

function submitValue(key) {
  mutateAsync({ [key]: form.value[key] })
    .then((data) => {
      message.success("Saved");
      console.clear();
      console.log(data);
      currentActiveField.value = null;
    })
    .catch((err) => {
      message.error("An error ocurred");
      console.log("uh oh...", err);
    });
  currentActiveField.value = null;
}

function handleTabClick(e) {
  window.location.hash = e;
}

let tabs = computed(() => global.tabs);
const vendorTab = ref(null);
const { stop } = useIntersectionObserver(
  vendorTab,
  ([e], observerElement) => {
    e.target.toggleAttribute("stuck", e.intersectionRatio < 1);
  },
  { threshold: [1] }
);

// LOAD TABLE DATA
</script>

<template>
  <div
    id="details"
    class="__section __vendor-card mt-4 grid grid-cols-12 rounded border-2 dark:border-0 bg-white dark:bg-[#25272A] p-6"
  >
    <!-- left side -->
    <div class="__form col-span-12 md:col-span-8 flex flex-col justify-between">
      <div class="__title">
        <h3 class="mb-2 translate-x-2 font-bold">VENDOR</h3>
        <CustomInput
          type="header"
          placeholder="Company Name"
          :value="form.name"
          @update:value="(val) => (form.name = val)"
          @save="submitValue('name')"
          @cancel="resetValue('name')"
          @focus="currentActiveField = 'name'"
        />
      </div>
      <div class="__form mt-8 grid grid-cols-12 gap-4">
        <!-- row 1 -->
        <div class="col-span-12 md:col-span-6">
          <CustomInput
            label="Address"
            placeholder=""
            :value="form.address_one"
            :validate="['required']"
            @update:value="(val) => (form.address_one = val)"
            @save="submitValue('address_one')"
            @cancel="resetValue('address_one')"
            @focus="currentActiveField = 'address_one'"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <CustomInput
            label="Address 2"
            placeholder=""
            :value="form.address_two"
            @update:value="(val) => (form.address_two = val)"
            @save="submitValue('address_two')"
            @cancel="resetValue('address_two')"
            @focus="currentActiveField = 'address_two'"
          />
        </div>
        <!-- row 2 -->
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="City"
            placeholder=""
            :value="form.city"
            :validate="['required']"
            @update:value="(val) => (form.city = val)"
            @save="submitValue('city')"
            @cancel="resetValue('city')"
            @focus="currentActiveField = 'city'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            type="select"
            label="State"
            placeholder=""
            :options="statesList"
            :value="form.state"
            :validate="['required']"
            @update:value="(val) => (form.state = val)"
            @save="submitValue('state')"
            @cancel="resetValue('state')"
            @focus="currentActiveField = 'state'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Zip Code"
            placeholder="#####-####"
            mask="#####-####"
            :validate="['required']"
            :value="form.zip"
            @update:value="(val) => (form.zip = val)"
            @save="submitValue('zip')"
            @cancel="resetValue('zip')"
            @focus="currentActiveField = 'zip'"
          />
        </div>
        <!-- row 3 -->
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Email"
            placeholder=""
            :validate="['required', 'email']"
            :value="form.email"
            @update:value="(val) => (form.email = val)"
            @save="submitValue('email')"
            @cancel="resetValue('email')"
            @focus="currentActiveField = 'email'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Phone"
            placeholder="+1 (###) ###-####"
            mask="+1 (###) ###-####"
            :value="form.phone"
            :validate="['required', 'phone']"
            @update:value="(val) => (form.phone = val)"
            @save="submitValue('phone')"
            @cancel="resetValue('phone')"
            @focus="currentActiveField = 'phone'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Fax"
            placeholder="+1 (###) ###-####"
            mask="+1 (###) ###-####"
            :value="form.fax"
            :validate="['phone']"
            @update:value="(val) => (form.fax = val)"
            @save="submitValue('fax')"
            @cancel="resetValue('fax')"
            @focus="currentActiveField = 'fax'"
          />
        </div>
        <!-- row 4 -->
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="DIN"
            placeholder=""
            :validate="['required']"
            :value="form.din"
            @update:value="(val) => (form.din = val)"
            @save="submitValue('din')"
            @cancel="resetValue('din')"
            @focus="currentActiveField = 'din'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Tax ID"
            placeholder=""
            :validate="['required']"
            :value="form.tax_id_number"
            @update:value="(val) => (form.tax_id_number = val)"
            @save="submitValue('tax_id_number')"
            @cancel="resetValue('tax_id_number')"
            @focus="currentActiveField = 'tax_id_number'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            type="select"
            label="Category"
            placeholder=""
            :validate="['required']"
            :options="vendorCategoryOptions"
            :value="form.vendor_category_id"
            @update:value="(val) => (form.vendor_category_id = val)"
            @save="submitValue('vendor_category_id')"
            @cancel="resetValue('vendor_category_id')"
            @focus="currentActiveField = 'vendor_category_id'"
          />
        </div>
      </div>
    </div>

    <!-- right side -->

    <div
      class="mt-[24px] md:mt-0 col-span-12 md:col-span-4 flex flex-col md:items-end justify-between"
    >
      <div class="__invoice-info mb-[24px] md:mb-0">
        <div class="flex md:justify-end">
          <p class="text-sm font-bold">Open Invoices</p>
        </div>
        <div class="flex justify-end">
          <p class="text-2xl font-bold">{{ getInvoicesTotal }}</p>
        </div>
      </div>
      <div class="align-end max-w-[220px] flex-col justify-between">
        <CustomInput
          type="select"
          label="Payment Terms"
          :validate="['required']"
          :options="paymentTermOptions"
          :value="form.payment_terms"
          placeholder=""
          @update:value="(val) => (form.payment_terms = val)"
          @save="submitValue('payment_terms')"
          @cancel="resetValue('payment_terms')"
          @focus="currentActiveField = 'payment_terms'"
        />
        <div
          class="__invoice-buttons mt-[58px] flex min-w-max max-w-full flex-col items-end justify-center"
        >
          <button class="__invoice-button" @click="global.openDrawer('payments')">
            <span><b>+</b> Add payment</span>
          </button>
          <button class="__invoice-button">
            <span><b>+</b> Create expense</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <Tabs
    id="__subtabs"
    type="basic"
    ref="vendorTab"
    class="sticky top-[-2px] left-0 z-40 mt-4 w-full rounded border-2 dark:border-0 border-gray-200 bg-white dark:bg-[#25272A] duration-300"
    :items="vendorTabs"
    @click="handleTabClick"
  />

  <VendorExpenses class="__section" />
  <VendorPayments class="__section" />
  <VendorExpensesItems class="__section" />
  <Suspense>
    <template #default><VendorContacts class="__section" /></template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>

<style lang="scss">
#__subtabs[stuck] {
  @apply bg-[#f9fafb] dark:bg-[#25272A];
  @apply rounded-none border-2 border-none border-transparent shadow-lg shadow-[#00000011];
}
.__veil {
  width: calc(100vw - 370px);
}
.__section {
  @apply scroll-mt-[100px] rounded-md;
}
.__invoice-button {
  transition-timing-function: ease;
  @apply mt-[14px] flex h-10 w-full items-center justify-center rounded-sm border-[1px] border-lightgray px-3 text-center duration-[200ms];
  &:hover {
    @apply border-secondary text-secondary;
  }
  svg {
    transition-timing-function: $overshoot;
    @apply mr-2 h-full duration-[400ms];
  }
}
</style>
