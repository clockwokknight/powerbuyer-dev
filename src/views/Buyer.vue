<script setup>
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import axios from "axios";
import { ref, watch } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import { useIntersectionObserver } from "@vueuse/core";
import Tabs from "@/components/common/Tabs.vue";
import CommissionsPayed from "@/components/buyer/CommissionsPayed.vue";
import CommissionsPending from "@/components/buyer/CommissionsPending.vue";
import VehiclesSold from "@/components/buyer/VehiclesSold.vue";
import VehiclesPendingSale from "@/components/buyer/VehiclesPendingSale.vue";

const route = useRoute();

const routeParamId = ref(route.params?.id);
watch(
  () => route.params?.id,
  () => {
    routeParamId.value = route.params?.id;
  }
);

const { data: buyer, isLoading } = useQuery(["buyer", routeParamId], () =>
  axios.get(`/buyers/${routeParamId.value ?? 1}`).then((res) => res.data)
);

const currentActiveField = ref(null);

const form = ref({
  first_name: "",
  code: "",
  tax_id: "",
  payment_terms: "",
  commission_id: 1,
  buyer_type_id: 3,
  buyer_manager_id: 0,
  sales_license: "",
  address_one: "",
  address_two: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  phone: "",
  cell: "",
  fax: "",
  email: "",
  comments: "",
  access_level: "",
  registration_number: "",
  gmtv_location_id: 0,
  created_at: null,
});

const buyerTabs = ref([
  {
    title: "COMMISIONS PAYED",
    value: "#commissions-payed",
  },
  {
    title: "COMMISSIONS PENDING",
    value: "#commissions-pending",
  },
  {
    title: "VEHICLES SOLD",
    value: "#vehicles-sold",
  },
  {
    title: "VEHICLES PENDING SALE",
    value: "#vehicles-pending-sale",
  },
]);

watch(
  () => buyer.value,
  (newValue) => {
    if (newValue) form.value = { ...newValue };
  },
  { immediate: true }
);

function resetValue(key) {
  form.value = {
    ...form.value,
    [key]: buyer.value[key],
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

const buyerTab = ref(null);
const { stop } = useIntersectionObserver(
  buyerTab,
  ([e], observerElement) => {
    e.target.toggleAttribute("stuck", e.intersectionRatio < 1);
  },
  { threshold: [1] }
);

function handleTabClick(e) {
  window.location.hash = e;
}
</script>

<template>
  <div
    id="details"
    class="__section __vendor-card mt-4 grid grid-cols-12 rounded border-2 bg-white p-6 dark:border-0 dark:bg-[#25272A]"
  >
    <!-- left side -->
    <div class="__form col-span-12 flex flex-col justify-between md:col-span-8">
      <div class="__title">
        <h3 class="mb-2 translate-x-2 font-bold">Buyer</h3>
      </div>
      <div class="__form mt-8 grid grid-cols-12 gap-4">
        <!-- row 1 -->
        <div class="col-span-12 md:col-span-6">
          <CustomInput
            label="First Name"
            placeholder=""
            :value="form.first_name"
            :validate="['required']"
            @update:value="(val) => (form.first_name = val)"
            @save="submitValue('first_name')"
            @cancel="resetValue('first_name')"
            @focus="currentActiveField = 'first_name'"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <CustomInput
            label="Last Name"
            placeholder=""
            :value="form.last_name"
            @update:value="(val) => (form.last_name = val)"
            @save="submitValue('last_name')"
            @cancel="resetValue('last_name')"
            @focus="currentActiveField = 'last_name'"
          />
        </div>
        <!-- row 2 -->
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Code"
            placeholder=""
            :value="form.code"
            :validate="['required']"
            @update:value="(val) => (form.code = val)"
            @save="submitValue('code')"
            @cancel="resetValue('code')"
            @focus="currentActiveField = 'code'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            type="select"
            label="Tax ID"
            placeholder=""
            :options="statesList"
            :value="form.tax_id"
            :validate="['required']"
            @update:value="(val) => (form.tax_id = val)"
            @save="submitValue('tax_id')"
            @cancel="resetValue('tax_id')"
            @focus="currentActiveField = 'tax_id'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Payment Terms"
            :validate="['required']"
            :value="form.payment_terms"
            @update:value="(val) => (form.payment_terms = val)"
            @save="submitValue('payment_terms')"
            @cancel="resetValue('payment_terms')"
            @focus="currentActiveField = 'payment_terms'"
          />
        </div>
        <!-- row 3 -->
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Sales License"
            placeholder=""
            :value="form.sales_license"
            :validate="['required']"
            @update:value="(val) => (form.sales_license = val)"
            @save="submitValue('sales_license')"
            @cancel="resetValue('sales_license')"
            @focus="currentActiveField = 'sales_license'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            type="select"
            label="Tax ID"
            placeholder=""
            :options="statesList"
            :value="form.tax_id"
            :validate="['required']"
            @update:value="(val) => (form.tax_id = val)"
            @save="submitValue('tax_id')"
            @cancel="resetValue('tax_id')"
            @focus="currentActiveField = 'tax_id'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Payment Terms"
            :validate="['required']"
            :value="form.payment_terms"
            @update:value="(val) => (form.payment_terms = val)"
            @save="submitValue('payment_terms')"
            @cancel="resetValue('payment_terms')"
            @focus="currentActiveField = 'payment_terms'"
          />
        </div>
        <!-- row 4 -->
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
        <!-- row 5 -->
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
        <!-- row 6 -->
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
            label="Cell"
            :value="form.phone"
            :validate="['required', 'cell']"
            @update:value="(val) => (form.cell = val)"
            @save="submitValue('cell')"
            @cancel="resetValue('cell')"
            @focus="currentActiveField = 'cell'"
          />
        </div>
        <!-- row 7 -->
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
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Code"
            placeholder=""
            :value="form.code"
            :validate="['required']"
            @update:value="(val) => (form.code = val)"
            @save="submitValue('code')"
            @cancel="resetValue('code')"
            @focus="currentActiveField = 'code'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Registration Number"
            placeholder=""
            :value="form.registration_number"
            :validate="['required']"
            @update:value="(val) => (form.registration_number = val)"
            @save="submitValue('registration_number')"
            @cancel="resetValue('registration_number')"
            @focus="currentActiveField = 'registration_number'"
          />
        </div>
      </div>
    </div>
  </div>
  <Tabs
    id="__subtabs"
    type="basic"
    ref="buyerTab"
    class="sticky top-[-2px] left-0 z-40 mt-4 w-full rounded border-2 border-gray-200 bg-white duration-300 dark:border-0 dark:bg-[#25272A]"
    :items="buyerTabs"
    @click="handleTabClick"
  />

  <CommissionsPayed class="__section" />
  <CommissionsPending class="__section" />
  <VehiclesSold class="__section" />
  <VehiclesPendingSale class="__section" />
</template>
