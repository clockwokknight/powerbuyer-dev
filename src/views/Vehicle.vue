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
import { useQuery } from "vue-query";
import { useDebounce } from "@vueuse/core";
import { fetchPaginatedData, fetchById } from "@/hooks";
import { useGlobalState } from "@/store/global";
import { useMutation, useQueryClient } from "vue-query";
import { log, utils } from "@/lib/utils";
import { useMessage } from "naive-ui";

import axios from "axios";

import AddVendor from "@/components/vendor/AddVendor.vue";
import PageTabs from "@/components/PageTabs.vue";
import VendorList from "@/components/vendor/VendorList.vue";
import Tabs from "@/components/common/Tabs.vue";
import Card from "@/components/_refactor/Card.vue";
import CustomInput from "@/components/common/CustomInput.vue";

const instance = getCurrentInstance();

const global = useGlobalState();
const route = useRoute();
const router = useRouter();
const message = useMessage();
const queryClient = useQueryClient();

const currentActiveField = ref(null);
const routeParamId = ref(route.params?.id);

const tabs = ref([
  {
    title: "OVERVIEW",
    value: "#overview",
  },
  {
    title: "FUNDING",
    value: "#funding",
  },
  {
    title: "LOGISTICS",
    value: "#logistics",
  },
  {
    title: "TITLING",
    value: "#titling",
  },
  {
    title: "ACCOUNTING",
    value: "#accounting",
  },
  {
    title: "HISTORY",
    value: "#history",
  },
  {
    title: "REPORTS",
    value: "#reports",
  },
]);

const { data: vendor } = fetchById("/deals", routeParamId);

//const { data: images } = fetchById("/images/deal", routeParamId);

//const { data: logo } = fetchById("/images/deal/logo", vendor?.value?.id);

const vendorData = ref({});

const form = ref({
  vin: null,
  lane: null,
  grade: null,
  year: null,
  make: null,
  model: null, // Numerical ID?
  trim: null, // Numerical ID?
  body: null, //
  ext_color: null,
  int_color: null,
  miles: null,
  notes: null,
  recon: null,
});

