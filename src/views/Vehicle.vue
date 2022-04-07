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
import { useTabsViewStore } from "@/store/vehicleTabs";
import { useVehicles as useVendors } from "@/store/vehicles";
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

const { data: vendor, isLoading: isVendorLoading } = fetchById(
  "/deals/search_by_vin",
  routeParamId
);

const vendorData = ref({});

const form = ref({
  vin: null,
  lane: null,
  grade: null,
  year: null,
  make: null,
  model: null,
  trim: null,
  body: null,
  ext_color: null,
  int_color: null,
  miles: null,
  notes: null,
  recon: null,
});

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

watch(
  () => vendor.value,
  (newValue) => {
    if (newValue) {
      form.value = { ...newValue };
      vendorData.value = { ...newValue };
      Object.entries(newValue).forEach((kv) => {
        // sterilizing vehicle data to fix non-update on cancel
        if (kv[1] === "") vendorData.value[kv[0]] = null;
      });
    }
  },
  { immediate: true }
);

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
  <main id="container" class="min-h-full p-2 md:p-6">
    <Card class="p-[0px]">
      <div class="mt-0 grid grid-cols-12 w-full flex">
        <!-- left side -->
        <div class="__form col-span-12 flex flex-col justify-between w-full">
          <div class="flex">
            <div class="mr-[24px] h-[260px] min-w-[260px] rounded-round">
              <div class="relative">
                <div
                  class="__vehicle-logo z-50 absolute my-[0px] mx-[12px] w-[80px] bg-transparent center-content text-[9px] rounded-round"
                >
                  <!--img
                    src="https://gmtvinventory.com/storage/logos/dodge.png"
                    alt="Dodge Logo"
                  /-->
                </div>
              </div>
              <n-carousel class="max-w-[260px] rounded-b-round" show-arrow>
                <!--img
                  class="carousel-img object-cover h-full"
                  src="https://storage.googleapis.com/gmtv-inventory/3C4PDDEG5GT243378/152/20220114235135-940f543b-15c9-41c0-a3aa-7de27296a2a5.jpg"
                />
                <img
                  class="carousel-img object-cover h-full"
                  src="https://storage.googleapis.com/gmtv-inventory/3C4PDDEG5GT243378/152/20220114235134-f52d1048-199d-42e2-ae7e-b147c7348281.jpg"
                />
                <img
                  class="carousel-img object-cover h-full"
                  src="https://storage.googleapis.com/gmtv-inventory/3C4PDDEG5GT243378/152/20220114235134-b2492432-999d-4309-b6ee-4c41f82c696a.jpg"
                />
                <img
                  class="carousel-img object-cover h-full"
                  src="https://storage.googleapis.com/gmtv-inventory/3C4PDDEG5GT243378/152/20220114235135-5800eaf6-bf33-4347-9f90-a08cdf12cec2.jpg"
                /-->
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
                <template #dots="{ total, currentIndex, to }">
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
              <div class="relative">
                <div
                  style="background: linear-gradient(transparent, black)"
                  class="w-full h-[80px] absolute bottom-0"
                ></div>
              </div>
            </div>

            <div class="__form grid grid-cols-12 gap-4">
              <!-- header info -->
              <div class="col-span-12 md:col-span-6">
                <CustomInput
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
        </div>

        <!-- right side -->

        <div class="w-[200px] flex mt-[24px]">
          <div class="flex items-center mr-[24px]">
            <div
              class="rounded-full bg-green-400 h-[10px] w-[10px] border-white border-1 mx-[8px]"
            ></div>
            <span>Carfax</span>
          </div>
          <div class="flex items-center mr-[24px]">
            <div
              class="rounded-full bg-green-400 h-[10px] w-[10px] border-white border-1 mx-[8px]"
            ></div>
            <span>AutoCheck</span>
          </div>
          <div class="flex items-center mr-[24px]">
            <div
              class="rounded-full bg-green-400 h-[10px] w-[10px] border-white border-1 mx-[8px]"
            ></div>
            <span>Light</span>
          </div>
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
        <n-timeline-item type="success" content="Deal Approved">
          <template #icon>
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
          </template>
        </n-timeline-item>
        <n-timeline-item type="success" content="Deal Punched">
          <template #icon>
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
          </template>
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

<style lang="scss" scoped></style>
