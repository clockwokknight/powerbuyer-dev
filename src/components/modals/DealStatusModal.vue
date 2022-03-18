<script setup>
import ActionButtons from "@/components/common/ActionButtons.vue";
import axios from "axios";
import { NButton } from "naive-ui";
import { h, ref, watch } from "vue";
import { useQuery } from "vue-query";

const showEditModal = ref(false);
const showModal = ref(false);
const editingDealStatus = ref({
  active: 1,
  name: "",
  description: "",
});
const isEditing = ref(false);

const { data: dealStatus } = useQuery("deal_status", () =>
  axios.get("/deal_status").then((res) => res.data)
);
const getDealStatus = () => {
  axios
    .get("/deal_status")
    .then((res) => {
      dealStatus.value = res.data;
      console.log("dealStatus: ", dealStatus.value);
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(showModal, (newValue) => {
  if (newValue) {
    getDealStatus();
  }
});

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
        },
      });
    },
  },
];

const addRow = () => {
  showEditModal.value = true;
  isEditing.value = false;
  const newType = {
    active: 1,
    name: "",
    description: "",
  };
  editingDealStatus.value = newType;
};

const onCancelEditingModal = () => {
  showEditModal.value = false;
};

const onOkEditingModal = async () => {
  if (isEditing.value) {
    await axios.put(
      `/deal_status/${editingDealStatus.value.id}`,
      editingDealStatus.value
    );
  } else {
    await axios.post("/deal_status", editingDealStatus.value);
  }
  getDealStatus();
  showEditModal.value = false;
};
</script>
<template>
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
    <div class="mb-5 ml-auto w-fit">
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
      :loading="paymentDataLoading"
    />
  </n-modal>
  <n-modal
    preset="card"
    :title="isEditing ? 'Edit Deal Status' : 'Add Deal Status'"
    class="max-w-[600px]"
    v-model:show="showEditModal"
  >
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-6 md:col-span-4">
        <n-form-item label="Name">
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
    </div>

    <template #footer>
      <n-button size="large" @click="onOkEditingModal">Submit</n-button>
    </template>
  </n-modal>
</template>
