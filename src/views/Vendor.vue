<script setup>
import {
  computed,
  onMounted,
  defineAsyncComponent,
  getCurrentInstance,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQueryClient } from "vue-query";
import { getVendorById, useVendorCategories } from "@/hooks/vendor";
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

let payload = ref({});

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

const { data: statesList } = getStates();
const { data: vendor, isLoading: isVendorLoading } = getVendorById(routeParamId);

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

watchEffect(() => {
  console.log(payload.value);
});

watch(vendor, (vendor) => {
  vendor && global.addTab({ title: vendor.name, value: vendor.id });
});

watch(payload.value, (val) => {
  console.log("\npayload updated: ", payload.value);
});

function resetValue(key) {
  console.log("\n");
  console.log(`resetting value: ${payload.value} ==> ${vendor?.value[key]}`);
  payload.value = vendor?.value[key];
  console.log("payload: ", payload.value);
  currentActiveField.value = null;
  instance?.proxy?.$forceUpdate();
}

function submitValue(key) {
  console.clear();
  console.log("submitting");
  mutateAsync({ [key]: payload.value })
    .then((data) => {
      message.success("Saved");
      console.log("submission promise: ", data);
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

// LOAD TABLE DATA
</script>

<template>
  <div
    class="__veil top-0 left-[390px] h-[60px] bg-lightergray fixed z-50 -translate-x-10"
  ></div>

  <Tabs
    id="__tabs"
    class="duration-300 bg-white rounded-xl border-2 border-gray-200 sticky top-[24px] z-50"
    :class="
      global.stuck[0] &&
      'shadow-xl shadow-[#00000011] !rounded-t-xl rounded-r-xl rounded-b-none rounded-l-none'
    "
    :items="tabs"
    @click="(e) => router.push(`/vendors/${e}`)"
  />

  <div
    id="details"
    class="__section __vendor-card grid grid-cols-12 rounded-xl border-2 bg-white p-6 mt-4"
  >
    <!-- left side -->
    <div class="__form flex flex-col justify-between col-span-8">
      <div class="__title">
        <h3 class="font-bold translate-x-2 mb-2">VENDOR</h3>
        <CustomInput
          type="header"
          placeholder="Company Name"
          :value="vendor?.name"
          v-model:value="payload"
          @save="submitValue('name')"
          @cancel="resetValue('name')"
          @focus="currentActiveField = 'name'"
        />
      </div>
      <div class="__form grid grid-cols-12 gap-4 mt-8">
        <!-- row 1 -->
        <div class="col-span-6">
          <CustomInput
            label="Address"
            placeholder=""
            :value="vendor?.address_one"
            v-model:value="payload"
            @save="submitValue('address_one')"
            @cancel="resetValue('address_one')"
            @focus="currentActiveField = 'address_one'"
          />
        </div>
        <div class="col-span-6">
          <CustomInput
            label="Address 2"
            placeholder=""
            :value="vendor?.address_two"
            v-model:value="payload"
            @save="submitValue('address_two')"
            @cancel="resetValue('address_two')"
            @focus="currentActiveField = 'address_two'"
          />
        </div>
        <!-- row 2 -->
        <div class="col-span-4">
          <CustomInput
            label="City"
            placeholder=""
            :value="vendor?.city"
            v-model:value="payload"
            @save="submitValue('city')"
            @cancel="resetValue('city')"
            @focus="currentActiveField = 'city'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            type="select"
            label="State"
            placeholder=""
            :options="statesList"
            :value="vendor?.state"
            v-model:value="payload"
            @save="submitValue('state')"
            @cancel="resetValue('state')"
            @focus="currentActiveField = 'state'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            label="Zip Code"
            type="mask"
            mask="#####-####"
            placeholder="#####-####"
            :value="vendor?.zip"
            v-model:value="payload"
            @save="submitValue('zip')"
            @cancel="resetValue('zip')"
            @focus="currentActiveField = 'zip'"
          />
        </div>
        <!-- row 3 -->
        <div class="col-span-4">
          <CustomInput
            label="Email"
            placeholder=""
            :value="vendor?.email"
            v-model:value="payload"
            @save="submitValue('email')"
            @cancel="resetValue('email')"
            @focus="currentActiveField = 'email'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            label="Phone"
            type="mask"
            mask="+1 (###) ### ####"
            placeholder="(###) ### ####"
            :value="vendor?.phone"
            v-model:value="payload"
            @save="submitValue('phone')"
            @cancel="resetValue('phone')"
            @focus="currentActiveField = 'phone'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            label="Fax"
            type="mask"
            mask="+1 (###) ### ####"
            placeholder="(###) ### ####"
            :value="vendor?.fax"
            v-model:value="payload"
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
            v-model:value="payload"
            placeholder=""
            @save="submitValue('din')"
            @cancel="resetValue('din')"
            @focus="currentActiveField = 'din'"
          />
        </div>
        <div class="col-span-4">
          <CustomInput
            label="Tax ID"
            type="mask"
            mask="### ## ####"
            placeholder="### ## ####"
            :value="vendor?.tax_id_number"
            v-model:value="payload"
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
            v-model:value="payload"
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
        <div class="flex justify-end">
          <p class="font-bold text-2xl">$10,193</p>
        </div>
      </div>
      <div class="flex-col justify-between align-end max-w-[220px]">
        <CustomInput
          type="select"
          label="Payment Terms"
          :options="paymentTermOptions"
          :value="vendor?.payment_terms"
          v-model:value="payload"
          placeholder=""
          @save="submitValue('payment_terms')"
          @cancel="resetValue('payment_terms')"
          @focus="currentActiveField = 'payment_terms'"
        />
        <div
          class="__invoice-buttons flex flex-col justify-center items-end min-w-max max-w-full mt-[58px]"
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
    class="duration-300 bg-white rounded-xl border-2 border-gray-200 mt-4 sticky top-[82px] left-0 z-50 w-full"
    :class="global.stuck[1] && '!bg-gray-50 !rounded-none shadow-lg shadow-[#00000011]'"
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
.__veil {
  width: calc(100vw - 370px);
}
.__section {
  @apply scroll-mt-[100px];
}
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
