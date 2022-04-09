<script setup>
import axios from "axios";
import { fetchPaginatedData } from "@/hooks";
import { utils, log } from "@/lib/utils";

import { ref, watch } from "vue";
import { useQuery } from "vue-query";
import { useDebounce } from "@vueuse/core";
import { useRoute } from "vue-router";

import { useGlobalState } from "@/store/global";
import { useTabsViewStore } from "@/store/tabs";

import AddVendor from "@/components/vendor/AddVendor.vue";
import PageTabs from "@/components/PageTabs.vue";
import VendorList from "@/components/vehicle/VehicleList.vue";
import Tabs from "@/components/common/Tabs.vue";
import Card from "@/components/_refactor/Card.vue";
import CustomInput from "@/components/common/CustomInput.vue";

const tabStore = useTabsViewStore();
const global = useGlobalState();

const route = useRoute();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const listActive = ref(!global.isMobile);

const {
  data: vendors,
  isLoading: isVendorsLoading,
  hasNextPage: hasVendorNextPage,
  fetchNextPage: vendorFetchNextPage,
} = fetchPaginatedData("/deals");

const addTab = (vendor) => {
  listActive.value = global.isMobile ? false : listActive.value;
  tabStore.addTab({ id: vendor?.vin, name: vendor?.vin });
};

const { data: vendorSearchResults, isFetching: isVendorSearchFetching } = useQuery(
  ["vehicleSearch", debouncedSearchText],
  ({ queryKey }) => {
    if (queryKey[1] === "") {
      return null;
    } else {
      return axios.get(`/deals/search_by_vin/${queryKey[1]}`).then((res) => {
        console.clear();
        console.log("fetching data... ", res.data);
        return res.data;
      });
    }
  }
);

function toggleListSlide() {
  listActive.value = !listActive.value;
}

function filterVehicles(data) {
  return data.filter(
    (v) =>
      v.vehicle?.vehicle_make?.vehicle_make_year &&
      v.vehicle?.vehicle_make?.description &&
      v.vehicle?.exterior_color?.color
  );
}

watch(
  () => listActive.value,
  (val) => {
    global.setListActive(val, "vehicle");
  }
);
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
        class="pageItemsList relative h-[calc(100vh-48px)] min-w-[275px] max-w-[275px] overflow-x-hidden bg-background_light dark:border-r-[1px] dark:border-dark_border dark:bg-background_dark"
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
              <VendorList
                v-if="vendorSearchResults"
                :vendors="filterVehicles(vendorSearchResults)"
                @click:tab="addTab"
              />
            </template>

            <template v-else>
              <template
                v-for="(vendorPage, vendorPageIdx) in vendors?.pages"
                :key="vendorPageIdx"
              >
                <VendorList
                  :vendors="filterVehicles(vendorPage.data)"
                  @click:tab="addTab"
                />
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
        class="absolute bottom-[-48px] w-[276px] duration-[500ms] h-[48px] flex flex-row justify-between bottom-0 left-0 bg-background_light/50 dark:bg-dark_border/50 bg-black items-center shadow-[0_-3px_11px_-5px_rgba(0,0,0,0.25)] px-4 cursor-pointer"
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
      <PageTabs
        :class="global?.inventory?.stuck[0] && 'shadow-lg'"
        :hasHome="true"
        pageName="inventory"
      />
      <!-- Main Body Content-->
      <div id="main" class="h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden">
        <router-view />
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
