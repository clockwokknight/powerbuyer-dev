<script setup>
import { ref, h } from "vue";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import ActionButtons from "@/components/common/ActionButtons.vue";
import { getLaneReports } from "@/hooks/lanes";

const showModal = ref(false);
const showEditModal = ref(false);
const formRef = ref(null);
const queryClient = useQueryClient();

const editingLaneReport = ref({
  name: "",
});
const { data: lanes_reports } = getLaneReports();
const columns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Action",
    key: "actions",
    width: 150,
    render(row) {
      return h(ActionButtons, {
        onEdit: () => {
          showEditModal.value = true;
          editingLaneReport.value = { id: row.id, name: row.name };
        },
        onDelete: async () => {
          await axios.delete(`/lanes_reports/${row.id}`);
          await queryClient.invalidateQueries("lanes_reports");
        },
      });
    },
  },
];

const rules = {
  name: {
    required: true,
    message: "Name is required",
    trigger: "input",
  },
};
const { mutate, isLoading: editingLaneReportLoading } = useMutation(
  (data) =>
    axios.put("/lanes_reports/" + data.id, {
      name: data.name,
    }),
  {
    onSuccess() {
      queryClient.invalidateQueries("lanes_reports");
      showEditModal.value = false;
    },
  }
);
const onOkEditingModal = async () => {
  try {
    await formRef.value.validate();

    mutate(editingLaneReport.value);
  } catch {}
};
</script>

<template>
  <article>
    <div class="py-6 px-6" @click="showModal = true">
      <div class="mb-2 h-11 text-lg font-bold">Lane Report</div>
      <div class="h-10 pb-2 text-sm">click edit/delete Lane Report</div>
    </div>
    <n-modal
      v-model:show="showModal"
      class="max-w-screen-md"
      preset="card"
      title=""
    >
      <n-data-table
        :columns="columns"
        :data="lanes_reports"
        class="rounded-md"
      />
    </n-modal>
    <n-modal
      class="max-w-[600px]"
      preset="card"
      v-model:show="showEditModal"
      title="Edit Lane Report"
    >
      <n-form ref="formRef" :model="editingLaneReport" :rules="rules">
        <n-form-item path="name" label="Name">
          <n-input v-model:value="editingLaneReport.name" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button
          size="large"
          :loading="editingLaneReportLoading"
          @click="onOkEditingModal"
          >Submit</n-button
        >
      </template>
    </n-modal>
  </article>
</template>
