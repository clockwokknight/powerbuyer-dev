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
import { getVendors } from "@/hooks/vendor";
import { useGlobalState } from "@/store/global";
import { useMutation, useQueryClient } from "vue-query";
import { useTabsViewStore } from "@/store/tabs";
import { useVendors } from "@/store/vendors";
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

const tabStore = useTabsViewStore();
const vendorStore = useVendors();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const listActive = ref(!global.isMobile);

// Showing All Vendors

const {
  data: vendors,
  isLoading: isVendorsLoading,
  hasNextPage: hasVendorNextPage,
  fetchNextPage: vendorFetchNextPage,
} = getVendors();

const addTab = (vendor) => {
  vendorStore.setLatest(vendor?.id);
  listActive.value = global.isMobile ? false : listActive.value;
  tabStore.addTab({ id: vendor?.id, name: vendor?.name });
};

const { data: vendorSearchResults, isFetching: isVendorSearchFetching } = useQuery(
  ["vehicleSearch", debouncedSearchText],
  ({ queryKey }) => {
    if (queryKey[1] === "") {
      return null;
    } else {
      return axios.get(`/vendors/search/${queryKey[1]}`).then((res) => {
        if (res.data?.debug) return [];
        return res.data;
      });
    }
  }
);

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

watchEffect(() => {
  if (route.params?.id) {
    log.yellow(route.params?.id);
    routeParamId.value = route.params?.id;
  } else {
    log.yellow("no param id - routing to home tab");
  }
});
</script>

