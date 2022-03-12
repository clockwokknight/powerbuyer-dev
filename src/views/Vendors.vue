<script setup>
import { useQuery } from "vue-query";
import axios from "axios";
import { useDebounce } from "@vueuse/core";
import { onUpdated, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoadingBar } from "naive-ui";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { getVendorById, getVendors } from "@/hooks/vendor";
import { useGlobalState } from "@/store/global";
import { useTabsViewStore } from "@/store/tabs";

import VendorList from "@/components/vendor/VendorList.vue";
import AddVendor from "@/components/vendor/AddVendor.vue";
import PageTabs from "@/components/PageTabs.vue";
import Tabs from "@/components/common/Tabs.vue";

const tabStore = useTabsViewStore();
const global = useGlobalState();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const vendorListActive = ref(false);

// Showing All Vendors

const {
  data: vendors,
  isLoading: isVendorsLoading,
  hasNextPage: hasVendorNextPage,
  fetchNextPage: vendorFetchNextPage,
} = getVendors();

const addTab = (vendor) => {
  tabStore.addTab({ id: vendor?.id, name: vendor?.name });
};

// Vendor Search Result

const { data: vendorSearchResults, isFetching: isVendorSearchFetching } = useQuery(
  ["vendorSearch", debouncedSearchText],
  ({ queryKey }) => {
    if (queryKey[1] === "") return null;
    else
      return axios.get(`/vendors/search/${queryKey[1]}`).then((res) => {
        if (res.data?.debug) {
          return [];
        }
        return res.data;
      });
  }
);

function handleScroll(e) {
  let scroll = e.target.scrollTop;
  global.stick([scroll >= 100, scroll >= 400]);
  global.setActiveTab(
    [
      scroll < 400,
      scroll >= 400 && scroll < 800,
      scroll >= 800 && scroll < 1600,
      scroll >= 1600,
    ].indexOf(true)
  );
}

function toggleListSlide() {
  vendorListActive.value = !vendorListActive.value;
}

watch(
  () => vendorListActive.value,
  (val) => {
    global.setListActive(val, "vendor");
  }
);
</script>

<template>
  <div class="flex w-full vendors">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <div
      id="vendors-list"
      class="w-[275px] absolute md:relative md:m-0 z-[41]"
      :class="vendorListActive ? 'open-vendor-list' : 'close-vendor-list'"
    >
      <!-- SearchList.vue / -->
      <aside
        class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-x-hidden bg-background_light dark:bg-background_dark"
      >
        <div class="sticky top-0 z-50 bg-foreground_light dark:bg-foreground_dark p-3">
          <div class="flex justify-between mb-3">
            <h1 class="text-xl font-bold uppercase">Vendors</h1>
            <div>
              <AddVendor />
            </div>
          </div>
          <div class="flex">
            <div class="mr-3">
              <n-input
                v-model:value.trim="searchText"
                round
                clearable
                placeholder="Search..."
              />
            </div>
            <div content="Filter" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                class="w-6 h-6 mt-1 text-gray-400 cursor-pointer dark:text-gray-800 hover:text-primary"
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
            </div>
          </div>
          <!-- Filter Component -->
        </div>
        <!-- Main Loop List -->
        <div>
          <div v-if="isVendorSearchFetching || isVendorsLoading">
            <div
              v-for="index in Array.from({ length: 10 })"
              :key="index"
              class="border-b dark:border-0 px-4 py-4 even:bg-foreground_light dark:even:bg-foreground_dark odd:background_light dark:odd:bg-background_dark"
            >
              <n-skeleton text :repeat="2" class="w-full" />
              <n-skeleton text class="w-[45%]" />
            </div>
          </div>
          <ul class="bg-foreground_dark dark:bg-foreground_dark">
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
                class="grid w-full p-4 place-content-center"
              >
                <n-spin size="small" />
              </button>
            </template>
          </ul>
        </div>
      </aside>
      <div
        id="mobile-slider"
        class="absolute w-[325px] h-[36px] flex flex-row justify-between bottom-0 left-0 bg-white items-center shadow-[0_-3px_11px_-5px_rgba(0,0,0,0.25)] px-4 dark:bg-black"
      >
        <div class="text-[8px]">{{ vendors?.pages[0].data.length }} Active Vendors</div>
        <img
          class="slide-icon w-[18px] h-[18px] cursor-pointer"
          src="/icons/LeftSlide.svg"
          @click="toggleListSlide"
        />
      </div>
    </div>

    <!-- Main Tabs App Content -->

    <section
      id="main-content"
      class="h-screen w-[calc(100vw-60px)] md:w-[calc(100vw-335px)] bg-background_light dark:bg-background_dark"
    >
      <PageTabs page-name="vendors" />
      <!-- Main Body Content-->
      <div class="h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden">
        <main id="container" class="min-h-full p-2 md:p-6">
          <router-view />
        </main>
      </div>
    </section>
  </div>
</template>

<style scoped>
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

@media only screen and (min-width: 768px) {
  #mobile-slider {
    display: none;
  }

  .close-vendor-list {
    animation: right-slide 0.5s forwards;
    margin-left: 0;
  }
}
</style>
