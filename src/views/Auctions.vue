<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { useRoute, useRouter } from "vue-router";
import { useDebounceFn, useDebounce } from "@vueuse/core";

import { useLoadingBar } from "naive-ui";

import { getAuctions } from "@/hooks/auctions";
import AuctionsList from "@/components/auction/AuctionList.vue";
const pageName = "auctions";
const router = useRouter();
const route = useRoute();
const loadingBar = useLoadingBar();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);
// Tab related states
const selectedIndex = ref(1);
const tabListButton = ref(null);
const tabListButtonWrapper = ref(null);
const showScrollArrow = ref(false);
const scrollWrapper = ref(null);

// Left and right Click Arrow Scroll
const ifScrollArrowNeeded = useDebounceFn(() => {
  const wrapperWidth =
    tabListButtonWrapper.value?.getBoundingClientRect().width;
  const tabWidth = tabListButton.value?.getBoundingClientRect().width;

  showScrollArrow.value = wrapperWidth < tabWidth;
}, 500);

onUpdated(() => {
  ifScrollArrowNeeded();
});

const scrollTo = (type) => {
  const scrollLeft = scrollWrapper.value.scrollLeft;

  if (type === "left") {
    scrollWrapper.value.scrollTo({
      left: scrollLeft - 150,
      behavior: "smooth",
    });
  } else {
    scrollWrapper.value.scrollTo({
      left: scrollLeft + 150,
      behavior: "smooth",
    });
  }
};
// Showing All Vendors
const {
  data: auctions,
  hasNextPage: hasAuctionNextPage,
  fetchNextPage: fetchAuctionNextPage,
} = getAuctions();

const tablist = ref([]);

onMounted(() => {
  axios.get("/user_ui_tabs/1/auctions").then((res) => {
    if (res.data) {
      tablist.value = JSON.parse(res.data.tabs);
      scrollTabToView();
      ifScrollArrowNeeded();
      if (tablist.value.length >= 1 && route.path === "/auctions") {
        tablist.value.forEach((tab) => {
          if (tab.active) {
            router.push(`/auctions/${tab.id}`);
          }
        });
      }
    } else {
      axios.post("/user_ui_tabs/create", {
        user_id: 1,
        page: "auctions",
        tabs: JSON.stringify([]),
      });
    }
  });
});

const syncTabs = useDebounceFn(() => {
  axios.post("/user_ui_tabs/update", {
    user_id: 1,
    page: pageName,
    tabs: JSON.stringify(tablist.value),
  });
}, 1000);
const findTabIndex = (id) => tablist.value.findIndex((tab) => tab.id === id);

const closeTab = (id) => {
  const index = findTabIndex(id);
  if (tablist.value.length === 1) {
    tablist.value.splice(index, 1);
    syncTabs();
    router.push("/" + pageName);
  } else {
    if (parseInt(route.params?.id) === tablist.value[index].id) {
      const activeIndex = index === 0 ? index + 1 : index - 1;
      tablist.value = tablist.value.map(({ active, ...rest }, i) => {
        if (i === activeIndex) {
          return { ...rest, active: true };
        } else return rest;
      });
      router.push(`/${pageName}/${tablist.value[activeIndex].id}`);
    }
    tablist.value.splice(index, 1);

    syncTabs();
    ifScrollArrowNeeded();
  }
};
const addTab = (vendor) => {
  loadingBar.start();
  const index = findTabIndex(vendor.id);
  if (index === -1) {
    tablist.value = tablist.value
      .map(({ active, ...rest }) => rest)
      .concat([
        { id: vendor?.id, name: vendor?.auction_company, active: true },
      ]);
    selectedIndex.value = tablist.value.length - 1;
  } else {
    tablist.value = tablist.value.map(({ active, ...rest }, i) => {
      if (i === index) {
        return { ...rest, active: true };
      } else return rest;
    });
    selectedIndex.value = index;
  }
  scrollTabToView();
  syncTabs();
};

const tabChanged = (index) => {
  selectedIndex.value = index;
  tablist.value = tablist.value.map(({ active, ...rest }, i) => {
    if (i === index) {
      return { ...rest, active: true };
    } else return rest;
  });
  scrollTabToView();
};

watch(selectedIndex, (newValue) => {
  loadingBar.start();
  if (
    tablist.value.length >= 1 &&
    parseInt(route.params?.id) !== tablist.value[newValue].id
  ) {
    router.push(`/${pageName}/${tablist.value[newValue].id}`);
  }
});

