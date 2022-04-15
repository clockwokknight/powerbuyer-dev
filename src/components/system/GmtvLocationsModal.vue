<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import { NButton } from "naive-ui";
import { getGmtvLocations } from "@/hooks/location.js";
import { getStates } from "@/hooks/common_query";
import { useQueryClient } from "vue-query";
import MaskedInput from "@/components/common/MaskedInput.vue";

const queryClient = useQueryClient();

const showEditModal = ref(false);
const showModal = ref(false);
const formRef = ref(null);
const initialForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  // manager_id: null,
};
const editingGmtvLocation = ref({ ...initialForm });
const isEditing = ref(false);

const { data: gmtvLocations, isLoading: isGmtvLocationLoading } = getGmtvLocations();

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
    fixed: "right",
    width: 100,
    render(row) {
      return h(ActionButtons, {
        onEdit: () => {
          isEditing.value = true;
          showEditModal.value = true;
          editingGmtvLocation.value = row;
        },
        onDelete: async () => {
          await axios.delete(`/gmtv_locations/${row.id}`);
          await queryClient.invalidateQueries("gmtv_locations");
        },
      });
    },
  },
];

const { data: states } = getStates();

const addRow = () => {
  showEditModal.value = true;
  isEditing.value = false;
  editingGmtvLocation.value = { ...initialForm };
};
const rules = {
  name: {
    required: true,
    message: "Name is required",
  },
  address: {
    required: true,
    message: "Address is required",
  },
  city: {
    required: true,
    message: "City is required",
  },
};
const onOkEditingModal = async () => {
  try {
    await formRef.value.validate();
    if (isEditing.value) {
      await axios.put(
        `/gmtv_locations/${editingGmtvLocation.value.id}`,
        editingGmtvLocation.value
      );
    } else {
      await axios.post("/gmtv_locations", editingGmtvLocation.value);
    }
    showEditModal.value = false;
    await queryClient.invalidateQueries("gmtv_locations");
  } catch (error) {}
};
</script>
<template>
  <article>
    <div class="py-6 px-6" @click="showModal = true">
      <div class="mb-2 h-11 text-lg font-bold">GMTV Locations</div>
      <div class="h-10 pb-2 text-sm">Click to edit commission types.</div>
    </div>

    <n-modal
      preset="card"
      class="max-w-screen-md"
      title="GMTV Locations"
      v-model:show="showModal"
    >
      <div class="mb-5">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button @click="addRow">+</n-button>
          </template>
          Create a GMTV location
        </n-tooltip>
      </div>

      <n-data-table
        class="rounded-md"
        striped
        :columns="columns"
        :data="gmtvLocations"
        :bordered="false"
        :loading="isGmtvLocationLoading"
        :max-height="500"
        :scroll-x="1000"
      />
    </n-modal>
    <n-modal
      preset="card"
      class="max-w-[600px]"
      :title="isEditing ? 'Edit Gmtv Location' : 'Add Gmtv Location'"
      v-model:show="showEditModal"
    >
      <n-form
        ref="formRef"
        :model="editingGmtvLocation"
        :rules="rules"
        class="grid grid-cols-12 gap-x-6"
      >
        <div class="col-span-6">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="editingGmtvLocation.name" />
          </n-form-item>
        </div>
        <div class="col-span-6">
          <n-form-item label="Address" path="address">
            <n-input v-model:value="editingGmtvLocation.address" />
          </n-form-item>
        </div>
        <div class="col-span-6">
          <n-form-item label="City" path="city">
            <n-input v-model:value="editingGmtvLocation.city" />
          </n-form-item>
        </div>
        <div class="col-span-6">
          <n-form-item label="State">
            <n-select
              :options="states"
              filterable
              v-model:value="editingGmtvLocation.state"
            />
          </n-form-item>
        </div>
        <div class="col-span-6">
          <n-form-item label="Zip">
            <masked-input v-model:value="editingGmtvLocation.zip" />
          </n-form-item>
        </div>
        <div class="col-span-6">
          <n-form-item label="Hours">
            <n-input v-model:value="editingGmtvLocation.hours" type="text" />
          </n-form-item>
        </div>
      </n-form>

      <template #footer>
        <div class="flex flex-row">
          <n-button size="large" @click="onOkEditingModal">Submit</n-button>
        </div>
      </template>
    </n-modal>
  </article>
</template>
