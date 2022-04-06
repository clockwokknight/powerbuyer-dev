<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { useRoute, useRouter } from "vue-router";
import { useGlobalState } from "@/store/global";
import { useDebounceFn, useDebounce } from "@vueuse/core";

import { getAuctions } from "@/hooks/auctions";
import AuctionsList from "@/components/auction/AuctionList.vue";
import AddAuction from "@/components/auction/AddAuction.vue";
import PageTabs from "@/components/PageTabs.vue";
import { useTabsViewStore } from "@/store/tabs";
const pageName = "auctions";
const router = useRouter();
const route = useRoute();
const tabStore = useTabsViewStore();
const global = useGlobalState();
// Tab related states

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const listActive = ref(!global.isMobile);

// Showing All Auctions

const {
  data: auctions,
  hasNextPage: hasAuctionNextPage,
  fetchNextPage: fetchAuctionNextPage,
  isFetching: isAuctionFetching,
} = getAuctions();

// Vendor Search Result
const { data: auctionSearchResults, isFetching: isAuctionSearchFetching } =
  useQuery([`${pageName}_search`, debouncedSearchText], ({ queryKey }) => {
    if (queryKey[1] === "") return null;
    else
      return axios
        .get(`/${pageName}/search/auction_company/${queryKey[1]}`)
        .then((res) => {
          if (res.data?.debug) {
            return [];
          }
          return res.data;
        });
  }
);
const addTab = (auction) => {
  listActive.value = global.isMobile ? false : listActive.value;
  tabStore.addTab({ id: auction.id, name: auction.auction_company });
};

function toggleListSlide() {
  listActive.value = !listActive.value;
}

watch(
  () => listActive.value,
  (val) => {
    global.setListActive(val, "auction");
  }
);

</script>

<template>
  <div class="auctions flex w-full">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <div
      id="auctions-list"
      class="absolute z-[41] w-[275px]"
      :class="listActive ? 'open-auction-list' : 'close-auction-list'"
    >
      <aside
        class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-x-hidden bg-background_light dark:border-r-[1px] dark:border-dark_border dark:bg-background_dark"
      >
        <div
          class="sticky top-0 z-50 bg-foreground_light p-3 pb-0 dark:bg-foreground_dark"
        >
          <div class="mb-3 flex justify-between">
            <h1 class="text-xl font-bold uppercase">Auctions</h1>
            <div>
              <AddAuction />
            </div>
          </div>
          <div class="flex">
            <n-input
              v-model:value.trim="searchText"
              round
              clearable
              placeholder="Search..."
            />
          </div>
          <!-- Filter Component -->
        </div>
        <!-- Main Loop List -->
        <div>
          <div v-if="isAuctionSearchFetching || isAuctionFetching">
            <div
              v-for="index in Array.from({ length: 10 })"
              :key="index"
              class="odd:background_light border-b px-4 py-4 even:bg-foreground_light dark:border-0 dark:odd:bg-background_dark dark:even:bg-foreground_dark"
            >
              <n-skeleton text :repeat="2" class="w-full" />
              <n-skeleton text class="w-[45%]" />
            </div>
          </div>
          <ul class="bg-foreground_light pt-[12px] dark:bg-foreground_dark">
            <template v-if="debouncedSearchText">
              <AuctionsList
                v-if="auctionSearchResults"
                :auctions="auctionSearchResults"
                @click:tab="addTab"
              />
            </template>

            <template v-else>
              <template
                v-for="(auctionPage, auctionPageIdx) in auctions?.pages"
                :key="auctionPageIdx"
              >
                <AuctionsList
                  :auctions="auctionPage.data"
                  @click:tab="addTab"
                />
              </template>
              <button
                v-observe-visibility="
                  (isVisible) => (isVisible ? fetchAuctionNextPage() : null)
                "
                v-if="hasAuctionNextPage"
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
          <b>{{ auctions?.pages[0].data.length }}</b> Active Auctions
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
          ? 'ml-[275px] md:w-[calc(100vw-335px)]'
          : 'ml-[0px] md:w-[calc(100vw-60px)]'
      "
      class="w-[calc(100vw-60px)] bg-background_light duration-[500ms] dark:bg-background_dark"
    >
      <PageTabs :class="global.stuck[0] && 'shadow-lg'" page-name="auctions" />
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
.close-auction-list {
  animation: left-slide 0.5s forwards;
  margin-left: -275px;
}
.open-auction-list {
  animation: right-slide 0.5s forwards;
  margin-left: 0px;
}
.close-auction-list .slide-icon {
  transform: rotate(180deg);
}
.open-auction-list .slide-icon {
  transform: rotate(0deg);
}
.auction-list-open {
  margin-left: 0;
}
.auction-list-closed {
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
