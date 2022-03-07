<script setup>
import { useQuery } from "vue-query";
import axios from "axios";
import { useDebounce } from "@vueuse/core";
import VendorList from "@/components/vendor/VendorList.vue";
import { onUpdated, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoadingBar } from "naive-ui";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { getVendorById, getVendors } from "@/hooks/vendor";
import { useGlobalState } from "@/store/global";

import AddVendor from "@/components/vendor/AddVendor.vue";
import { useTabsViewStore } from "@/store/tabs";
import PageTabs from "@/components/PageTabs.vue";

import Tabs from "@/components/common/Tabs.vue";
const tabStore = useTabsViewStore();

const global = useGlobalState();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

// Showing All Vendors
const {
  data: vendors,
  isLoading: isVendorsLoading,
  hasNextPage: hasVendorNextPage,
  fetchNextPage: vendorFetchNextPage,
} = getVendors();
console.log('vendors:', vendors)
const addTab = (vendor) => {
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

function handleVendorListSlide() {
  const vendorsListElement = document.getElementById('vendors-list');
  const mainContent = document.getElementById('main-content');
  const mobileSlider = document.getElementById('mobile-slider');

  if (vendorsListElement.classList.contains('close-vendor-list')) {
    vendorsListElement.classList.remove('close-vendor-list');
    mobileSlider.classList.remove('close-vendor-list');
    vendorsListElement.classList.add('open-vendor-list');
    mobileSlider.classList.add('open-vendor-list');
    mainContent.classList.remove('w-[calc(100vw-60px)]')
    setTimeout(() => {
      mainContent.classList.add('w-[calc(100vw-335px)]');
    }, 500);
  } else {
    vendorsListElement.classList.remove('open-vendor-list');
    mobileSlider.classList.remove('open-vendor-list');
    vendorsListElement.classList.add('close-vendor-list');
    mobileSlider.classList.add('close-vendor-list');
    mainContent.classList.remove('w-[calc(100vw-335px)]')
    setTimeout(() => {
      mainContent.classList.add('w-[calc(100vw-60px)]');
    }, 500);
  }
}
</script>

<template>
  <div class="vendors flex w-full">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <div id="vendors-list" class="w-[275px]">
      <aside
        class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-x-hidden bg-white dark:bg-[#1E1F21]"
      >
        <div class="sticky top-0 border-b dark:border-0 bg-white dark:bg-[#25272A] p-3">
          <div class="mb-3 flex justify-between">
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
                class="mt-1 h-6 w-6 cursor-pointer text-gray-400 dark:text-gray-800 hover:text-primary"
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
        <div class="">
          <div v-if="isVendorSearchFetching || isVendorsLoading">
            <div
              v-for="index in Array.from({ length: 10 })"
              :key="index"
              class="border-b dark:border-0 px-4 py-4 even:bg-[#f8f8fa]"
            >
              <n-skeleton text :repeat="2" class="w-full" />
              <n-skeleton text class="w-[45%]" />
            </div>
          </div>
          <ul class="dark:bg-[#25272A]">
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
      <div id="mobile-slider" class="absolute w-[325px] h-[36px] flex flex-row justify-between bottom-0 left-0 bg-white items-center shadow-[0_-3px_11px_-5px_rgba(0,0,0,0.25)] px-4">
        <div class="text-[8px]">{{ vendors?.pages[0].data.length }} Active Vendors</div>
        <img class="slide-icon w-[18px] h-[18px] cursor-pointer" src="/icons/LeftSlide.svg" @click="handleVendorListSlide" />
      </div>
    </div>

    <!-- Main Tabs App Content -->

    <section id="main-content" class="h-screen w-[calc(100vw-335px)] bg-lightergray dark:bg-[#1E1F21]">
      <page-tabs page-name="vendors" />
      <!-- Main Body Content-->
      <div class="h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden">
        <main id="container" class="min-h-full p-6">
          <router-view />
        </main>
      </div>
    </section>
  </div>
</template>
<style scoped>
.close-vendor-list {
  animation: left-slide 0.5s forwards;
}

.open-vendor-list {
  animation: right-slide 0.5s forwards;
}

.close-vendor-list .slide-icon {
  transform: rotate(180deg);
}

.open-vendor-list .slide-icon {
  transform: rotate(0deg);
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
}
</style>