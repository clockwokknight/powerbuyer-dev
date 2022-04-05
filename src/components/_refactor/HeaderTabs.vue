<script setup>
import { ref, computed, onMounted, watch, toRef, toRaw, onUpdated } from "vue";
import { useGlobalState } from "@/store/global";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { Tab, TabGroup, TabList } from "@headlessui/vue";
import Card from "@/components/_refactor/Card.vue";
import { gsap } from "gsap";

const global = useGlobalState();

const props = defineProps({
  title: String,
  items: Array,
  range: Array,
  search: Boolean,
});

defineEmits(["selected", "dateChanged", "searchTextChange"]);

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
  /*const tabListHeight = 180;
  console.log({ tabListHeight });
  if (props.items) {
    props.items.forEach((item, index) => {
      const itemSelector = document.querySelector(item.value);
      ScrollTrigger.create({
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
  }
  gsap.to("#main", { scrollTo: 0 });*/
});

onUpdated(() => {
  ScrollTrigger.refresh();
});

const tabItems = computed(() => props.items || exampleItems.value);

const query = ref("");

const scrollToSection = (item, index) => {
  shouldDisableScroll.value = true;
  gsap.to("#main", {
    scrollTo: {
      y: toRaw(item).value,
      offsetY: 60,
    },
    onComplete() {
      shouldDisableScroll.value = false;
    },
  });
};
</script>

<template>
  <Card class="pb-0">
    <div class="flex w-full justify-between">
      <h1 class="font-bold text-2xl">{{ title }}</h1>
      <n-input
        v-if="search"
        v-model="query"
        @change="(value) => $emit('searchTextChange', value)"
        placeholder="Search by vin..."
        class="mx-[24px] max-w-[550px] translate-y-[-40px] bordered dark:!border-[#45454C dark:bg-[#191919] bg-[#f6f6f6] p-2"
      />
      <div class="w-[250px]">
        <n-date-picker
          clearable
          :format="'MM/dd/yy'"
          v-model:value="range"
          type="datetimerange"
          @update:value="(value) => $emit('dateChanged', value)"
        />
        <!--pre>{{ JSON.stringify(range) }}</pre-->
      </div>
    </div>
    <TabGroup class="flex" :selected-index="active">
      <TabList
        class="subTabList flex items-end h-[120px] w-full overflow-x-auto overflow-y-hidden px-4"
      >
        <Tab
          v-for="(item, index) in tabItems"
          :key="index"
          class="__tab-item uppercase translate-y-[-18px] flex max-w-lg cursor-pointer flex-col items-center justify-center whitespace-nowrap px-1 text-center mx-4"
          v-slot="{ selected }"
          @click="$emit('selected', item, index)"
        >
          <span
            class="__tab-title flex text-[10px] font-bold tracking-widest hover:!opacity-100"
          >
            <span :class="`${!selected && 'font-bold opacity-30'}`">
              {{ item?.title }}
            </span>
          </span>
          <span
            class="__indicator h-1 translate-y-[19px] duration-200"
            :class="`${selected ? 'w-6 bg-primary' : 'w-0 bg-gray-300 dark:bg-primary'}`"
          ></span>
        </Tab>
      </TabList>
    </TabGroup>
  </Card>
</template>

<style lang="scss">
.__indicator {
  border-radius: 24px 24px 0 0;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
.__tab-item:hover .__indicator {
  @apply w-6;
}
.n-input-wrapper {
  //font-size: 8px !important;
}
</style>