const scrollTabToView = useDebounceFn(() => {
  const tabListChildren = tabListButton.value.children;
  for (let i = 0; i < tabListChildren.length; i++) {
    const tabIndex = parseInt(
      tabListChildren[i]
        .getElementsByTagName("button")[0]
        .getAttribute("tabindex")
    );
    if (tabIndex === 0) {
      tabListChildren[i].scrollIntoView({ behavior: "smooth" });
      break;
    }
  }
  loadingBar.finish();
}, 100);

// Vendor Search Result
const { data: vendorSearchResults, isFetching: isVendorSearchFetching } =
  useQuery([`${pageName}_search`, debouncedSearchText], ({ queryKey }) => {
    if (queryKey[1] === "") return null;
    else
      return axios.get(`/${pageName}/search/${queryKey[1]}`).then((res) => {
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
          <h1 class="text-xl font-bold uppercase">Auctions</h1>
          <!--          <div>-->
          <!--            <AddVendor />-->
          <!--          </div>-->
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
      <div class="">
        <ul class="">
          <template v-if="debouncedSearchText">
            <AuctionsList
              v-if="vendorSearchResults"
              :auctions="vendorSearchResults"
              @click:tab="addTab"
            />
          </template>

          <template v-else>
            <template
              v-for="(auctionPage, auctionPageIdx) in auctions?.pages"
              :key="auctionPageIdx"
            >
              <AuctionsList :auctions="auctionPage.data" @click:tab="addTab" />
            </template>
            <button
              v-observe-visibility="
                (isVisible) => (isVisible ? fetchAuctionNextPage() : null)
              "
              v-if="hasAuctionNextPage"
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
      </div>
    </aside>
    <!-- Main Tabs App Content -->
    <section class="h-screen w-[calc(100vw-335px)]">
      <TabGroup :selected-index="selectedIndex" @change="tabChanged">
        <header class="relative flex items-end" ref="tabListButtonWrapper">
          <div
            class="flex h-[62px] items-end overflow-x-hidden bg-[#F8F8FA]"
            ref="scrollWrapper"
          >
            <TabList>
              <nav
                ref="tabListButton"
                class="flex min-w-max flex-nowrap gap-x-2"
              >
                <template
                  v-for="tab in tablist"
                  v-if="tablist.length >= 1"
                  :key="tab?.id"
                >
                  <router-link
                    :to="`/${pageName}/${tab?.id}`"
                    custom
                    v-slot="{ href, route, navigate, isActive }"
                  >
                    <div
                      class="relative grid place-content-center overflow-hidden rounded border-x border-t"
                    >
                      <tab
                        class="max-w-xs scroll-mt-2 focus:outline-none"
                        :class="[
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700',
                        ]"
                      >
                        <a
                          :href="href"
                          @click="navigate"
                          class="block max-w-[250px] overflow-hidden truncate whitespace-nowrap px-4 py-2 pr-6 focus:outline-none"
                        >
                          {{ tab?.name }}
                        </a>
                      </tab>
                      <span
                        class="absolute inset-y-0 right-0 top-[1px] z-10 flex cursor-pointer items-center rounded-r pr-1"
                        @click.stop="closeTab(tab.id)"
                        :class="[
                          isActive ? 'bg-primary text-white' : 'bg-slate-white',
                        ]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          class="h-5 w-5"
                          :class="[
                            isActive
                              ? 'bg-primary text-white hover:text-gray-300'
                              : 'bg-slate-white text-gray-200 hover:text-gray-400',
                          ]"
                          fill="currentColor"
                          viewBox="0 0 512 512"
                        >
                          <path
                            d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
                            fill="none"
                            stroke="currentColor"
                            stroke-miterlimit="10"
                            stroke-width="32"
                          ></path>
                          <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="32"
                            d="M320 320L192 192"
                          ></path>
                          <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="32"
                            d="M192 320l128-128"
                          ></path>
                        </svg>
                      </span></div
                  ></router-link>
                </template>
              </nav>
            </TabList>
          </div>
          <div class="flex h-[48px] bg-[#f8f8fa]">
            <button
              class="grid w-8 place-content-center px-2 hover:text-[#027bff]"
              v-if="showScrollArrow"
              @click="scrollTo('left')"
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <button
              class="grid w-8 place-content-center px-2 hover:text-[#027bff]"
              v-if="showScrollArrow"
              @click="scrollTo('right')"
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31a.996.996 0 0 0 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </header>
      </TabGroup>
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
