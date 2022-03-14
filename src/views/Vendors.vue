<script setup>
import { useQuery } from "vue-query";
import axios from "axios";
import { useDebounce } from "@vueuse/core";
import VendorList from "@/components/vendor/VendorList.vue";
import { ref, watch } from "vue";
import { getVendors } from "@/hooks/vendor";
import { useGlobalState } from "@/store/global";
import { useTabsViewStore } from "@/store/tabs";
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

// TODO: we are gonna have to figure this out
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
  <div class="vendors flex w-full">
    <!-- Don't show PageItemsList on dashboard  | Current Page List -->
    <div
      id="vendors-list"
      class="absolute z-[41] w-[275px] md:relative md:m-0"
      :class="vendorListActive ? 'open-vendor-list' : 'close-vendor-list'"
    >
      <!-- SearchList.vue / -->
      <aside
        class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-x-hidden bg-background_light dark:border-r-[1px] dark:border-dark_border dark:bg-background_dark"
      >
        <div
          class="sticky top-0 z-50 bg-foreground_light p-3 pb-0 dark:bg-foreground_dark"
        >
          <div class="mb-3 flex justify-between">
            <h1 class="text-xl font-bold uppercase">Vendors</h1>
            <div>
              <AddVendor />
            </div>
          </div>
          <div class="flex">
            <n-input
              v-model:value.trim="searchText"
              clearable
              placeholder="Search..."
            />

            <!--div content="Filter" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                class="w-6 h-6 mt-1 text-gray-400 cursor-pointer dark:text-white hover:text-primary"
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
            </div-->
          </div>
          <!-- Filter Component -->
        </div>
        <!-- Main Loop List -->
        <div>
          <div v-if="isVendorSearchFetching || isVendorsLoading">
            <div
              v-for="index in Array.from({ length: 10 })"
              :key="index"
              class="odd:background_light border-b px-4 py-4 even:bg-foreground_light dark:border-0 dark:odd:bg-background_dark dark:even:bg-foreground_dark"
            >
              <n-skeleton text :repeat="2" class="w-full" />
              <n-skeleton text class="w-[45%]" />
            </div>
          </div>
          <ul class="bg-foreground_light dark:bg-foreground_dark">
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
      <div
        id="mobile-slider"
        class="absolute bottom-0 left-0 flex h-[36px] w-[325px] flex-row items-center justify-between bg-white px-4 shadow-[0_-3px_11px_-5px_rgba(0,0,0,0.25)] dark:bg-black"
      >
        <div class="text-[8px]">
          {{ vendors?.pages[0].data.length }} Active Vendors
        </div>
        <img
          class="slide-icon h-[18px] w-[18px] cursor-pointer"
          src="/icons/LeftSlide.svg"
          @click="toggleListSlide"
        />
      </div>
    </div>

    <!-- Main Tabs App Content -->

    <section
      id="main-content"
      style="height: calc(100vh - 8px)"
      class="w-[calc(100vw-60px)] bg-background_light dark:bg-background_dark md:w-[calc(100vw-335px)]"
    >
      <PageTabs :class="global.stuck[0] && 'shadow-lg'" page-name="vendors" />
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
