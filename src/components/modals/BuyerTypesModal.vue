<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import { NButton } from "naive-ui";

const showModal = ref(false);
const emit = defineEmits(["onReturn"]);

const buyerTypes = ref([]);
const showEditModal = ref(false);
const editingBuyerType = ref({
  active: 1,
  deleted_at: null,
  description: "",
  name: "",
  updated_at: null,
});
const isEditing = ref(false);

const getBuyerTypes = () => {
  axios
    .get("/buyer_type")
    .then((res) => {
      buyerTypes.value = res.data;
      console.log("buyerTypes: ", buyerTypes.value);
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(showModal, (newValue) => {
  if (newValue) {
    getBuyerTypes();
  }
});

const onRemoveBuyerType = (index) => {
  buyerTypes.value.slice(index, 1);
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
              editingBuyerType.value = row;
            },
          },
          { default: () => "Edit" }
        ),
        h(
          NButton,
          {
            size: "small",
            onClick: async () => {
              await axios.delete(`/buyer_type/${row.id}`);
              getBuyerTypes();
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
    deleted_at: null,
    description: "",
    name: "",
    updated_at: null,
  };
  editingBuyerType.value = newType;
};

const onCancelEditingModal = () => {
  showEditModal.value = false;
};

const onOkEditingModal = async () => {
  if (isEditing.value) {
    await axios.put(
      `/buyer_type/${editingBuyerType.value.id}`,
      editingBuyerType.value
    );
  } else {
    await axios.post("/buyer_type", editingBuyerType.value);
  }
  getBuyerTypes();
  showEditModal.value = false;
};
</script>
<template>
  <div>
    <div class="cursor-pointer py-6 px-6" @click="showModal = true">
      <div class="mb-2 text-lg font-bold">Buyer Types</div>
      <div class="pb-2 text-sm">Click to edit commission types.</div>
    </div>

    <n-modal v-model:show="showModal">
      <n-card
        style="width: 1200px"
        title="Buyer Types"
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
          :data="buyerTypes"
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
        :title="isEditing ? 'Edit Buyer Type' : 'Add Buyer Type'"
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
              v-model:value="editingBuyerType.name"
              style="margin-right: 12px"
            />
          </div>
          <div class="col-span-12 md:col-span-12">
            <n-input
              placeholder="Description"
              v-model:value="editingBuyerType.description"
              type="textarea"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex flex-row gap-[10px]">
            <n-button size="large" @click="onOkEditingModal">OK</n-button>
            <n-button size="large" @click="onCancelEditingModal"
              >Cancel</n-button
            >
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
