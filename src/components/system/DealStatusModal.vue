<script setup>
import ActionButtons from "@/components/common/ActionButtons.vue";
import { objectFilter } from "@/lib/helper";
import axios from "axios";
import { NButton } from "naive-ui";
import { h, ref, unref, watch } from "vue";
import { useQuery, useQueryClient } from "vue-query";

const queryClient = useQueryClient();

const showEditModal = ref(false);
const showModal = ref(false);
const formRef = ref(null);
const editingDealStatus = ref({
  name: "",
  description: "",
});
const isEditing = ref(false);

const { data: dealStatus, isLoading } = useQuery("deal_status", () =>
  axios.get("/deal_status").then((res) => res.data)
);

const columns = [
  {
    title: "Name",
    key: "name",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "Description",
    key: "description",
    width: 300,
    //fixed: 'left'
  },
  {
    title: "Action",
    key: "actions",
    width: 100,
    render(row) {
      return h(ActionButtons, {
        onEdit: () => {
          isEditing.value = true;
          showEditModal.value = true;
          editingDealStatus.value = row;
        },
        onDelete: async () => {
          await axios.delete(`/deal_status/${row.id}`);
          queryClient.invalidateQueries("deal_status");
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

const addRow = () => {
  showEditModal.value = true;
  isEditing.value = false;
  const newType = {
    name: "",
    description: "",
  };
  editingDealStatus.value = newType;
};

const onOkEditingModal = async () => {
  const obj = objectFilter(editingDealStatus.value, (key, value) => value);

  if (isEditing.value) {
    await axios.put(`/deal_status/${obj.id}`, obj);
  } else {
    await axios.post("/deal_status", obj);
  }
  queryClient.invalidateQueries("deal_status");
  showEditModal.value = false;
};
</script>
<template>
  <article>
    <div class="py-6 px-6" v-bind="$attrs" @click="showModal = true">
      <div class="mb-2 h-11 text-lg font-bold">Deal Status</div>
      <div class="h-10 pb-2 text-sm">Click to edit commission types.</div>
    </div>
    <n-modal
      preset="card"
      class="max-w-screen-md"
      title="Deal Status"
      v-model:show="showModal"
    >
      <div class="mb-5">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button @click="addRow">+</n-button>
          </template>
          Create a deal status
        </n-tooltip>
      </div>
      <n-data-table
        class="rounded-md"
        striped
        :columns="columns"
        :data="dealStatus"
        :bordered="false"
        :loading="isLoading"
      />
    </n-modal>
    <n-modal
      preset="card"
      :title="isEditing ? 'Edit Deal Status' : 'Add Deal Status'"
      class="max-w-[600px]"
      v-model:show="showEditModal"
    >
      <n-form
        :model="editingDealStatus"
        :rules="rules"
        ref="formRef"
        class="grid grid-cols-12 gap-2"
      >
        <div class="col-span-6 md:col-span-4">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="editingDealStatus.name" />
          </n-form-item>
        </div>
        <div class="col-span-12 md:col-span-12">
          <n-form-item label="Description">
            <n-input
              placeholder="Description"
              v-model:value="editingDealStatus.description"
              type="textarea"
            />
          </n-form-item>
        </div>
      </n-form>

      <template #footer>
        <n-button size="large" @click="onOkEditingModal">Submit</n-button>
      </template>
    </n-modal>
  </article>
</template>
