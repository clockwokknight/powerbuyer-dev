<script setup>
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useMutation } from "vue-query";
import { useGlobalState } from "@/store/global";
import { objectFilter, omit, pick } from "@/lib/helper";
import { getExpensesByVendor } from "@/hooks/expense";
import { NTag, NButton, useMessage } from "naive-ui";
import { useQueryClient } from "vue-query";
import axios from "axios";
import dayjs from "dayjs";

import ActionButtons from "@/components/vendor/ActionButtons.vue";

defineProps(["columns", "", ""]);

const global = useGlobalState();
const route = useRoute();
const message = useMessage();

const pagination = { pageSize: 10 };
const visibleEditForm = ref(false);
const formRow = ref(null);
</script>

<template>
  <div id="expenses" class="scroll-smooth">
    <div class="-mt-4 font-sans">
      <div class="flex translate-y-[68px] items-center justify-end pr-10"></div>

      <div class="rounded-round border-2 bg-white py-8 px-8">
        <div><p class="pb-8 text-2xl font-bold">Expenses</p></div>
        <n-data-table
          class="rounded-round"
          striped
          :columns="columns"
          :data="expensesData?.pages[0]"
          :pagination="pagination"
          :bordered="false"
          :loading="expensesDataLoading"
          :row-key="rowKey"
        />
      </div>
    </div>
  </div>
</template>
