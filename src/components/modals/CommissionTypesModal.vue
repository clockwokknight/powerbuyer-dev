<script setup>
import axios from "axios";
import { h, ref, reactive, watch, unref } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import { NButton } from "naive-ui";
import { getCommissionTypes } from "@/hooks/commission.js";
import ActionButtons from "@/components/common/ActionButtons.vue";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import dayjs from "dayjs";
import { objectFilter } from "@/lib/helper.js";
import { useQueryClient } from "vue-query";

const queryClient = useQueryClient();

// const commissionTypes = ref([]);
const showEditModal = ref(false);
const formRef = ref(null);
const initialFormValue = {
  active: true,
  amount: 0,
  description: "",
  effective_date: dayjs().format("YYYY-MM-DD"),
  name: "",
  percentage: 0,
  type: 1,
};
const editingCommissionType = ref({ ...initialFormValue });
const isEditing = ref(false);
const showModal = ref(false);

const { data: commissionTypes, isLoading } = getCommissionTypes();

const columns = [
  {
    title: "Name",
    key: "name",
    width: 100,
    // fixed: "left",
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
    width: 110,
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
    width: 100,
    fixed: "right",
    render(row) {
      return h(ActionButtons, {
        deleteTitle: "Delete Commission Type",
        showDeleteButton: true,
        onEdit: () => {
          isEditing.value = true;
          showEditModal.value = true;
          editingCommissionType.value = {
            ...row,
            active: Boolean(row.active),
          };
        },
        onDelete: async () => {
          await axios.delete("/commission_type/" + row.id);
          await queryClient.invalidateQueries("commission_type");
        },
      });
    },
  },
];

const rules = {
  name: {
    required: true,
    message: "Required",
    trigger: "input",
  },
  amount: {
    required: true,
    type: "number",
    trigger: "input",
    validator(rules, value) {
      if (value < 0.01) {
        return new Error("should be greater than $0.01");
      }
    },
  },
  effective_date: {
    required: true,
    message: "Date is required",
    trigger: "blur",
  },
  percentage: {
    type: "number",
    trigger: "input",
    validator(rules, value) {
      if (value < 0 || value > 100) {
        return new Error("should be between 0 and 100");
      }
    },
  },
};

const addRow = () => {
  showEditModal.value = true;
  isEditing.value = false;
  editingCommissionType.value = { ...initialFormValue };
};

const onCancelEditingModal = () => {
  showEditModal.value = false;
};

const onOkEditingModal = async () => {
  try {
    await formRef.value.validate();

    const obj = unref(editingCommissionType);
    obj.active = Number(obj.active);
    if (!obj.description) delete obj.description;

    if (isEditing.value) {
      await axios.put(`/commission_type/${editingCommissionType.value.id}`, obj);
    } else {
      await axios.post("/commission_type", obj);
    }
    await queryClient.invalidateQueries("commission_type");
    showEditModal.value = false;
  } catch {}
};
</script>
<template>
  <article>
    <div class="px-6 pt-6 pb-8" @click="showModal = true">
      <div class="mb-2 text-lg font-bold">Commission Types</div>
      <div class="pb-2 text-sm">Click to edit commission types.</div>
    </div>

    <n-modal
      v-model:show="showModal"
      size="huge"
      title="Commission Types"
      class="max-w-screen-lg"
      preset="card"
    >
      <div class="mb-5">
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
        :data="commissionTypes"
        :bordered="false"
        :loading="isLoading"
        virtual-scroll
        :max-height="500"
      />
    </n-modal>
    <n-modal
      :title="isEditing ? 'Edit Commission Type' : 'Add Commission Type'"
      preset="card"
      class="max-w-[600px]"
      v-model:show="showEditModal"
    >
      <n-form
        ref="formRef"
        :model="editingCommissionType"
        :rules="rules"
        class="grid grid-cols-12 gap-x-5"
      >
        <div class="col-span-6">
          <n-form-item label="Effective Date">
            <n-date-picker
              value-format="yyyy-MM-dd"
              v-model:formatted-value="editingCommissionType.effective_date"
            />
          </n-form-item>
        </div>
        <div class="col-span-6">
          <n-form-item label="Status">
            <n-switch v-model:value="editingCommissionType.active" />
          </n-form-item>
        </div>
        <div class="col-span-4">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="editingCommissionType.name" />
          </n-form-item>
        </div>
        <div class="col-span-4">
          <n-form-item label="Amount" path="amount">
            <CurrencyInput v-model="editingCommissionType.amount" />
          </n-form-item>
        </div>
        <div class="col-span-4">
          <n-form-item label="Percentage" path="percentage">
            <n-input-number
              :show-button="false"
              v-model:value="editingCommissionType.percentage"
            >
              <template #suffix> % </template>
            </n-input-number>
          </n-form-item>
        </div>
        <div class="col-span-12 md:col-span-12">
          <n-form-item label="Description">
            <n-input
              placeholder="Description"
              v-model:value="editingCommissionType.description"
              type="textarea"
            />
          </n-form-item>
        </div>
      </n-form>

      <template #footer>
        <div class="flex flex-row gap-[10px]">
          <n-button size="large" @click="onOkEditingModal">OK</n-button>
          <n-button size="large" @click="onCancelEditingModal">Cancel</n-button>
        </div>
      </template>
    </n-modal>
  </article>
</template>
