<script setup>
import { ref, computed, onMounted, watch, toRef } from "vue";
import { useRoute } from "vue-router";
import { useDebounce } from "@vueuse/core";
import { useGlobalState } from "@/store/global";
import dayjs from "dayjs";
import axios from "axios";

const message = useMessage();
const queryClient = useQueryClient();
const route = useRoute();

defineProps(["active", "title"]);
</script>
<template>
  <n-button @click="active = true">
    <n-icon>
      <svg viewBox="0 0 24 24">
        <path
          d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
          fill="currentColor"
        ></path>
      </svg>
    </n-icon>
    Create Expense
  </n-button>
  <n-drawer v-model:show="active" :width="500">
    <n-drawer-content :title="title || 'Drawer Title'"> </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss">
.n-dynamic-input.custom-dynamic-input {
  .n-dynamic-input-item {
    --action-margin: 10px 0 0 0;
    @apply flex-col;
    &__action {
      align-self: flex-end;
    }
  }
}
</style>
