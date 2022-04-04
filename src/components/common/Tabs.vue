<script setup>
import { ref, computed, onMounted, watch, toRef, toRaw, onUpdated } from "vue";
import { useGlobalState } from "@/store/global";
import { Tab, TabGroup, TabList } from "@headlessui/vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { useDebounceFn } from "@vueuse/core";

const global = useGlobalState();
const props = defineProps(["items", "type"]);
const active = ref(0);

const exampleItems = ref([
  {
    title: "Tab 1",
    value: "1",
  },
  {
    title: "Tab 2",
    value: "2",
  },
  {
    title: "Tab 3",
    value: "3",
  },
  {
    title: "Tab 4",
    value: "4",
  },
]);

const shouldDisableScroll = ref(false);

onMounted(() => {
  const tabListHeight = document.querySelector(".subTabList").offsetHeight;

  props.items.forEach((item, index) => {
    const itemSelector = document.querySelector(item.value);
    ScrollTrigger?.create({
      scroller: "#main",
      trigger: itemSelector,
      start: () => "top 60px",
      end: () => "bottom 60px",
      onEnter: () => {
        if (!shouldDisableScroll.value) active.value = index;
      },
      onEnterBack: () => {
        if (!shouldDisableScroll.value) active.value = index;
      },
    });
  });
  gsap.to("#main", { scrollTo: 0 });
});

onUpdated(() => {
  ScrollTrigger.refresh();
});

const tabItems = computed(() => props.items || exampleItems.value);
const throttleDisableScroll = useDebounceFn(() => {
  shouldDisableScroll.value = false;
}, 1000);
const scrollToSection = (item, index) => {
  shouldDisableScroll.value = true;
  gsap.to("#main", {
    scrollTo: {
      y: toRaw(item).value,
      offsetY: 60,
    },
    onComplete: throttleDisableScroll,
  });
};
</script>

<template>
  <TabGroup :selected-index="active">
    <TabList
      class="__tabs subTabList flex h-[60px] w-full overflow-x-auto overflow-y-hidden px-4"
    >
      <Tab
        v-for="(item, index) in tabItems"
        :key="index"
        class="__tab-item flex h-full max-w-lg cursor-pointer flex-col items-center justify-center whitespace-nowrap px-1 text-center"
        :class="type === 'basic' ? 'mx-4' : 'pl-0'"
        v-slot="{ selected }"
        @click="scrollToSection(item, index)"
      >
        <span
          class="__tab-title flex text-xs font-bold tracking-widest hover:!opacity-100"
        >
          <span :class="`${!selected && 'font-medium opacity-30'}`">
            {{ item.title }}
          </span>
        </span>
        <span
          class="__indicator h-1 translate-y-[19px] duration-200"
          :class="`${selected ? 'bg-primary w-12' : 'dark:bg-primary w-0 bg-gray-300'}`"
        ></span>
      </Tab>
    </TabList>
  </TabGroup>
</template>

<style scoped>
.__indicator {
  border-radius: 24px 24px 0 0;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
.__tab-item:hover .__indicator {
  @apply w-12;
}
</style>
