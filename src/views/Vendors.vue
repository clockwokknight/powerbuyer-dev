<script setup>
import { ref } from "vue";
import { useQuery } from "vue-query";
import axios from "axios";
import { useDebounce } from "@vueuse/core";
import VendorList from "@/components/vendor/VendorList.vue";

import AddVendor from "@/components/vendor/AddVendor.vue";
import { getVendors } from "@/hooks/vendor";
import { useTabsViewStore } from "@/store/tabs";
import PageTabs from "@/components/PageTabs.vue";

const tabStore = useTabsViewStore();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

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
</script>

<template>
  <div class="vendors flex w-full">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <aside
      class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-y-auto overflow-x-hidden bg-white"
    >
      <div class="sticky top-0 border-b bg-white p-3">
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
              class="mt-1 h-6 w-6 cursor-pointer text-gray-400 hover:text-[#027bff]"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
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
          class="border-b px-4 py-4 even:bg-[#f8f8fa]"
        >
          <n-skeleton text :repeat="2" class="w-full" />
          <n-skeleton text class="w-[45%]" />
        </div>
        <ul class="">
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
    <!-- Main Tabs App Content -->
    <section class="h-screen w-[calc(100vw-335px)]">
      <page-tabs page-name="vendors" />
      <!-- Main Body Content-->
      <div
        class="h-[calc(100%-62px)] overflow-y-auto overflow-x-hidden border-t-2"
      >
        <main class="min-h-full bg-white pt-10">
          <router-view />
        </main>
      </div>
    </section>
  </div>
</template>
