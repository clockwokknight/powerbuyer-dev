<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import { NButton } from "naive-ui";

const props = defineProps(["show"]);
const emit = defineEmits(["onReturn"]);

const dealStatus = ref([]);
const showEditModal = ref(false);
const editingDealStatus = ref({
  active: 1,
  name: "",
  description: "",
  created_at: null,
  updated_at: null,
  deleted_at: null,
});
const isEditing = ref(false);

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

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      getDealStatus();
    }
  }
);

const onRemoveDealStatus = (index) => {
  dealStatus.value.slice(index, 1);
};

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
    width: 150,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            onClick: () => {
              isEditing.value = true;
              showEditModal.value = true;
              editingDealStatus.value = row;
            },
          },
          { default: () => "Edit" }
        ),
        h(
          NButton,
          {
            size: "small",
            onClick: async () => {
              await axios.delete(`/deal_status/${row.id}`);
              getDealStatus();
            },
          },
          { default: () => "Delete" }
        ),
      ];
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
    created_at: null,
    updated_at: null,
    deleted_at: null,
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
  <n-modal v-model:show="show">
    <n-card
      style="width: 800px"
      title="Deal Status"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra></template>
      <n-data-table
        class="rounded-md"
        striped
        :columns="columns"
        :data="dealStatus"
        :bordered="false"
        :loading="paymentDataLoading"
        :row-key="rowKey"
      />
      <template #footer>
        <div class="flex flex-row justify-between">
          <n-button size="large" @click="addRow">Add...</n-button>
          <n-button size="large" @click="$emit('onReturn')">Cancel</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showEditModal">
    <n-card
      class="w-[600px]"
      :title="isEditing ? 'Edit Deal Status' : 'Add Deal Status'"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra></template>

      <div class="grid grid-cols-12 gap-2">
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Name"
            v-model:value="editingDealStatus.name"
            style="margin-right: 12px"
          />
        </div>
        <div class="col-span-12 md:col-span-12">
          <n-input
            placeholder="Description"
            v-model:value="editingDealStatus.description"
            type="textarea"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex flex-row gap-[10px]">
          <n-button size="large" @click="onOkEditingModal">OK</n-button>
          <n-button size="large" @click="onCancelEditingModal">Cancel</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
