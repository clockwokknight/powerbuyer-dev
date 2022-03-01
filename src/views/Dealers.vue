<script setup>
import { ref } from "vue";
import { useDebounce } from "@vueuse/core";

import PageTabs from "@/components/PageTabs.vue";
import { getDealers } from "@/hooks/dealers";
import DealerList from "@/components/dealer/DealerList.vue";
import { useTabsViewStore } from "@/store/tabs";

const pageName = "auctions";
const tabStore = useTabsViewStore();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const {
  data: dealers,
  isFetching: isDealerFetching,
  isLoading: isDealerLoading,
  hasNextPage,
  fetchNextPage,
} = getDealers();
const addTab = (dealer) => {
  tabStore.addTab({ id: dealer.id, name: dealer?.name });
};
// Vendor Search Result
// const { data: vendorSearchResults, isFetching: isVendorSearchFetching } =
//   useQuery([`${pageName}_search`, debouncedSearchText], ({ queryKey }) => {
//     if (queryKey[1] === "") return null;
//     else
//       return axios.get(`/${pageName}/search/${queryKey[1]}`).then((res) => {
//         if (res.data?.debug) {
//           return [];
//         }
//         return res.data;
//       });
//   });
</script>

<template>
  <div class="vendors flex w-full">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <aside
      class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-y-auto overflow-x-hidden bg-white"
    >
      <div class="sticky top-0 border-b bg-white p-3">
        <div class="mb-3 flex justify-between">
          <h1 class="text-xl font-bold uppercase">Dealers</h1>
          <!--          <AddAuction />-->
        </div>
        <!--        <div class="flex">-->
        <!--          <div class="mr-3">-->
        <!--                        <n-input-->
        <!--                          v-model:value.trim="searchText"-->
        <!--                          round-->
        <!--                          clearable-->
        <!--                          placeholder="Search..."-->
        <!--                        />-->
        <!--          </div>-->
        <!--          <div content="Filter" v-tippy="{ placement: 'right', duration: 50 }">-->
        <!--            <svg-->
        <!--              class="-->
        <!--                mt-1-->
        <!--                h-6-->
        <!--                w-6-->
        <!--                cursor-pointer-->
        <!--                text-gray-400-->
        <!--                hover:text-[#027bff]-->
        <!--              "-->
        <!--              xmlns="http://www.w3.org/2000/svg"-->
        <!--              xmlns:xlink="http://www.w3.org/1999/xlink"-->
        <!--              viewBox="0 0 24 24"-->
        <!--            >-->
        <!--              <path-->
        <!--                d="M5.5 5h13a1 1 0 0 1 .5 1.5L14 12v7l-4-3v-4L5 6.5A1 1 0 0 1 5.5 5"-->
        <!--                fill="none"-->
        <!--                stroke="currentColor"-->
        <!--                stroke-width="2"-->
        <!--                stroke-linecap="round"-->
        <!--                stroke-linejoin="round"-->
        <!--              ></path>-->
        <!--            </svg>-->
        <!--          </div>-->
        <!--        </div>-->
        <!-- Filter Component -->
      </div>
      <!-- Main Loop List -->
      <div>
        <ul>
          <template v-if="debouncedSearchText"> hi </template>

          <template v-else>
            <template
              v-for="(dealerPage, dealerPageIdx) in dealers?.pages"
              :key="dealerPageIdx"
            >
              <DealerList :dealers="dealerPage.data" @click:tab="addTab" />
            </template>
            <button
              v-observe-visibility="
                (isVisible) => (isVisible ? fetchNextPage() : null)
              "
              v-if="hasNextPage"
              class="grid w-full place-content-center p-4"
            >
              <svg
                class="mr-3 -ml-1 h-6 w-6 animate-spin text-emerald-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </button>
          </template>
        </ul>
        <div
          v-if="isDealerLoading"
          v-for="index in Array.from({ length: 10 })"
          :key="index"
          class="border-b px-4 py-4 even:bg-[#f8f8fa]"
        >
          <n-skeleton text class="w-full" />
          <n-skeleton text class="w-[45%]" />
        </div>
      </div>
    </aside>
    <!-- Main Tabs App Content -->
    <section class="h-screen w-[calc(100vw-335px)]">
      <page-tabs page-name="dealers" />
      <!-- Main Body Content-->
      <div
        class="h-[calc(100%-62px)] overflow-y-auto overflow-x-hidden border-t-2"
      >
        <main class="h-full bg-white">
          <router-view />
        </main>
      </div>
    </section>
  </div>
</template>
