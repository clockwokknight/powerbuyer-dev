<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useGlobalState } from "@/store/global";

const global = useGlobalState();
const emits = defineEmits(["click"]);
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

const tabItems = computed(() => props.items || exampleItems.value);

watch(
  () => global.activateTab,
  (val) => {
    if (props.type === "basic") active.value = val;
  }
);
</script>

<template>
  <div
    id="__scrollable"
    class="__tabs flex h-[60px] w-full overflow-x-auto overflow-y-hidden px-4"
  >
    <div
      v-for="(item, index) in tabItems"
      :key="index"
      class="__tab-item flex h-full max-w-lg cursor-pointer flex-col items-center justify-center whitespace-nowrap px-1 text-center"
      :class="type === 'basic' ? 'mx-4' : 'pl-0'"
      @click="
        (e) => {
          $emit('click', item.value);
          active = index;
        }
      "
    >
      <span class="__tab-title flex text-xs font-bold tracking-widest">
        <span
          :class="
            type !== 'basic' && active === index
              ? 'mr-6 rounded-round bg-accent py-2 pl-6 pr-0 text-primary duration-300 hover:scale-[0.96]'
              : 'mr-0 rounded-round bg-transparent py-2 px-3 text-black dark:text-white duration-300'
          "
        >
          {{ item.title }}
        </span>
      </span>
      <div
        v-if="type === 'basic'"
        class="__indicator h-1 translate-y-[12px] bg-transparent duration-200"
        :class="`${active === index ? '!w-12 !bg-primary' : 'w-0 bg-gray-300'}`"
      ></div>
    </div>
  </div>
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
