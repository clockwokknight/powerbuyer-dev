<script setup>
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import {
  onMounted,
  ref,
  watch,
  nextTick,
  onUpdated,
  onBeforeUnmount,
} from "vue";
import axios from "axios";
import { useDebounceFn } from "@vueuse/core";
import { useTabsViewStore } from "@/store/tabs";
import { useRoute, useRouter } from "vue-router";
import { useMutation, useQueryClient } from "vue-query";
import { getPageTabs } from "@/hooks/pageTabs";

const tabStore = useTabsViewStore();
const props = defineProps(["pageName"]);
const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();

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
}, 100);

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

const { data: pageTabs, isLoading: isPageTabLoading } = getPageTabs({
  pageName: props.pageName,
});
const { mutate: createPageTab } = useMutation(
  (data) => axios.post("/user_ui_tabs/create", data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["pageTabs", props.pageName]);
    },
  }
);
const { mutate: updatePageTab } = useMutation(
  (data) => axios.post("/user_ui_tabs/update", data).then((res) => res.data),
  {
    onSuccess(data) {
      queryClient.setQueryData(["pageTabs", props.pageName], () => data);
    },
  }
);

watch(
  () => isPageTabLoading.value,
  (newValue) => {
    if (!newValue) {
      if (pageTabs.value === "") {
        createPageTab({
          user_id: 1,
          page: props.pageName,
          tabs: JSON.stringify([]),
        });
      } else {
        tabStore.initTabs(JSON.parse(pageTabs.value.tabs));
        if (tabStore.tabs.length >= 1 && route.path === `/${props.pageName}`) {
          tabStore.tabs.forEach((tab) => {
            if (tab.active) {
              router.push(`/${props.pageName}/${tab.id}`);
            }
          });
        }
      }
    }
  },
  { immediate: true }
);

const syncTabs = useDebounceFn((data) => {
  updatePageTab(data);
}, 1000);

tabStore.$onAction(({ name, store, after, args }) => {
  after(() => {
    if (name === "addTab" || name === "closeTab") {
      syncTabs({
        user_id: 1,
        page: props.pageName,
        tabs: JSON.stringify(store.tabs),
      });
    }
    if (name !== "findTabIndex") {
      ifScrollArrowNeeded();
      scrollTabToView();
    }
  });
});

const closeTab = (id) => {
  console.log("closing");
  tabStore.closeTab(id);
  if (tabStore.tabs.length === 0) {
    router.push("/" + props.pageName);
  }
};

const tabChanged = (index) => {
  tabStore.tabs = tabStore.tabs.map(({ active, ...rest }, i) => {
    if (i === index) {
      return { ...rest, active: true };
    } else return rest;
  });
};

watch(
  () => tabStore.selectedIndex,
  (newValue) => {
    if (
      newValue !== -1 &&
      parseInt(route.params?.id) !== tabStore.tabs[newValue].id
    ) {
      router.push(`/${props.pageName}/${tabStore.tabs[newValue].id}`);
    }
  }
);

const scrollTabToView = useDebounceFn(() => {
  const tabListChildren = tabListButton.value?.children;
  if (tabListChildren && tabStore.selectedIndex !== -1)
    tabListChildren[tabStore?.selectedIndex]?.scrollIntoView({
      behavior: "smooth",
    });
}, 100);
</script>

<template>
  <TabGroup :selected-index="tabStore.selectedIndex" @change="tabChanged">
    <header class="relative flex items-end" ref="tabListButtonWrapper">
      <div
        class="flex h-[62px] items-end overflow-x-hidden bg-[#F8F8FA]"
        ref="scrollWrapper"
      >
        <TabList>
          <nav ref="tabListButton" class="flex min-w-max flex-nowrap gap-x-2">
            <template
              v-for="tab in tabStore.tabs"
              v-if="tabStore.tabs.length >= 1"
              :key="tab?.id"
            >
              <router-link
                :to="`/${props.pageName}/${tab?.id}`"
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
</template>
