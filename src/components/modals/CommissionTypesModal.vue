<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import { NButton } from "naive-ui";

const props = defineProps(["show"]);
const emit = defineEmits(["onReturn"]);

const commissionTypes = ref([]);
const showEditModal = ref(false);
const editingCommissionType = ref({
  active: 1,
  amount: "0",
  date_paid: "2022-2-1",
  deleted_at: null,
  description: "",
  effective_date: "2022-2-1",
  name: "",
  percentage: "",
  status: 1,
  type: 1,
  updated_at: null,
});
const isEditing = ref(false);

const getCommissionTypes = () => {
  axios
    .get("/commission_type")
    .then((res) => {
      commissionTypes.value = res.data;
      console.log("commissionTypes: ", commissionTypes.value);
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      getCommissionTypes();
    }
  }
);

const onRemoveCommissionType = (index) => {
  commissionTypes.value.slice(index, 1);
};

const columns = [
  {
    title: "Name",
    key: "name",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "Amount",
    key: "amount",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "Percentage",
    key: "percentage",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "Effective Date",
    key: "effective_date",
    width: 200,
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
              editingCommissionType.value = row;
            },
          },
          { default: () => "Edit" }
        ),
        h(
          NButton,
          {
            size: "small",
            onClick: async () => {
              await axios.delete(`/commission_type/${row.id}`);
              getCommissionTypes();
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
    amount: "0",
    date_paid: "2022-2-1",
    deleted_at: null,
    description: "",
    effective_date: "2022-2-1",
    name: "",
    percentage: "",
    status: 1,
    type: 1,
    updated_at: null,
  };
  editingCommissionType.value = newType;
};

const onCancelEditingModal = () => {
  showEditModal.value = false;
};

const onOkEditingModal = async () => {
  if (isEditing.value) {
    await axios.put(
      `/commission_type/${editingCommissionType.value.id}`,
      editingCommissionType.value
    );
  } else {
    await axios.post("/commission_type", editingCommissionType.value);
  }
  getCommissionTypes();
  showEditModal.value = false;
};
</script>
<template>
  <n-modal v-model:show="show">
    <n-card
      style="width: 1200px"
      title="Commission Types"
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
        :data="commissionTypes"
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
      :title="isEditing ? 'Edit Commission Type' : 'Add Commission Type'"
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
            v-model:value="editingCommissionType.name"
            style="margin-right: 12px"
          />
        </div>
        <div class="col-span-6 md:col-span-2">
          <CustomInput
            label="Amount"
            v-model:value="editingCommissionType.amount"
            style="margin-right: 12px"
          />
        </div>
        <div class="col-span-6 md:col-span-2">
          <CustomInput
            label="Percent"
            v-model:value="editingCommissionType.percentage"
            style="margin-right: 12px"
          />
        </div>
        <div class="col-span-6 md:col-span-4">
          <CustomInput
            label="Status"
            v-model:value="editingCommissionType.status"
            type="text"
          />
        </div>
        <div class="col-span-12 md:col-span-12">
          <n-input
            placeholder="Description"
            v-model:value="editingCommissionType.description"
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
