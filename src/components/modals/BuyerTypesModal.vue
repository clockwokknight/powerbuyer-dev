<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import { NButton } from "naive-ui";
import { getBuyerTypes } from "@/hooks/buyer.js";
import { useQueryClient } from "vue-query";

const showModal = ref(false);
const emit = defineEmits(["onReturn"]);
const queryClient = useQueryClient();

const showEditModal = ref(false);
const editingBuyerType = ref({
  active: 1,
  deleted_at: null,
  description: "",
  name: "",
  updated_at: null,
});
const isEditing = ref(false);

const { data: buyerTypes, isLoading: isBuyerTypeLoading } = getBuyerTypes();

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
      return h(ActionButtons, {
        showDeleteButton: true,
        onEdit: () => {
          isEditing.value = true;
          showEditModal.value = true;
          editingBuyerType.value = row;
        },
        onDelete: async () => {
          await axios.delete(`/buyer_type/${row.id}`);
          await queryClient.invalidateQueries("buyer_types");
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
    deleted_at: null,
    description: "",
    name: "",
    updated_at: null,
  };
  editingBuyerType.value = newType;
};

const onOkEditingModal = async () => {
  if (isEditing.value) {
    await axios.put(
      `/buyer_type/${editingBuyerType.value.id}`,
      editingBuyerType.value
    );
    await queryClient.invalidateQueries("buyer_types");
  } else {
    await axios.post("/buyer_type", editingBuyerType.value);
  }
  showEditModal.value = false;
};
</script>
<template>
  <div>
    <div class="cursor-pointer py-6 px-6" @click="showModal = true">
      <div class="mb-2 text-lg font-bold">Buyer Types</div>
      <div class="pb-2 text-sm">Click to edit commission types.</div>
    </div>

    <n-modal
      preset="card"
      class="max-w-screen-md"
      title="Buyer Types"
      v-model:show="showModal"
    >
      <div class="mb-5 ml-auto w-fit">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button @click="addRow">+</n-button>
          </template>
          Create a Commission Type
        </n-tooltip>
      </div>
      <n-data-table
        class="rounded-md"
        striped
        :columns="columns"
        :data="buyerTypes"
        :bordered="false"
        :loading="isBuyerTypeLoading"
        virtual-scroll
        :max-height="500"
        :scroll-x="1000"
      />
    </n-modal>
    <n-modal
      class="max-w-[600px]"
      preset="card"
      :title="isEditing ? 'Edit Buyer Type' : 'Add Buyer Type'"
      v-model:show="showEditModal"
    >
      <div class="grid grid-cols-12">
        <div class="col-span-6">
          <n-form-item label="Name">
            <n-input v-model:value="editingBuyerType.name" />
          </n-form-item>
        </div>
        <div class="col-span-12">
          <n-form-item label="Description">
            <n-input
              placeholder="Description"
              v-model:value="editingBuyerType.description"
              type="textarea"
            />
          </n-form-item>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-row gap-[10px]">
          <n-button size="large" @click="onOkEditingModal">Submit</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
