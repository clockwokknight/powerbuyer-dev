<script setup>
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import { useGlobalState } from "@/store/global";

const global = useGlobalState();
const emits = defineEmits(["click"]);
const props = defineProps(["items", "type"]);

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

const active = ref(0);
const tabItems = computed(() => props.items || exampleItems.value);
</script>

<template>
  <div
    id="__scrollable"
    class="__tabs h-[60px] px-4 w-full flex overflow-x-auto overflow-y-hidden"
  >
    <div
      v-for="(item, index) in tabItems"
      :key="index"
      class="__tab-item h-full max-w-lg text-center flex flex-col justify-center items-center px-1 cursor-pointer whitespace-nowrap"
      :class="type === 'basic' ? 'mx-4' : 'pl-0'"
      @click="
        (e) => {
          $emit('click', item.value);
          active = index;
        }
      "
    >
      <span class="__tab-title flex tracking-widest font-bold text-xs">
        <span
          :class="
            type !== 'basic' && active === index
              ? 'bg-primarylight text-primary py-2 pl-6 pr-0 rounded-lg mr-6 duration-300 hover:scale-[0.96]'
              : 'bg-transparent text-black py-2 px-3 rounded-lg mr-0 duration-300'
          "
        >
          {{ item.title }}
          <b
            v-if="type !== 'basic'"
            class="__close-tab duration-200 text-red-600 ml-2 opacity-0 scale-50 hover:text-red-900"
            @click="global.closeTab(index)"
            >X</b
          >
        </span>
      </span>
      <div
        v-if="type === 'basic'"
        class="__indicator duration-200 h-1 bg-transparent translate-y-[10px]"
        :class="`${active === index ? '!w-12 !bg-primary' : 'w-0 bg-gray-300'}`"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.__tab-title:hover .__close-tab {
  opacity: 1 !important;
  @apply scale-100 mr-5;
}
.__indicator {
  border-radius: 24px 24px 0px 0px;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
.__tab-item:hover .__indicator {
  @apply w-12;
}
</style>
