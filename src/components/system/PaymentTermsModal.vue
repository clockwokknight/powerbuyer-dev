<script setup>
import ActionButtons from "@/components/common/ActionButtons.vue";
import { getPaymentTerms } from "@/hooks/common_query";
import axios from "axios";
import { NButton } from "naive-ui";
import { h, ref, watch } from "vue";
import { useQueryClient } from "vue-query";

const queryClient = useQueryClient();

const showEditModal = ref(false);
const showModal = ref(false);
const editingPaymentTerm = ref({
  name: "",
  description: "",
  days: 0,
});
const isEditing = ref(false);

const { data: paymentTerms } = getPaymentTerms();

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
          queryClient.invalidateQueries("paymentTerms");
        },
      });
    },
  },
];

const addRow = () => {
  showEditModal.value = true;
  isEditing.value = false;
  const newType = {
    name: "",
    description: "",
    days: 0,
  };
  editingPaymentTerm.value = { ...newType };
};

const rules = {
  name: {
    required: true,
    message: "Name is required",
    trigger: "input",
  },
  days: {
    type: "number",
    required: true,
    trigger: "input",
    message: "Day is required",
  },
};
const formRef = ref(null);
const onOkEditingModal = async () => {
  try {
    await formRef.value.validate();
    if (isEditing.value) {
      await axios.put(
        `/payment_terms/${editingPaymentTerm.value.id}`,
        editingPaymentTerm.value
      );
    } else {
      await axios.post("/payment_terms", editingPaymentTerm.value);
    }
    queryClient.invalidateQueries("paymentTerms");
    showEditModal.value = false;
  } catch (error) {}
};
</script>
<template>
  <article>
    <div class="py-6 px-6" @click="showModal = true">
      <div class="mb-2 h-11 text-lg font-bold">Payment Terms</div>
      <div class="h-10 pb-2 text-sm">Click to add/edit Payment Terms</div>
    </div>
    <n-modal
      preset="card"
      title="Payment Terms"
      v-model:show="showModal"
      class="max-w-screen-md"
    >
      <div class="mb-5">
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
      <n-form
        ref="formRef"
        :model="editingPaymentTerm"
        :rules="rules"
        class="grid grid-cols-12 gap-x-6"
      >
        <div class="col-span-6">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="editingPaymentTerm.name" />
          </n-form-item>
        </div>
        <div class="col-span-6">
          <n-form-item label="Days" path="days">
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
      </n-form>

      <template #footer>
        <n-button size="large" @click="onOkEditingModal">Submit</n-button>
      </template>
    </n-modal>
  </article>
</template>
