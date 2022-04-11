<script setup>
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import axios from "axios";
import { computed, ref, watch } from "vue";
import DealerContacts from "@/components/dealer/DealerContacts.vue";
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

const { data: dealer, isLoading } = useQuery(
  ["dealer", routeParamId],
  ({ queryKey }) => axios.get(`/dealers/${queryKey[1]}`).then((res) => res.data)
);

const { data: statesList } = getStates();

const form = ref({
  name: "",
  din: "",
  dealer_type: "",
  makes: "",
  category: "",
  type: "",
  address_one: "",
  address_two: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  phone: "",
  fax: "",
  email: "",
  auction_access_number: "",
  welcome_task: 0,
  notes: "",
});

const dealerTabs = ref([
  {
    title: "CONTACTS",
    value: "#dealer-contacts",
  },
]);

watch(
  () => dealer.value,
  (newValue) => {
    if (newValue) form.value = { ...newValue };
  },
  { immediate: true }
);

const dealerTab = ref(null);
const { stop } = useIntersectionObserver(
  dealerTab,
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
    class="__section __dealer-card __details mt-0 grid grid-cols-12 rounded-round bg-foreground_light p-6 dark:bg-foreground_dark"
  >
    <!-- left side -->
    <div
      class="__form col-span-12 flex flex-col justify-between md:col-span-12"
    >
      <div class="__title col-span-6">
        <h3 class="mb-2 translate-x-2 font-bold uppercase opacity-[0.44]">
          Dealer
        </h3>
        <CustomInput
          type="header"
          placeholder="Name"
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
            label="DIN"
            placeholder=""
            :value="form.din"
            :validate="['required']"
            @update:value="(val) => (form.din = val)"
            @save="submitValue('din')"
            @cancel="resetValue('din')"
            @focus="currentActiveField = 'din'"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <CustomInput
            label="Dealer Type"
            placeholder=""
            :value="form.dealer_type"
            @update:value="(val) => (form.dealer_type = val)"
            @save="submitValue('dealer_type')"
            @cancel="resetValue('dealer_type')"
            @focus="currentActiveField = 'dealer_type'"
          />
        </div>
        <!-- row 2 -->
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="City"
            placeholder=""
            :value="form.makes"
            :validate="['required']"
            @update:value="(val) => (form.makes = val)"
            @save="submitValue('makes')"
            @cancel="resetValue('makes')"
            @focus="currentActiveField = 'makes'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Category"
            placeholder="#####-####"
            mask="#####-####"
            :validate="['required']"
            :value="form.category"
            @update:value="(val) => (form.category = val)"
            @save="submitValue('category')"
            @cancel="resetValue('category')"
            @focus="currentActiveField = 'category'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Type"
            placeholder="#####-####"
            mask="#####-####"
            :validate="['required']"
            :value="form.Type"
            @update:value="(val) => (form.Type = val)"
            @save="submitValue('Type')"
            @cancel="resetValue('Type')"
            @focus="currentActiveField = 'Type'"
          />
        </div>
        <!-- row 3 -->
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
            :value="form.zip"
            @update:value="(val) => (form.zip = val)"
            @save="submitValue('zip')"
            @cancel="resetValue('zip')"
            @focus="currentActiveField = 'zip'"
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
            label="Auction Access number"
            placeholder=""
            :value="form.code"
            :validate="['required']"
            @update:value="(val) => (form.auction_access_number = val)"
            @save="submitValue('auction_access_number')"
            @cancel="resetValue('auction_access_number')"
            @focus="currentActiveField = 'auction_access_number'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Welcome Task"
            placeholder=""
            :value="form.welcome_task"
            :validate="['required']"
            @update:value="(val) => (form.welcome_task = val)"
            @save="submitValue('welcome_task')"
            @cancel="resetValue('welcome_task')"
            @focus="currentActiveField = 'welcome_task'"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Notes"
            placeholder=""
            :value="form.notes"
            :validate="['required']"
            @update:value="(val) => (form.notes = val)"
            @save="submitValue('notes')"
            @cancel="resetValue('notes')"
            @focus="currentActiveField = 'notes'"
          />
        </div>
      </div>
    </div>
  </div>

  <Tabs
    id="__subtabs"
    type="basic"
    ref="dealerTab"
    class="sticky top-[-2px] left-0 z-40 mt-[24px] w-full rounded-round bg-foreground_light duration-300 dark:bg-foreground_dark"
    :items="dealerTabs"
  />

  <DealerContacts id="dealer-contacnts" class="__section" />
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
