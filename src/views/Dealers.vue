<script setup>
import { ref, watch } from "vue";
import { useDebounce } from "@vueuse/core";

import PageTabs from "@/components/PageTabs.vue";
import { getDealers } from "@/hooks/dealers";
import DealerList from "@/components/dealer/DealerList.vue";
import { useTabsViewStore } from "@/store/tabs";
import { useGlobalState } from "@/store/global";
import AddDealer from "@/components/dealer/AddDealer.vue";

const pageName = "dealers";
const tabStore = useTabsViewStore();
const global = useGlobalState();

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
  listActive.value = global.isMobile ? false : listActive.value;
  tabStore.addTab({ id: dealer.id, name: dealer?.name });
};

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
      class="absolute z-[41] w-[275px]"
      :class="listActive ? 'open-dealer-list' : 'close-dealer-list'"
    >
      <aside
        class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-y-auto overflow-x-hidden bg-background_light dark:bg-background_dark"
      >
        <div class="sticky top-0 border-b dark:border-[0px] bg-foreground_light dark:bg-foreground_dark p-3">
          <div class="mb-3 flex justify-between">
            <h1 class="text-xl font-bold uppercase">Dealers</h1>
            <AddDealer />
          </div>
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
            class="border-b  dark:border-[0px] px-4 py-4 even:bg-[#f8f8fa] dark:even:bg-background_dark"
          >
            <n-skeleton text class="w-full" />
            <n-skeleton text class="w-[45%]" />
          </div>
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
          <b>{{ vendors?.pages[0].data.length }}</b> Active Vendors
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
      <PageTabs :class="global.stuck[0] && 'shadow-lg'" page-name="vendors" />
      <!-- Main Body Content-->
      <div id="main" class="h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden">
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
