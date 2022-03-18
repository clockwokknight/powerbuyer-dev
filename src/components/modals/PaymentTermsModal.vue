<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import { NButton } from "naive-ui";

const emit = defineEmits(["onReturn"]);

const paymentTerms = ref([]);
const showEditModal = ref(false);
const showModal = ref(false);
const editingPaymentTerm = ref({
  active: 1,
  name: "",
  description: "",
  days: 0,
});
const isEditing = ref(false);

const getPaymentTerms = () => {
  axios
    .get("/payment_terms")
    .then((res) => {
      paymentTerms.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(showModal, (newValue) => {
  if (newValue) {
    getPaymentTerms();
  }
});

const onRemovePaymentTerm = (index) => {
  paymentTerms.value.slice(index, 1);
};

const columns = [
  {
    title: "Name",
    key: "name",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "Days",
    key: "days",
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
        onEdit: () => {
          isEditing.value = true;
          showEditModal.value = true;
          editingPaymentTerm.value = row;
        },
        onDelete: async () => {
          await axios.delete(`/payment_terms/${row.id}`);
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
    days: 0,
    created_at: null,
    updated_at: null,
    deleted_at: null,
  };
  editingPaymentTerm.value = newType;
};

const onOkEditingModal = async () => {
  if (isEditing.value) {
    await axios.put(
      `/payment_terms/${editingPaymentTerm.value.id}`,
      editingPaymentTerm.value
    );
  } else {
    await axios.post("/payment_terms", editingPaymentTerm.value);
  }
  getPaymentTerms();
  showEditModal.value = false;
};
</script>
<template>
  <div class="py-6 px-6" @click="showModal = true" v-bind="$attrs">
    <div class="mb-2 h-11 text-lg font-bold">Payment Terms</div>
    <div class="h-10 pb-2 text-sm">Click to add/edit Payment Terms</div>
  </div>
  <n-modal preset="card" v-model:show="showModal" class="max-w-screen-md">
    <div class="mb-5 ml-auto w-fit">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button @click="addRow">+</n-button>
        </template>
        Add a Payment term
      </n-tooltip>
    </div>
    <n-data-table
      class="rounded-md"
      striped
      :columns="columns"
      :data="paymentTerms"
      :bordered="false"
    />
  </n-modal>
  <n-modal
    class="max-w-[600px]"
    :title="isEditing ? 'Edit Payment Term' : 'Add Payment Term'"
    preset="card"
    v-model:show="showEditModal"
  >
    <div class="grid grid-cols-12 gap-x-6">
      <div class="col-span-6">
        <n-form-item label="Name">
          <n-input v-model:value="editingPaymentTerm.name" />
        </n-form-item>
      </div>
      <div class="col-span-6">
        <n-form-item label="Days">
          <n-input-number v-model:value="editingPaymentTerm.days" />
        </n-form-item>
      </div>
      <div class="col-span-12">
        <n-form-item label="Description">
          <n-input
            placeholder="Description"
            v-model:value="editingPaymentTerm.description"
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
