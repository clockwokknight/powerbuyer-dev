<script setup>
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";
import axios from "axios";
import { computed, ref, watch } from "vue";
import { getAuctionById } from "@/hooks/auctions";
import CustomInput from "@/components/common/CustomInput.vue";
import { useIntersectionObserver } from "@vueuse/core";
import Tabs from "@/components/common/Tabs.vue";
import VehiclesAtAuction from "@/components/auction/VehiclesAtAuction.vue";
import VehiclesSold from "@/components/auction/VehiclesSold.vue";

const route = useRoute();

const routeParamId = ref(route.params?.id);
watch(
  () => route.params,
  (toParams, previousParams) => {
    if (toParams?.id) routeParamId.value = toParams?.id;
  },
  {
    immediate: true,
  }
);
const { data: auction, isLoading: isAuctionLoading } =
  getAuctionById(routeParamId);

const currentActiveField = ref(null);

const form = ref({
  auction_company: "",
  address_one: "",
  address_two: "",
  city: "",
  state: "",
  zip: "",
  email: "",
  phone: "",
  fax: "",
  din: "",
  code: "",
});

const auctionTabs = ref([
  {
    title: "VEHICLES AT AUCTION",
    value: "#vehicles-at-auction",
  },
  {
    title: "VEHICLES SOLD",
    value: "#vehicles-sold",
  },
]);

watch(
  () => auction.value,
  (newValue) => {
    if (newValue) form.value = { ...newValue };
  },
  { immediate: true }
);

function resetValue(key) {
  form.value = {
    ...form.value,
    [key]: auction.value[key],
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

const auctionTab = ref(null);
const { stop } = useIntersectionObserver(
  auctionTab,
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
    class="__section __vendor-card __details bg-foreground_light dark:bg-foreground_dark mt-0 grid grid-cols-12 rounded-round p-6"
  >
    <!-- left side -->
    <div class="__form col-span-12 flex flex-col justify-between md:col-span-12">
      <div class="__title">
        <h3 class="mb-2 translate-x-2 font-bold uppercase opacity-[0.44]">Auction</h3>
        <CustomInput
          type="header"
          placeholder="Company Name"
          :value="form.auction_company"
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
      </div>
    </div>
  </div>

  <Tabs
    id="__subtabs"
    type="basic"
    ref="auctionTab"
    class="bg-foreground_light dark:bg-foreground_dark sticky top-[-2px] left-0 z-40 mt-[24px] w-full rounded-round duration-300"
    :items="auctionTabs"
    @click="handleTabClick"
  />

  <VehiclesAtAuction class="__section" />
  <VehiclesSold class="__section" />
  <Suspense>
    <template #default><VendorContacts class="__section" /></template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>
<style lang="scss">
#__subtabs[stuck],
.__tabs[stuck] {
  @apply dark:bg-dark_border rounded-none bg-[#F4F6F8] shadow-lg shadow-[#00000011];
}
.__veil {
  width: calc(100vw - 370px);
}
.__section {
  @apply scroll-mt-[100px] rounded-md;
}
</style>
