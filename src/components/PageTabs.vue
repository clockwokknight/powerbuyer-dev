<script setup>
import axios from "axios";
import { utils, log } from "@/lib/utils";
import { nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMutation, useQueryClient } from "vue-query";
import { useDebounceFn } from "@vueuse/core";
import { getPageTabs } from "@/hooks/pageTabs";
import { useTabsViewStore } from "@/store/tabs";
import { useGlobalState } from "@/store/global";
import { Tab, TabGroup, TabList } from "@headlessui/vue";

const props = defineProps({
  pageName: String,
  hasHome: Boolean,
});

const global = useGlobalState();
const tabStore = useTabsViewStore();

const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();

const tabListButton = ref(null);
const tabListButtonWrapper = ref(null);
const scrollWrapper = ref(null);
const showScrollArrow = ref(false);

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
  (data) => axios.post("/user_ui_tabs/update", data).then((res) => res.data), // TODO : save tabs in local storage
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
        // if (tabStore.tabs.length >= 1 && route.path === `/${props.pageName}`) {
        //   tabStore.tabs.forEach((tab) => {
        //     if (tab.active) {
        //       router.push(`/${props.pageName}/${tab.id}`);
        //     }
        //   });
        // }
        ifScrollArrowNeeded();
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
  });
});

const closeTab = (id) => {
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
  syncTabs({
    user_id: 1,
    page: props.pageName,
    tabs: JSON.stringify(tabStore.tabs),
  });
};

watch(
  () => tabStore.selectedIndex,
  (newValue) => {
    scrollTabToView();
    if (
      newValue !== -1 &&
      route.path !== props.pageName &&
      route.params?.id !== tabStore.tabs[newValue]?.id
    ) {
      console.log(newValue);
      router.push(`/${props.pageName}/${tabStore.tabs[newValue]?.id}`);
    }
  }
);

watch(
  () => route.params?.id,
  (val) => {
    if (utils.getKeys(global.latest).includes(props.pageName)) {
      console.log(val);
      console.log(
        route.path,
        "===",
        props.pageName,
        route.path === props.pageName
      );
      console.log(`setting latest for ${props.pageName}: ${val}`);
      global.setLatest(val, props.pageName);
      tabChanged(tabStore.selectedIndex);
    }
  }
);

const scrollTabToView = useDebounceFn(async () => {
  await nextTick();
  const tabListChildren = tabListButton.value?.children;
  if (tabListChildren && tabStore.selectedIndex !== -1)
    tabListChildren[tabStore?.selectedIndex]?.scrollIntoView({
      behavior: "smooth",
    });
}, 500);

// getting the tab width before leaving for transition
const width = ref("");

const beforeLeaveTab = (el) => {
  width.value = `${el.getBoundingClientRect().width}px`;
};

const afterAnimated = () => {
  ifScrollArrowNeeded();
  scrollTabToView();
};
</script>

<template>
  <TabGroup :selected-index="tabStore.selectedIndex" @change="tabChanged">
    <header
      class="z-80 relative h-[88px] pl-2 pr-[calc(0.5rem+5px)] pt-2 md:pl-6 md:pr-[calc(1.5rem+5px)] md:pt-6"
    >
      <div
        class="__tabs relative flex h-[64px] items-center rounded bg-foreground_light dark:bg-foreground_dark"
        :class="global.stuck[0] && 'shadow-lg'"
        ref="tabListButtonWrapper"
      >
        <!-- home tab -->
        <router-link
          v-if="hasHome"
          :to="`/${props.pageName}`"
          class="px-[24px] duration-[250ms] active:scale-[0.8]"
          :style="
            route.path == `/${props.pageName}`
              ? 'color: #007AFF'
              : 'color: white'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            class="h-[18px] w-[18px]"
          >
            <g>
              <path
                d="M10.55 2.533a2.25 2.25 0 0 1 2.9 0l6.75 5.695c.508.427.8 1.056.8 1.72v9.802a1.75 1.75 0 0 1-1.75 1.75h-3a1.75 1.75 0 0 1-1.75-1.75v-5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v5a1.75 1.75 0 0 1-1.75 1.75h-3A1.75 1.75 0 0 1 3 19.75V9.947c0-.663.292-1.292.8-1.72l6.75-5.694z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </router-link>
        <div
          v-if="hasHome"
          class="h-[36px] w-[2px] bg-background_light dark:bg-dark_border"
        ></div>
        <div
          ref="scrollWrapper"
          style="scrollbar-width: none"
          class="flex items-center overflow-x-auto scrollbar:h-0 scrollbar:w-0"
        >
          <TabList v-slot="{ selectedIndex }">
            <nav
              ref="tabListButton"
              class="flex min-w-max flex-nowrap"
              :class="!hasHome && 'pl-6'"
            >
              <TransitionGroup
                name="fade"
                @before-leave="beforeLeaveTab"
                @after-leave="afterAnimated"
                @after-enter="afterAnimated"
              >
                <div
                  class="group relative grid select-none place-content-center overflow-hidden rounded-round duration-[100ms] active:scale-[0.95]"
                  v-show="tabStore.tabs.length >= 1"
                  v-for="(tab, tabIdx) in tabStore.tabs"
                  :key="tab?.id"
                >
                  <router-link
                    :to="`/${props.pageName}/${tab?.id}`"
                    custom
                    v-slot="{ href, navigate, isActive }"
                  >
                    <tab
                      class="relative max-w-xs scroll-mr-3 focus:outline-none"
                      :class="[
                        tabIdx === selectedIndex && route.params?.id
                          ? 'bg-accent font-medium text-primary before:absolute before:inset-y-0 before:left-0 before:h-full before:w-1 before:bg-primary focus:outline-none'
                          : 'font-medium text-black/75 dark:text-white',
                      ]"
                    >
                      <a
                        :href="href"
                        @click="navigate"
                        class="block max-w-[250px] overflow-hidden truncate whitespace-nowrap py-2 pl-6 pr-6 text-xs transition-all focus:outline-none group-hover:pr-9"
                        :class="[isActive ? 'pr-9' : 'pr-9']"
                      >
                        {{ tab?.name }}
                      </a>
                    </tab>
                  </router-link>
                  <span
                    class="absolute inset-y-0 right-0 top-[1px] z-10 flex cursor-pointer items-center pr-3.5 transition-all"
                    @click.stop="closeTab(tab.id)"
                  >
                    <svg
                      class="cubic-timing-tab h-2 w-2 text-red-500 transition-transform duration-300 group-hover:scale-100"
                      :class="[
                        tabIdx === selectedIndex && route.params?.id
                          ? 'scale-100'
                          : 'scale-0',
                      ]"
                      viewBox="0 0 11 11"
                      fill="none"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.00007 9.72795L9.72803 1"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                      <path
                        d="M9.72844 9.72795L1.00049 1"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                    </svg>
                  </span>
                </div>
              </TransitionGroup>
            </nav>
          </TabList>
        </div>

        <div class="flex h-[48px]">
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
            class="grid w-8 place-content-center px-1 hover:text-[#027bff]"
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
      </div>
    </header>
  </TabGroup>
</template>

<style scoped>
/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-to {
  opacity: 1;
  transform: scaleX(1) translateX(0);
}
/* 2. declare enter from and leave to state */
.fade-enter-from {
  opacity: 0;
  transform: scaleX(0.01) translateX(-30px);
}
.fade-leave-from {
  opacity: 1;
  width: v-bind(width);
}
.fade-leave-to {
  opacity: 0;
  width: 0;
}
</style>
