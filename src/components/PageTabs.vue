<script setup>
import { getPageTabs } from "@/hooks/pageTabs";
import { useTabsViewStore } from "@/store/tabs";
import { Tab, TabGroup, TabList } from "@headlessui/vue";
import { useDebounceFn } from "@vueuse/core";
import axios from "axios";
import { nextTick, ref, watch } from "vue";
import { useMutation, useQueryClient } from "vue-query";
import { useRoute, useRouter } from "vue-router";

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
};

watch(
  () => tabStore.selectedIndex,
  (newValue) => {
    scrollTabToView();
    if (
      newValue !== -1 &&
      parseInt(route.params?.id) !== tabStore.tabs[newValue].id
    ) {
      router.push(`/${props.pageName}/${tabStore.tabs[newValue].id}`);
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

/**
 *
 * getting the tab width before leaving for transition
 */
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
    <header class="relative z-40 h-[80px] pl-2 md:pl-6 pr-[calc(0.5rem+5px)] md:pr-[calc(1.5rem+5px)] pt-2 md:pt-6">
      <div
        class="relative flex h-[62px] items-center rounded bg-white dark:bg-[#25272A] shadow-lg"
        ref="tabListButtonWrapper"
      >
        <div
          class="flex items-center overflow-x-auto scrollbar:h-0 scrollbar:w-0"
          ref="scrollWrapper"
        >
          <TabList v-slot="{ selectedIndex }">
            <nav
              ref="tabListButton"
              class="flex min-w-max flex-nowrap gap-x-2 pl-5"
            >
              <TransitionGroup
                name="fade"
                @before-leave="beforeLeaveTab"
                @after-leave="afterAnimated"
                @after-enter="afterAnimated"
              >
                <div
                  v-for="(tab, tabIdx) in tabStore.tabs"
                  v-if="tabStore.tabs.length >= 1"
                  :key="tab?.id"
                  class="group relative grid select-none place-content-center overflow-hidden rounded-lg"
                >
                  <router-link
                    :to="`/${props.pageName}/${tab?.id}`"
                    custom
                    v-slot="{ href, route, navigate, isActive }"
                  >
                    <tab
                      class="relative max-w-xs scroll-mr-3 focus:outline-none"
                      :class="[
                        isActive
                          ? 'bg-primary/10  font-extrabold text-primary before:absolute before:inset-y-0 before:left-0 before:h-full before:w-1 before:bg-primary focus:outline-none'
                          : 'font-bold text-black/75 dark:text-white',
                      ]"
                    >
                      <a
                        :href="href"
                        @click="navigate"
                        class="block max-w-[250px] overflow-hidden truncate whitespace-nowrap py-2 pl-6 pr-6 text-xs transition-all focus:outline-none group-hover:pr-9"
                        :class="[isActive ? 'pr-9' : '']"
                      >
                        {{ tab?.name }}
                      </a>
                    </tab>
                  </router-link>
                  <span
                    class="absolute inset-y-0 right-0 top-[1px] z-10 flex cursor-pointer items-center transition-all group-hover:pr-3.5"
                    :class="[tabIdx === selectedIndex ? 'pr-3.5' : '']"
                    @click.stop="closeTab(tab.id)"
                  >
                    <svg
                      class="cubic-timing-tab h-3 w-3 text-red-500 transition-transform duration-300 group-hover:scale-100"
                      :class="[
                        tabIdx === selectedIndex ? 'scale-100' : 'scale-0',
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
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
