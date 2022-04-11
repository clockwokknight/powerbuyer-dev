<script setup>
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import axios from "axios";
import { computed, ref, watch } from "vue";
// import LenderContacts from "@/components/lender/LenderContacts.vue";
import CustomInput from "@/components/common/CustomInput.vue";
import Tabs from "@/components/common/Tabs.vue";
import { getStates } from "@/hooks/common_query";
import { useIntersectionObserver } from "@vueuse/core";

const route = useRoute();

const routeParamId = ref(route.params?.id);
watch(
  () => route.params,
  (toParams) => {
    if (toParams?.id) routeParamId.value = toParams?.id;
  },
  {
    immediate: true,
  }
);

const { data: lender, isLoading } = useQuery(
  ["lender", routeParamId],
  ({ queryKey }) => axios.get(`/lenders/${queryKey[1]}`).then((res) => res.data)
);

const { data: statesList } = getStates();

const form = ref({
  company: "",
  address_one: "",
  address_two: "",
  city: "",
  state: null,
  zipcode: "",
  country: "",
  phone: "",
  email: "",
  active: null,
});

// const lenderTabs = ref([
//   {
//     title: "CONTACTS",
//     value: "#lender-contacts",
//   },
// ]);

watch(
  () => lender.value,
  (newValue) => {
    if (newValue) form.value = { ...newValue };
  },
  { immediate: true }
);

const lenderTab = ref(null);
const { stop } = useIntersectionObserver(
  lenderTab,
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
    class="__section __lender-card __details mt-0 grid grid-cols-12 rounded-round bg-foreground_light p-6 dark:bg-foreground_dark"
  >
    <!-- left side -->
    <div
      class="__form col-span-12 flex flex-col justify-between md:col-span-12"
    >
      <div class="__title col-span-6">
        <h3 class="mb-2 translate-x-2 font-bold uppercase opacity-[0.44]">
          Lender
        </h3>
        <CustomInput
          type="header"
          placeholder="Company"
          :value="form.company"
          @update:value="(val) => (form.company = val)"
          @save="submitValue('company')"
          @cancel="resetValue('company')"
          @focus="currentActiveField = 'company'"
        />
      </div>
      <div class="__form mt-8 grid grid-cols-12 gap-4">
        <!-- row 1 -->
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Address One"
            placeholder=""
            :validate="['required']"
            :value="form.address_one"
            @update:value="(val) => (form.address_one = val)"
            @save="submitValue('address_one')"
            @cancel="resetValue('address_one')"
            @focus="currentActiveField = 'address_one'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Address Two"
            placeholder=""
            :validate="['required']"
            :value="form.address_two"
            @update:value="(val) => (form.address_two = val)"
            @save="submitValue('address_two')"
            @cancel="resetValue('address_two')"
            @focus="currentActiveField = 'address_two'"
          />
        </div>
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
            :value="form.zipcode"
            @update:value="(val) => (form.zipcode = val)"
            @save="submitValue('zipcode')"
            @cancel="resetValue('zipcode')"
            @focus="currentActiveField = 'zipcode'"
          />
        </div>

        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Country"
            placeholder=""
            :value="form.country"
            :validate="['required']"
            @update:value="(val) => (form.country = val)"
            @save="submitValue('country')"
            @cancel="resetValue('country')"
            @focus="currentActiveField = 'country'"
          />
        </div>
        <div class="col-span-6 md:col-span-6">
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
        <div class="col-span-6 md:col-span-6">
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
      </div>
    </div>
  </div>
  <!--
  <Tabs
    id="__subtabs"
    type="basic"
    ref="lenderTab"
    class="sticky top-[-2px] left-0 z-40 mt-[24px] w-full rounded-round bg-foreground_light duration-300 dark:bg-foreground_dark"
    :items="lenderTabs"
  />

  <LenderContacts id="lender-contacnts" class="__section" /> -->
</template>

<style lang="scss">
#__subtabs[stuck],
.__tabs[stuck] {
  @apply rounded-none bg-[#F4F6F8] shadow-lg shadow-[#00000011] dark:bg-dark_border;
}
.__veil {
  width: calc(100vw - 370px);
}
.__section {
  @apply scroll-mt-[100px] rounded-md;
}
</style>
