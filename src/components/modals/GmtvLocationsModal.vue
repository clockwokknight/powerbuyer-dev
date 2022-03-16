<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import { NButton } from "naive-ui";

const props = defineProps(["show"]);
const emit = defineEmits(["onReturn"]);

const gmtvLocations = ref([]);
const showEditModal = ref(false);
const editingGmtvLocation = ref({
  active: 1,
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  manager_id: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
});
const isEditing = ref(false);

const getGmtvLocations = () => {
  axios
    .get("/gmtv_locations")
    .then((res) => {
      gmtvLocations.value = res.data;
      console.log("gmtvLocations: ", gmtvLocations.value);
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      getGmtvLocations();
    }
  }
);

const onRemoveGmtvLocation = (index) => {
  gmtvLocations.value.slice(index, 1);
};

const columns = [
  {
    title: "Name",
    key: "name",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "Address",
    key: "address",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "City",
    key: "city",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "State",
    key: "state",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "Hours",
    key: "hours",
    width: 200,
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
              editingGmtvLocation.value = row;
            },
          },
          { default: () => "Edit" }
        ),
        h(
          NButton,
          {
            size: "small",
            onClick: async () => {
              await axios.delete(`/gmtv_locations/${row.id}`);
              getGmtvLocations();
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
    address: "",
    city: "",
    state: "",
    zip: "",
    manager_id: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
  };
  editingGmtvLocation.value = newType;
};

const onCancelEditingModal = () => {
  showEditModal.value = false;
};

const onOkEditingModal = async () => {
  if (isEditing.value) {
    await axios.put(
      `/gmtv_locations/${editingGmtvLocation.value.id}`,
      editingGmtvLocation.value
    );
  } else {
    await axios.post("/gmtv_locations", editingGmtvLocation.value);
  }
  getGmtvLocations();
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
        :data="gmtvLocations"
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
        <div class="col-span-6 md:col-span-6">
          <CustomInput label="Name" v-model:value="editingGmtvLocation.name" />
        </div>
        <div class="col-span-6 md:col-span-6">
          <CustomInput
            label="Address"
            v-model:value="editingGmtvLocation.address"
          />
        </div>
        <div class="col-span-6 md:col-span-6">
          <CustomInput label="City" v-model:value="editingGmtvLocation.city" />
        </div>
        <div class="col-span-6 md:col-span-6">
          <CustomInput
            label="State"
            v-model:value="editingGmtvLocation.state"
            type="text"
          />
        </div>
        <div class="col-span-6 md:col-span-6">
          <CustomInput
            label="Zip"
            v-model:value="editingGmtvLocation.zip"
            type="text"
          />
        </div>
        <div class="col-span-6 md:col-span-6">
          <CustomInput
            label="Hours"
            v-model:value="editingGmtvLocation.hours"
            type="text"
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