watch(
  () => vendor.value,
  (val) => {
    if (val) {
      const incomingData = {
        ...val,
        lane: val.lane_number, // Number
        year: val.vehicle?.vehicle_year, // Number
        make: val.vehicle?.vehicle_make.name, // String
        model: val.vehicle?.vehicle_model_id, // Number <fetch model name string>
        trim: val.vehicle?.vehicle_model_trim_id, // Number <fetch trim string>
        body: val.vehicle?.body, // String
        ext_color: val.vehicle?.exterior_color?.color, // String
        int_color: val.vehicle?.interior_color?.color, // String
        miles: val.mileage, // Number
        recon: val.recon_notes, // String
      };
      form.value = incomingData;
      vendorData.value = incomingData;
      //log.green("vehicle.value: ", val);
      Object.entries(val).forEach((kv) => {
        if (kv[1] === "") vendorData.value[kv[0]] = null; // setting blanks as null
      });
      log.cyan("vendorData.value: ", vendorData.value);
      //log.blue("form.value: ", form.value);
    }
  },
  { immediate: true }
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

/*watch(
  () => images.value,
  (val) => {
    log.blue("images.value: ", val);
  }
);*/

/*watch(
  () => logo?.value,
  (val) => {
    console.clear();
    console.log("LOGO; ", val);
  }
);*/

function toggleListSlide() {
  listActive.value = !listActive.value;
}

function resetValue(key) {
  nextTick();
  log.yellow(`resetting value to ${vendorData.value[key]}`);
  form.value = {
    ...form.value,
    [key]: vendorData.value[key],
  };
  currentActiveField.value = null;
}

function submitValue(key) {
  mutateAsync({
    [key]: key === "phone" ? utils.parsePhoneNumber(form.value[key]) : form.value[key],
  })
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
</script>

<template>
  <main id="container" class="p-2 md:p-6">
    <Card class="p-[0px] pb-[24px]">
      <div class="mt-0 grid grid-cols-12 w-full">
        <!-- left side -->
        <div class="__form col-span-12 flex flex-col justify-between w-full">
          <div class="flex">
            <!-- image carousel container -->
            <div class="mr-[24px] h-[160px] min-w-[160px]">
              <div class="relative">
                <div
                  class="__vehicle-logo z-50 absolute my-[0px] mx-[12px] w-[80px] bg-transparent center-content text-[9px] rounded-round"
                >
                  <img
                    src="https://gmtvinventory.com/storage/logos/dodge.png"
                    alt="Dodge Logo"
                  />
                </div>
              </div>
              <n-carousel class="max-w-[160px] rounded-round" show-arrow>
                <img
                  v-if="!images || images.length == 0"
                  class="carousel-img object-cover rounded-round h-full z-[-1]"
                  src="../assets/broken_image.svg"
                />
                <img
                  v-if="!images || images.length == 0"
                  class="carousel-img object-cover rounded-round h-full z-[-1]"
                  src="../assets/broken_image.svg"
                />
                <img
                  v-if="!images || images.length == 0"
                  class="carousel-img object-cover rounded-round h-full z-[-1]"
                  src="../assets/broken_image.svg"
                />
                <img
                  v-if="!images || images.length == 0"
                  class="carousel-img object-cover rounded-round h-full z-[-1]"
                  src="../assets/broken_image.svg"
                />
                <img
                  v-show="images && images.length > 0"
                  class="carousel-img object-cover rounded-round h-full z-[-1]"
                  v-for="(image, index) in images"
                  :key="index"
                  :src="image.storage"
                />
                <template #arrow="{ prev, next }">
                  <div class="custom-arrow">
                    <button type="button" class="curtom-arrow--left" @click="prev">
                      <n-icon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M16.88 2.88a1.25 1.25 0 0 0-1.77 0L6.7 11.29a.996.996 0 0 0 0 1.41l8.41 8.41c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.54 12l7.35-7.35c.48-.49.48-1.28-.01-1.77z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </n-icon>
                    </button>
                    <button type="button" class="curtom-arrow--right" @click="next">
                      <n-icon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31a.996.996 0 0 0 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </n-icon>
                    </button>
                  </div>
                </template>
                <template #dots="{ total, currentIndex, to }" class="z-[9999] bg-red-400">
                  <ul class="custom-dots">
                    <li
                      v-for="index of total"
                      :key="index"
                      :class="{ ['is-active']: currentIndex === index - 1 }"
                      @click="to(index - 1)"
                    />
                  </ul>
                </template>
              </n-carousel>
              <div v-if="images && images.length > 0" class="relative">
                <div
                  style="background: linear-gradient(transparent, black)"
                  class="w-full h-[80px] absolute bottom-0"
                ></div>
              </div>
              <!-- lights -->
              <div class="__lights">
                <div class="__lights-item">
                  <div class="__lights-icon"></div>
                  <span>Carfax</span>
                </div>
                <div class="__lights-item">
                  <div class="__lights-icon"></div>
                  <span>AutoCheck</span>
                </div>
                <div class="__lights-item">
                  <div class="__lights-icon"></div>
                  <span>Light</span>
                </div>
              </div>
            </div>
            <!-- vehicle information -->
            <div class="__form grid grid-cols-12 gap-4">
              <!-- header info -->
              <div class="col-span-12 md:col-span-6">
                <CustomInput
                  class="pointer-events-none"
                  label="Vin"
                  placeholder="3FADP4AJ2EM100154"
                  :value="form.vin"
                  @update:value="(val) => (form.vin = val)"
                  @save="submitValue('vin')"
                  @cancel="resetValue('vin')"
                  @focus="currentActiveField = 'vin'"
                />
              </div>
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Lane"
                  placeholder="20"
                  :value="form.lane"
                  @update:value="(val) => (form.lane = val)"
                  @save="submitValue('lane')"
                  @cancel="resetValue('lane')"
                  @focus="currentActiveField = 'lane'"
                />
              </div>
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Grade"
                  placeholder="4"
                  :value="form.grade"
                  @update:value="(val) => (form.grade = val)"
                  @save="submitValue('grade')"
                  @cancel="resetValue('grade')"
                  @focus="currentActiveField = 'grade'"
                />
              </div>
              <!-- horizontal divider -->
              <hr class="col-span-12 dark:border-dark_border border-background_light" />
              <!-- row 1 -->
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Year"
                  placeholder=""
                  :value="form.year"
                  @update:value="(val) => (form.year = val)"
                  @save="submitValue('year')"
                  @cancel="resetValue('year')"
                  @focus="currentActiveField = 'year'"
                />
              </div>
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Make"
                  placeholder=""
                  :value="form.make"
                  @update:value="(val) => (form.make = val)"
                  @save="submitValue('make')"
                  @cancel="resetValue('make')"
                  @focus="currentActiveField = 'make'"
                />
              </div>
              <!-- row 2 -->
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Model"
                  placeholder=""
                  :value="form.model"
                  @update:value="(val) => (form.model = val)"
                  @save="submitValue('model')"
                  @cancel="resetValue('model')"
                  @focus="currentActiveField = 'model'"
                />
              </div>
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Trim"
                  placeholder=""
                  :value="form.trim"
                  @update:value="(val) => (form.trim = val)"
                  @save="submitValue('trim')"
                  @cancel="resetValue('trim')"
                  @focus="currentActiveField = 'trim'"
                />
              </div>
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Body"
                  :value="form.body"
                  @update:value="(val) => (form.body = val)"
                  @save="submitValue('body')"
                  @cancel="resetValue('body')"
                  @focus="currentActiveField = 'body'"
                />
              </div>
              <!-- row 3 -->
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Ext. Color"
                  placeholder=""
                  :value="form.ext_color"
                  @update:value="(val) => (form.ext_color = val)"
                  @save="submitValue('ext_color')"
                  @cancel="resetValue('ext_color')"
                  @focus="currentActiveField = 'ext_color'"
                />
              </div>
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Int. Color"
                  placeholder=""
                  :value="form.int_color"
                  @update:value="(val) => (form.int_color = val)"
                  @save="submitValue('init_color')"
                  @cancel="resetValue('int_color')"
                  @focus="currentActiveField = 'int_color'"
                />
              </div>
              <div class="col-span-12 md:col-span-3">
                <CustomInput
                  class="pointer-events-none"
                  label="Miles"
                  placeholder=""
                  :value="form.miles"
                  @update:value="(val) => (form.miles = val)"
                  @save="submitValue('miles')"
                  @cancel="resetValue('miles')"
                  @focus="currentActiveField = 'miles'"
                />
              </div>
              <!-- row 4 -->
              <div class="col-span-12 md:col-span-6">
                <CustomInput
                  class="pointer-events-none"
                  label="Notes"
                  placeholder=""
                  :value="form.notes"
                  @update:value="(val) => (form.notes = val)"
                  @save="submitValue('notes')"
                  @cancel="resetValue('notes')"
                  @focus="currentActiveField = 'notes'"
                />
              </div>
              <div class="col-span-12 md:col-span-6">
                <CustomInput
                  class="pointer-events-none"
                  label="Recon"
                  placeholder=""
                  :value="form.recon"
                  @update:value="(val) => (form.recon = val)"
                  @save="submitValue('recon')"
                  @cancel="resetValue('recon')"
                  @focus="currentActiveField = 'recon'"
                />
              </div>
            </div>
          </div>
          <!-- right side -->
        </div>
      </div>
    </Card>
    <Tabs
      id="__subtabs"
      type="basic"
      ref="vendorTab"
      class="bg-foreground_light dark:bg-foreground_dark sticky top-[-2px] left-0 z-40 mt-[24px] w-full rounded-round duration-300"
      :items="tabs"
    />
    <Card class="h-[clac(80px-48px)] mt-[24px]">
      <n-timeline horizontal>
        <n-timeline-item content="Deal Approved">
          <!--template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 1024 1024"
            >
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8l157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
                fill="currentColor"
              ></path>
            </svg>
          </template-->
        </n-timeline-item>
        <n-timeline-item content="Deal Punched">
          <!--template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 1024 1024"
            >
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8l157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
                fill="currentColor"
              ></path>
            </svg>
          </template-->
        </n-timeline-item>
        <n-timeline-item line-type="dashed" content="Lean Paid" />
        <n-timeline-item line-type="dashed" content="Owner(s) Paid" />
        <n-timeline-item line-type="dashed" content="Title in Hand" />
        <n-timeline-item line-type="dashed" content="Vehicle at Auction" />
        <n-timeline-item line-type="dashed" content="Vehicle Sold" />
      </n-timeline>
    </Card>
    <div class="grid grid-cols-2 gap-[24px] w-full mt-[24px]">
      <Card class="h-[420px]"></Card>
      <Card class="h-[420px]"></Card>
    </div>
    <Card class="mt-[24px] h-[400px]">Manheim Details</Card>
    <div class="grid grid-cols-2 gap-[24px] w-full mt-[24px]">
      <Card class="h-[420px]"></Card>
      <Card class="h-[420px]"></Card>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.__lights {
  margin-top: 12px;
  padding-bottom: 24px;
  width: 100%;
}
.__lights-item {
  width: 100%;
  margin-top: 4px;
  @apply flex items-center w-full;
}
.__lights-icon {
  width: 10px !important;
  height: 10px !important;
  @apply rounded-full bg-green-400 border-[#ffffff21] border-[1px] mr-[8px];
}
</style>
