<script setup>
import { useQuery } from "vue-query";
import axios from "axios";
import { useDebounce } from "@vueuse/core";
import { ref, watch } from "vue";
import { getVendors } from "@/hooks/vendor";
import { useGlobalState } from "@/store/global";
import { useTabsViewStore } from "@/store/tabs";
import { useVendors } from "@/store/vendors";
import AddVendor from "@/components/vendor/AddVendor.vue";
import PageTabs from "@/components/PageTabs.vue";
import VendorList from "@/components/vendor/VendorList.vue";

const tabStore = useTabsViewStore();
const global = useGlobalState();
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
  vendorStore.SET_LATEST(vendor?.id);
  listActive.value = global.isMobile ? false : listActive.value;
  tabStore.addTab({ id: vendor?.id, name: vendor?.name });
};

// Vendor Search Result

const { data: vendorSearchResults, isFetching: isVendorSearchFetching } =
  useQuery(["vendorSearch", debouncedSearchText], ({ queryKey }) => {
    if (queryKey[1] === "") return null;
    else
      return axios.get(`/vendors/search/${queryKey[1]}`).then((res) => {
        if (res.data?.debug) {
          return [];
        }
        return res.data;
      });
  });

function toggleListSlide() {
  listActive.value = !listActive.value;
}

watch(
  () => listActive.value,
  (val) => {
    global.setListActive(val, "vendor");
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
        class="pageItemsList bg-background_light dark:border-dark_border dark:bg-background_dark relative h-screen min-w-[275px] max-w-[275px] overflow-x-hidden dark:border-r-[1px]"
      >
        <div
          class="bg-foreground_light dark:bg-foreground_dark sticky top-0 z-50 p-3 pb-0"
        >
          <div class="mb-3 flex justify-between">
            <h1 class="text-xl font-bold uppercase">Vendors</h1>
            <div>
              <AddVendor />
            </div>
          </div>
          <div class="flex">
            <n-input
              style="backdrop-filter: blur(36px)"
              class="dark:bg-dark_border bg-[#f0f0f0] shadow-lg shadow-black/10"
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
              class="odd:background_light even:bg-foreground_light dark:odd:bg-background_dark dark:even:bg-foreground_dark border-b px-4 py-4 dark:border-0"
            >
              <n-skeleton text :repeat="2" class="w-full" />
              <n-skeleton text class="w-[45%]" />
            </div>
          </div>
          <ul class="bg-foreground_light dark:bg-foreground_dark pt-[12px]">
            <template v-if="debouncedSearchText">
              <VendorList
                v-if="vendorSearchResults"
                :vendors="vendorSearchResults"
                @click:tab="addTab"
              />
            </template>

            <template v-else>
              <template
                v-for="(vendorPage, vendorPageIdx) in vendors?.pages"
                :key="vendorPageIdx"
              >
                <VendorList :vendors="vendorPage.data" @click:tab="addTab" />
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
        :class="listActive ? 'ml-[-60px] !w-[335px]' : '!bg-dark_border'"
        class="bg-background_light/50 dark:bg-dark_border/50 absolute bottom-0 left-0 flex h-[48px] w-[276px] cursor-pointer flex-row items-center justify-between bg-black px-4 shadow-[0_-3px_11px_-5px_rgba(0,0,0,0.25)] duration-[500ms]"
        @click="listActive = !listActive"
      >
        <div
          class="pl-16 text-[10px] duration-[500ms]"
          :class="!listActive ? 'opacity-0' : 'opacity-50'"
        >
          <b>{{ vendors?.pages[0].data.length }}</b> Active Vendors
        </div>
        <div class="!bg-black">
          <div
            class="center-content absolute left-0 bottom-0 flex h-[48px] w-[60px] bg-[#111111]"
          >
            <svg
              class="absolute h-4 w-4 duration-[500ms]"
              :class="
                listActive ? 'ml-[0px] rotate-0' : 'ml-[432px] rotate-180'
              "
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
          ? 'ml-[275px] md:w-[calc(100vw-335px)]'
          : 'ml-[0px] md:w-[calc(100vw-60px)]'
      "
      class="bg-background_light dark:bg-background_dark w-[calc(100vw-60px)] duration-[500ms]"
    >
      <PageTabs :class="global.stuck[0] && 'shadow-lg'" page-name="vendors" />
      <!-- Main Body Content-->
      <div
        id="main"
        class="h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden"
      >
        <main id="container" class="min-h-full p-2 md:p-6">
          <router-view />
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
</style>
