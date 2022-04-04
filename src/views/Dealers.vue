<script setup>
import { ref, watch } from "vue";
import { useQuery } from "vue-query";
import { useDebounce } from "@vueuse/core";
import PageTabs from "@/components/PageTabs.vue";
import { getDealers } from "@/hooks/dealers";
import DealerList from "@/components/dealer/DealerList.vue";
import { useTabsViewStore } from "@/store/tabs";
import { useGlobalState } from "@/store/global";
import AddDealer from "@/components/dealer/AddDealer.vue";
import { useDealers } from "@/store/dealers";
import axios from "axios";

const tabStore = useTabsViewStore();
const global = useGlobalState();
const dealerStore = useDealers();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const {
  data: dealers,
  isFetching: isDealerFetching,
  isLoading: isDealerLoading,
  hasNextPage,
  fetchNextPage,
} = getDealers();

const listActive = ref(!global.isMobile);

const addTab = (dealer) => {
  dealerStore.SET_LATEST(dealer?.id);
  listActive.value = global.isMobile ? false : listActive.value;
  tabStore.addTab({ id: dealer.id, name: dealer?.name });
};

// Dealer Search Result

const { data: dealerSearchResults, isFetching: isDealerSearchFetching } =
  useQuery(["dealerSearch", debouncedSearchText], ({ queryKey }) => {
    if (queryKey[1] === "") return null;
    else
      return axios.get(`/dealers/search/${queryKey[1]}`).then((res) => {
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
    global.setListActive(val, "dealer");
  }
);
</script>

<template>
  <div class="dealers flex w-full">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <div
      id="dealers-list"
      class="absolute z-[41] w-[275px]"
      :class="listActive ? 'open-dealer-list' : 'close-dealer-list'"
    >
      <aside
        class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-x-hidden bg-background_light dark:border-r-[1px] dark:border-dark_border dark:bg-background_dark"
      >
        <div
          class="sticky top-0 z-50 bg-foreground_light p-3 pb-0 dark:bg-foreground_dark"
        >
          <div class="mb-3 flex justify-between">
            <h1 class="text-xl font-bold uppercase">Dealers</h1>
            <div>
              <AddDealer />
            </div>
          </div>
          <div class="flex">
            <n-input
              style="backdrop-filter: blur(36px)"
              class="bg-[#f0f0f0] shadow-lg shadow-black/10 dark:bg-dark_border"
              v-model:value.trim="searchText"
              clearable
              placeholder="Search..."
            />
          </div>
          <!-- Filter Component -->
        </div>
        <!-- Main Loop List -->
        <div>
          <div
            v-if="isDealerSearchFetching || isDealerLoading"
            v-for="index in Array.from({ length: 10 })"
            :key="index"
            class="odd:background_light border-b px-4 py-4 even:bg-foreground_light dark:border-0 dark:odd:bg-background_dark dark:even:bg-foreground_dark"
          >
            <n-skeleton text :repeat="2" class="w-full" />
            <n-skeleton text class="w-[45%]" />
          </div>
          <ul class="bg-foreground_light pt-[12px] dark:bg-foreground_dark">
            <template v-if="debouncedSearchText">
              <DealerList
                v-if="dealerSearchResults"
                :dealers="dealerSearchResults"
                @click:tab="addTab"
              />
            </template>

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
        class="absolute bottom-0 left-0 flex h-[48px] w-[276px] cursor-pointer flex-row items-center justify-between bg-background_light/50 bg-black px-4 shadow-[0_-3px_11px_-5px_rgba(0,0,0,0.25)] duration-[500ms] dark:bg-dark_border/50"
        @click="listActive = !listActive"
      >
        <div
          class="pl-16 text-[10px] duration-[500ms]"
          :class="!listActive ? 'opacity-0' : 'opacity-50'"
        >
          <b>{{ dealers?.pages[0].data.length }}</b> Active Dealers
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
      class="w-[calc(100vw-60px)] bg-background_light duration-[500ms] dark:bg-background_dark"
    >
      <PageTabs :class="global.stuck[0] && 'shadow-lg'" page-name="dealers" />
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
<style scoped>
.close-dealer-list {
  animation: left-slide 0.5s forwards;
  margin-left: -275px;
}
.open-dealer-list {
  animation: right-slide 0.5s forwards;
  margin-left: 0px;
}
.close-dealer-list .slide-icon {
  transform: rotate(180deg);
}
.open-dealer-list .slide-icon {
  transform: rotate(0deg);
}
.dealer-list-open {
  margin-left: 0;
}
.dealer-list-closed {
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
