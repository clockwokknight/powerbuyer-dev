<script setup>
import { ref, reactive, defineEmits, defineProps, computed, onMounted } from "vue";

const emits = defineEmits(["click"]);

const props = defineProps(["items"]);

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

onMounted(() => {
  console.log("tabs mounted");
});
</script>

<template>
  <div class="__tabs h-[60px] px-4 w-full flex">
    <div
      v-for="(item, index) in tabItems"
      :key="index"
      class="__tab-item h-full max-w-md text-center flex flex-col justify-center items-center px-1 mx-4 cursor-pointer"
      @click="
        (e) => {
          $emit('click', item.value);
          active = index;
        }
      "
    >
      <span class="tracking-widest font-bold text-xs">{{ item.title }}</span>
      <div
        class="__indicator duration-200 h-1 bg-transparent translate-y-[19px]"
        :class="active === index ? '!w-16 !bg-primary' : 'w-0 bg-gray-300'"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.__indicator {
  border-radius: 24px 24px 0px 0px;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
.__tab-item:hover .__indicator {
  @apply w-16;
}
</style>