<template>
  <div class="vendors flex w-full">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <div
      id="vendors-list"
      class="absolute z-[41] w-[275px]"
      :class="listActive ? 'open-vendor-list' : 'close-vendor-list'"
    >
      <!-- SearchList.vue / -->
      <aside
        class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-x-hidden bg-background_light dark:border-r-[1px] dark:border-dark_border dark:bg-background_dark"
      >
        <div
          class="sticky top-0 z-50 bg-foreground_light p-3 pb-0 dark:bg-foreground_dark"
        >
          <div class="mb-3 flex justify-between">
            <h1 class="text-xl font-bold uppercase">Inventory</h1>
            <div>
              <AddVendor />
            </div>
          </div>
          <div class="flex">
            <n-input
              style="backdrop-filter: blur(36px)"
              class="bg-[#f0f0f0] dark:bg-dark_border shadow-lg shadow-black/10"
              v-model:value.trim="searchText"
              clearable
              placeholder="Search..."
            />

            <!--div content="Filter" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                class="w-6 h-6 mt-1 text-gray-400 cursor-pointer dark:text-white hover:text-primary"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5.5 5h13a1 1 0 0 1 .5 1.5L14 12v7l-4-3v-4L5 6.5A1 1 0 0 1 5.5 5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div-->
          </div>
          <!-- Filter Component -->
        </div>
        <!-- Main Loop List -->
        <div>
          <div v-if="isVendorSearchFetching || isVendorsLoading">
            <div
              v-for="index in Array.from({ length: 10 })"
              :key="index"
              class="odd:background_light border-b px-4 py-4 even:bg-foreground_light dark:border-0 dark:odd:bg-background_dark dark:even:bg-foreground_dark"
            >
              <n-skeleton text :repeat="2" class="w-full" />
              <n-skeleton text class="w-[45%]" />
            </div>
          </div>
          <ul class="bg-foreground_light dark:bg-foreground_dark pt-[12px]">
            <template v-if="debouncedSearchText">
              <VendorList v-if="vendorSearchResults" :vendors="[]" @click:tab="addTab" />
            </template>

            <template v-else>
              <template
                v-for="(vendorPage, vendorPageIdx) in vendors?.pages"
                :key="vendorPageIdx"
              >
                <VendorList :vendors="[]" @click:tab="addTab" />
              </template>
              <button
                v-observe-visibility="
                  (isVisible) => (isVisible ? vendorFetchNextPage() : null)
                "
                v-if="hasVendorNextPage"
                class="grid w-full place-content-center p-4"
              >
                <n-spin size="small" />
              </button>
            </template>
          </ul>
        </div>
      </aside>
      <div
        id="mobile-slider"
        style="backdrop-filter: blur(36px)"
        :class="listActive ? '!w-[335px] ml-[-60px]' : '!bg-dark_border'"
        class="absolute w-[276px] duration-[500ms] h-[48px] flex flex-row justify-between bottom-0 left-0 bg-background_light/50 dark:bg-dark_border/50 bg-black items-center shadow-[0_-3px_11px_-5px_rgba(0,0,0,0.25)] px-4 cursor-pointer"
        @click="listActive = !listActive"
      >
        <div
          class="text-[10px] pl-16 duration-[500ms]"
          :class="!listActive ? 'opacity-0' : 'opacity-50'"
        >
          <b>{{ vendors?.pages[0].data.length }}</b> Vehicles
        </div>
        <div class="!bg-black">
          <div
            class="h-[48px] w-[60px] absolute left-0 bottom-0 flex center-content bg-[#111111]"
          >
            <svg
              class="absolute h-4 w-4 duration-[500ms]"
              :class="listActive ? 'rotate-0 ml-[0px]' : 'rotate-180 ml-[432px]'"
              viewBox="0 0 24 24"
            >
              <path
                d="M16.88 2.88a1.25 1.25 0 0 0-1.77 0L6.7 11.29a.996.996 0 0 0 0 1.41l8.41 8.41c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.54 12l7.35-7.35c.48-.49.48-1.28-.01-1.77z"
                fill="white"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Tabs App Content -->

    <section
      id="main-content"
      style="height: calc(100vh - 8px)"
      :class="
        listActive
          ? 'md:w-[calc(100vw-335px)] ml-[275px]'
          : 'md:w-[calc(100vw-60px)] ml-[0px]'
      "
      class="duration-[500ms] w-[calc(100vw-60px)] bg-background_light dark:bg-background_dark"
    >
      <PageTabs :class="global.stuck[0] && 'shadow-lg'" page-name="inventory" />
      <!-- Main Body Content-->
      <div id="main" class="h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden">
        <main id="container" class="min-h-full p-2 md:p-6">
          <Card class="pr-[100px]">
            <div id="details" class="mt-0 grid grid-cols-12 w-full">
              <!-- left side -->
              <div class="__form col-span-12 flex flex-col justify-between">
                <div class="flex">
                  <div class="mr-[24px] h-[260px] min-w-[260px] rounded-round">
                    <div class="relative">
                      <div
                        class="__vehicle-logo z-50 absolute m-[12px] h-[48px] w-[48px] bg-blue-700 center-content text-[9px] rounded-round"
                      >
                        logo
                      </div>
                    </div>
                    <n-carousel class="max-w-[260px] rounded-b-round" show-arrow>
                      <img
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
                    <hr
                      class="col-span-12 dark:border-dark_border border-background_light"
                    />
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

              <!--div
                class="col-span-12 mt-[24px] flex flex-col justify-between md:col-span-4 md:mt-0 md:w-auto md:items-end"
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
                    class="__invoice-buttons mt-4 flex min-w-max max-w-full flex-col items-end justify-center md:mt-20"
                  >
                    <n-button class="w-[220px]" @click="global.openDrawer('payments')">
                      <n-icon>
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </n-icon>
                      Add Payment
                    </n-button>
                    <n-button class="mt-4 w-[220px]" @click="active = true">
                      <n-icon>
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </n-icon>
                      Create Expense
                    </n-button>
                  </div>
                </div>
              </div-->
            </div>
          </Card>
          <Card class="h-[clac(80px-48px)] mt-[24px]">Tabs</Card>
          <Card class="h-[clac(80px-48px)] mt-[24px]">Steppers</Card>
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
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.close-vendor-list {
  animation: left-slide 0.5s forwards;
  margin-left: -275px;
}
.open-vendor-list {
  animation: right-slide 0.5s forwards;
  margin-left: 0px;
}
.close-vendor-list .slide-icon {
  transform: rotate(180deg);
}
.open-vendor-list .slide-icon {
  transform: rotate(0deg);
}
.vendor-list-open {
  margin-left: 0;
}
.vendor-list-closed {
  margin-left: -275px;
}
@keyframes left-slide {
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: -275px;
  }
}
@keyframes right-slide {
  0% {
    margin-left: -275px;
  }
  100% {
    margin-left: 0;
  }
}
.__labeled-data {
  @apply border-b-[2px] border-background_light dark:border-dark_border p-[6px] pl-[12px];
  span {
    @apply text-[9px] uppercase;
  }
}
.carousel-img {
  height: 260px;
  object-fit: cover;
  @apply rounded-round;
}

.custom-arrow {
  display: flex;
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.custom-arrow button {
  z-index: 50;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 12px;
  color: #fff;
  background-color: rgba(white, 0.2);
  border-width: 0;
  border-radius: 5px;
  backdrop-filter: blur(24px);
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.custom-arrow button:hover {
  background-color: rgba(white, 0.4);
}

.custom-arrow button:active {
  transform: scale(0.95);
  transform-origin: center;
}

.custom-dots {
  z-index: 50;
  display: flex;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 24px;
  left: 24px;
}

.custom-dots li {
  display: inline-block;
  width: 12px;
  height: 4px;
  margin: 0 3px;
  border-radius: 4px;
  background-color: rgba(white, 0.6);
  transition: width 0.3s, background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.custom-dots li.is-active {
  width: 40px;
  background: white;
}
</style>
