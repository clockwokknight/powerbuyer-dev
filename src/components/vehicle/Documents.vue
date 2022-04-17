<script setup>
import axios from "axios";
import ActionButtons from "@/components/vehicle/DocumentActionButtons.vue";
import { h, ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { utils, log } from "@/lib/utils";
import { fetchById } from "@/hooks";
import { useGlobalState } from "@/store/global";

const columns = [
  {
    title: "TITLE",
    key: "title",
    //fixed: 'left'
  },
  {
    title: "DESCRIPTION",
    key: "description",
    //fixed: 'left'
  },
  {
    title: "TYPE",
    key: "type",
    //fixed: 'left'
  },
  {
    title: "",
    fixed: "right",
    render(row) {
      return h(ActionButtons, {
        // onClick: () => console.log(row),
        onDelete: () => console.log("delete"),
        onView: () => console.log("view"),
      });
    },
  },
];

const global = useGlobalState();
const route = useRoute();

const { documents, isLoading } = {
  documents: [
    {
      title: "Driver's License",
      description: "description",
      type: "license",
    },
    {
      title: "Driver's License",
      description: "description",
      type: "license",
    },
  ],
  isLoading: false,
};

const handleScan = () => {

}

const handleUpload = () => {

}
</script>

<template>
  <div
    class="rounded-round dark:bg-foreground_dark w-full border-[1px] bg-white p-[24px] dark:border-0"
  >
    <n-button class="w-[220px]" @click="handleScan">
      SCAN NEW
    </n-button>
    <n-button class="w-[220px]" @click="handleUpload">
      UPLOAD NEW
    </n-button>

    <n-data-table
      class="rounded-round mt-[24px]"
      :columns="columns"
      :data="documents"
      :loading="isLoading"
      :pagination="pagination"
      :bordered="false"
      :max-height="400"
      :scroll-x="900"
    />
  </div>
</template>

<style scoped></style>
