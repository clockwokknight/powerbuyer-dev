<script setup>
import { onUpdated, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInfiniteQuery, useQuery } from "vue-query";
import { useLoadingBar } from "naive-ui";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { useDebounceFn, useDebounce } from "@vueuse/core";
import { getVendorById, getVendors } from "@/hooks/vendor";
import { useGlobalState } from "@/store/global";
import axios from "axios";

import VendorList from "@/components/vendor/VendorList.vue";
import AddVendor from "@/components/vendor/AddVendor.vue";
import Tabs from "@/components/common/Tabs.vue";

const global = useGlobalState();
const router = useRouter();
const route = useRoute();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const selectedIndex = ref(1);
const tabListButton = ref(null);
const tabListButtonWrapper = ref(null);
const showScrollArrow = ref(false);
const scrollWrapper = ref(null);

const {
  data: vendors,
  isLoading: isVendorsLoading,
  hasNextPage: hasVendorNextPage,
  fetchNextPage: vendorFetchNextPage,
} = getVendors();

const tablist = ref([]);

onMounted(() => {
  axios.get("/user_ui_tabs/1/vendors").then((res) => {
    tablist.value = JSON.parse(res.data.tabs);
    if (tablist.value.length >= 1 && route.path === "/vendors") {
      tablist.value.forEach((tab) => {
        if (tab.active) {
          router.push(`/vendors/${tab.id}`);
        }
      });
    }
  });
});

watch(selectedIndex, (newValue) => {
  if (
    tablist.value.length >= 1 &&
    parseInt(route.params?.id) !== tablist.value[newValue].id
  ) {
    router.push(`/vendors/${tablist.value[newValue].id}`);
  }
});

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
</script>

<template>
  <div class="vendors flex w-full">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <aside
      class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-y-auto overflow-x-hidden bg-white dark:bg-[#1E1F21]"
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
        <div
          v-if="isVendorSearchFetching || isVendorsLoading"
          v-for="index in Array.from({ length: 10 })"
          :key="index"
          class="border-b dark:border-0 px-4 py-4 even:bg-[#f8f8fa]"
        >
          <n-skeleton text :repeat="2" class="w-full" />
          <n-skeleton text class="w-[45%]" />
        </div>
        <ul class="dark:bg-[#1F1F23]">
          <template v-if="debouncedSearchText">
            <VendorList v-if="vendorSearchResults" :vendors="vendorSearchResults" />
          </template>

          <template v-else>
            <template
              v-for="(vendorPage, vendorPageIdx) in vendors?.pages"
              :key="vendorPageIdx"
            >
              <VendorList :vendors="vendorPage.data" />
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

    <!-- Main Tabs App Content -->

    <section class="h-screen w-[calc(100vw-335px)] bg-white dark:bg-[#1E1F21] !border-transparent">
      <!-- Main Body Content-->
      <div
        @scroll="handleScroll"
        class="h-full overflow-y-auto overflow-x-hidden border-t-2"
      >
        <main class="min-h-full bg-lightergray dark:bg-[#1E1F21] p-6 pt-6">
          <router-view />
        </main>
      </div>
    </section>
  </div>
</template>
