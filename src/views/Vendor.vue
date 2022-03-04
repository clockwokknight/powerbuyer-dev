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
import { useIntersectionObserver } from "@vueuse/core";

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
const { data: vendor, isLoading: isVendorLoading } =
  getVendorById(routeParamId);
const form = ref({ name: "", address_one: "" });
watch(
  () => vendor.value,
  (newValue) => {
    if (newValue) form.value = { ...newValue };
  }
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

watch(payload.value, (val) => {
  console.log("\npayload updated: ", payload.value);
});

function resetValue(key) {
  console.log("\n");
  console.log(`resetting value: ${payload.value} ==> ${vendor?.value[key]}`);
  payload.value = vendor?.value[key];
  form.value = {
    ...form.value,
    [key]: vendor.value[key],
  };
  console.log("payload: ", payload.value);
  currentActiveField.value = null;
}

function submitValue(key) {
  console.clear();
  console.log("submitting");
  mutateAsync({ [key]: form.value[key] })
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
    class="__section __vendor-card mt-4 grid grid-cols-12 rounded-xl border-2 bg-white p-6"
  >
    <!-- left side -->
    <div class="__form col-span-8 flex flex-col justify-between">
      <div class="__title">
        <h3 class="mb-2 translate-x-2 font-bold">VENDOR</h3>
        <CustomInput
          type="header"
          placeholder="Company Name"
          v-model:value="form.name"
          @save="submitValue('name')"
          @cancel="resetValue('name')"
          @focus="currentActiveField = 'name'"
        />
      </div>
      <div class="__form mt-8 grid grid-cols-12 gap-4">
        <!-- row 1 -->
        <div class="col-span-6">
          <CustomInput
            label="Address"
            placeholder=""
            type="input"
            :value="form.address_one"
            @update:value="(val) => (form.address_one = val)"
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

    <div class="col-span-4 flex flex-col items-end justify-between">
      <div class="__invoice-info">
        <div class="flex justify-end">
          <p class="text-sm font-bold">Open Invoices</p>
        </div>
        <div class="flex justify-end">
          <p class="text-2xl font-bold">$10,193</p>
        </div>
      </div>
      <div class="align-end max-w-[220px] flex-col justify-between">
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
          class="__invoice-buttons mt-[58px] flex min-w-max max-w-full flex-col items-end justify-center"
        >
          <button
            class="__invoice-button"
            @click="global.openDrawer('payments')"
          >
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
    class="sticky top-[-2px] left-0 z-50 mt-4 w-full rounded-xl border-2 border-gray-200 bg-white duration-300"
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
  @apply rounded-none border-none bg-lightergray;
}
.__veil {
  width: calc(100vw - 370px);
}
.__section {
  @apply scroll-mt-[100px];
}
.__invoice-button {
  transition-timing-function: ease;
  @apply mt-[14px] flex h-10 w-full items-center justify-center rounded-md border-[1px] border-lightgray px-3 text-center duration-[200ms];
  &:hover {
    @apply border-secondary text-secondary;
  }
  svg {
    transition-timing-function: $overshoot;
    @apply mr-2 h-full duration-[400ms];
  }
}
</style>
