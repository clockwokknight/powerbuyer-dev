<script setup>
import { ref } from "vue";
import { useQuery } from "vue-query";
import axios from "axios";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { useRoute, useRouter } from "vue-router";
const searchText = ref("");
const router = useRouter();
const route = useRoute();
const { data: vendors, isLoading } = useQuery("vendors", () =>
  axios.get("/vendors").then((res) => res.data?.data)
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
  const index = findTabIndex(vendor.id);
  if (index === -1) {
    tablist.value.push(vendor);
  }
};
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
        overflow-auto overflow-x-hidden
        bg-white
      "
    >
      <!-- List search & filters -->
      <div class="sticky top-0 p-3 bg-white">
        <div>{{ $route.name }}</div>
        <div class="flex">
          <div class="mr-3">
            <n-input
              v-model:value="searchText"
              round
              clearable
              placeholder="Search..."
            />
          </div>
          <div>
            <n-button type="primary">Filter</n-button>
          </div>
        </div>
        <!-- Filter Component -->
      </div>
      <!-- Main Loop List -->
      <div class="">
        <ul v-if="!isLoading">
          <!-- Loop List-->
          <li
            v-for="vendor in vendors"
            :key="vendor?.id"
            class="p-2 border-b-2"
            @click="addTab(vendor)"
          >
            <!-- Company Name -->
            <router-link
              :to="{ name: 'SingleVendor', params: { id: vendor?.id } }"
              active-class="text-emerald-500"
              class="block"
            >
              {{ vendor?.name }}
            </router-link>
            <!-- City, State -->
            <!--						{{ vendor.city }}, {{ vendor.state }}-->
            <!-- Phone - Link Email -->
            <!--						{{ vendor.phone }} -	<a :href="`mailto:${vendor.email}`">{{ vendor.email }}</a>-->
          </li>
        </ul>
      </div>
    </div>
    <!-- Main Tabs App Content -->
    <div class="w-[calc(100vw-335px)] h-screen">
      <TabGroup>
        <div class="overflow-x-auto">
          <TabList
            class="flex p-1 gap-x-1 flex-nowrap bg-slate-300/20 min-w-max px-4"
          >
            <tab v-for="tab in tablist" :key="tab.id" class="relative">
              <router-link
                :to="{ name: 'SingleVendor', params: { id: tab?.id } }"
                custom
                v-slot="{ href, route, navigate, isActive }"
              >
                <a
                  :href="href"
                  @click="navigate"
                  class="max-w-md block overflow-hidden p-2 rounded pr-6"
                  :class="[
                    isActive
                      ? 'bg-emerald-300 text-emerald-700'
                      : 'bg-slate-400/60',
                  ]"
                >
                  {{ tab?.name }}
                </a>
              </router-link>
              <span
                class="
                  absolute
                  right-0
                  inset-y-0
                  flex
                  z-10
                  pr-1
                  items-center
                  bg-gradient-to-l
                "
                @click="closeTab(tab.id)"
                :class="[tablist.length === 1 && 'hidden']"
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
            </tab>
          </TabList>
        </div>
      </TabGroup>
      <!-- Main Body Content-->
      <div class="h-screen overflow-auto overflow-x-hidden bg-white">
        <router-view />
      </div>
    </div>
  </div>
</template>
