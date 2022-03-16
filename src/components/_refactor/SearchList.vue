<script setup>
const searchText = ref("");
const debouncedSearchText = useDebounce(searchText, 500);
</script>

<template>
  <aside
    class="pageItemsList relative h-screen min-w-[275px] max-w-[275px] overflow-x-hidden bg-background_light dark:bg-background_dark"
  >
    <div class="sticky top-0 z-50 bg-foreground_light dark:bg-foreground_dark p-3">
      <div class="flex justify-between mb-3">
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
            class="w-6 h-6 mt-1 text-gray-400 cursor-pointer dark:text-gray-800 hover:text-primary"
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
    <div>
      <div v-if="isVendorSearchFetching || isVendorsLoading">
        <div
          v-for="index in Array.from({ length: 10 })"
          :key="index"
          class="border-b dark:border-0 px-4 py-4 even:bg-foreground_light dark:even:bg-foreground_dark odd:background_light dark:odd:bg-background_dark"
        >
          <n-skeleton text :repeat="2" class="w-full" />
          <n-skeleton text class="w-[45%]" />
        </div>
      </div>
      <ul class="bg-foreground_dark dark:bg-foreground_dark">
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
            class="grid w-full p-4 place-content-center"
          >
            <n-spin size="small" />
          </button>
        </template>
      </ul>
    </div>
  </aside>
  <div
    id="mobile-slider"
    class="absolute w-[325px] h-[36px] flex flex-row justify-between bottom-0 left-0 bg-white items-center shadow-[0_-3px_11px_-5px_rgba(0,0,0,0.25)] px-4 dark:bg-black"
  >
    <div class="text-[8px]">{{ vendors?.pages[0].data.length }} Active Vendors</div>
    <img
      class="slide-icon w-[18px] h-[18px] cursor-pointer"
      src="/icons/LeftSlide.svg"
      @click="toggleListSlide"
    />
  </div>
</template>
