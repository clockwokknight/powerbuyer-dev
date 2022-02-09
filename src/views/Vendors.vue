<script setup>
import { ref, watch } from "vue";
import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { useRoute, useRouter } from "vue-router";
import { useDebounceFn, useDebounce } from "@vueuse/core";

import { useLoadingBar } from "naive-ui";
import VendorList from "@/components/vendor/VendorList.vue";

const router = useRouter();
const route = useRoute();
const loadingBar = useLoadingBar();

const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);

const selectedIndex = ref(1);
const tabListButton = ref(null);

// Showing All Vendors
const {
  data: vendors,
  hasNextPage: hasVendorNextPage,
  fetchNextPage: vendorFetchNextPage,
} = useInfiniteQuery(
  "vendors",
  ({ pageParam = 1 }) =>
    axios.get("/vendors?page=" + pageParam).then((r) => r.data),
  {
    getNextPageParam: (lastPage, pages) =>
      lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : null,
  }
);

// Fetching Vendor tabs based on user
const { data: vendorTabs } = useQuery("vendorTabs", () =>
  axios.get("/user_ui_tabs/1/vendor").then((res) => res.data)
);
const tablist = ref([
  {
    id: 1,
    name: "*** Mated Laija",
  },
  {
    id: 5,
    name: "*** Vendor Marcos",
  },
]);
const findTabIndex = (id) => tablist.value.findIndex((tab) => tab.id === id);

const closeTab = (id) => {
  if (tablist.value.length === 1) return;
  const index = findTabIndex(id);

  if (parseInt(route.params?.id) === tablist.value[index].id) {
    router.push(
      `/vendors/${tablist.value[index === 0 ? index + 1 : index - 1].id}`
    );
  }
  tablist.value.splice(index, 1);
};
const addTab = (vendor) => {
  loadingBar.start();
  const index = findTabIndex(vendor.id);
  if (index === -1) {
    tablist.value.push(vendor);
    selectedIndex.value = tablist.value.length - 1;
  } else selectedIndex.value = index;
  scrollTabToView(selectedIndex.value);
};

const tabChanged = (index) => {
  selectedIndex.value = index;
  scrollTabToView(index);
};

watch(selectedIndex, (newValue) => {
  loadingBar.start();
  if (parseInt(route.params?.id) !== tablist.value[newValue].id) {
    router.push(`/vendors/${tablist.value[newValue].id}`);
  }
});

const scrollTabToView = useDebounceFn((index) => {
  const tabListChildren = tabListButton.value.children;

  tabListChildren[index].scrollIntoView({ behavior: "smooth" });
  loadingBar.finish();
}, 100);

// Vendor Search Result
const { data: vendorSearchResults, isFetching: isVendorSearchFetching } =
  useQuery(["vendorSearch", debouncedSearchText], ({ queryKey }) => {
    if (queryKey[1] === "") return null;
    else
      return axios
        .get(`/vendors/search/${queryKey[1]}`)
        .then((res) => res.data);
  });
</script>

<template>
  <div class="flex w-full vendors">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <div
      class="
        relative
        pageItemsList
        min-w-[275px]
        max-w-[275px]
        h-screen
        overflow-y-auto overflow-x-hidden
        bg-white
      "
    >
      <!-- List search & filters -->
      <div class="sticky top-0 p-3 bg-white">
        <div>Vendors</div>
        <div class="flex">
          <div class="mr-3">
            <n-input
              v-model:value.trim="searchText"
              round
              clearable
              placeholder="Search..."
            />
          </div>
        </div>
        <!-- Filter Component -->
      </div>
      <!-- Main Loop List -->
      <div class="">
        <ul>
          <template v-if="vendorSearchResults">
            <VendorList :vendors="vendorSearchResults" @click:tab="addTab" />
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
              class="grid place-content-center p-4 w-full"
            >
              <svg
                class="animate-spin -ml-1 mr-3 w-6 h-6 text-emerald-500"
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
    </div>
    <!-- Main Tabs App Content -->
    <div class="w-[calc(100vw-335px)] h-screen">
      <TabGroup :selected-index="selectedIndex" @change="tabChanged">
        <div
          class="
            overflow-x-auto overflow-y-hidden
            overscroll-contain
            py-2
            bg-[#F8F8FA]
            h-[62px]
          "
        >
          <TabList class="py-1 px-4">
            <div ref="tabListButton" class="flex gap-x-2 flex-nowrap min-w-max">
              <tab
                v-for="tab in tablist"
                :key="tab.id"
                class="
                  relative
                  max-w-xs
                  focus:outline-none focus:ring
                  ring-offset-1 ring-offset-emerald-300 ring-slate-300/20
                  scroll-m-2
                  rounded
                "
              >
                <router-link
                  :to="{ name: 'SingleVendor', params: { id: tab?.id } }"
                  custom
                  v-slot="{ href, route, navigate, isActive }"
                >
                  <a
                    :href="href"
                    @click="navigate"
                    class="
                      block
                      overflow-hidden
                      focus:outline-none
                      p-2
                      rounded
                      pr-6
                      whitespace-nowrap
                    "
                    :class="[
                      isActive ? 'bg-white text-emerald-700' : 'bg-slate-300',
                    ]"
                  >
                    {{ tab?.name }}
                  </a>
                  <span
                    class="
                      absolute
                      right-0
                      inset-y-0
                      flex
                      pr-1
                      items-center
                      rounded-r
                    "
                    @click="closeTab(tab.id)"
                    :class="[
                      tablist.length === 1 && 'hidden',
                      isActive ? 'bg-white' : 'bg-slate-300',
                    ]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </router-link>
              </tab>
            </div>
          </TabList>
        </div>
      </TabGroup>
      <!-- Main Body Content-->
      <div class="overflow-y-auto overflow-x-hidden h-[calc(100%-62px)]">
        <div class="h-screen bg-white">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
