<script setup>
import { computed, ref, watch } from "vue";
import { getExpenseTypes } from "@/hooks/expense";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import MaskedInput from "@/components/common/MaskedInput.vue";

const props = defineProps({
  showDrawer: Boolean,
  row: {
    type: Object,
    default: null,
  },
  isLoading: Boolean,
});
const emits = defineEmits(["submit", "update:show", "delete"]);

const formRef = ref(null);
const showModal = ref(false);

const initialForm = {
  job_title: "",
  first_name: "",
  last_name: "",
  reg_num: "",
  type: null,
  office_phone: "",
  cell: "",
  email: "",
  enable_sms: false,
  enable_email: false,
};
const form = ref({
  ...initialForm,
});
watch(
  () => props.showDrawer,
  () => {
    if (props.showDrawer) {
      form.value = { ...initialForm, ...props.row };
    } else {
      form.value = { ...initialForm };
    }
  }
);
const rules = {
  job_title: {
    required: true,
    message: "Please enter a Job title",
    trigger: ["input", "blur"],
  },
  first_name: {
    required: true,
    message: "Please enter First Name",
    trigger: ["input", "blur"],
  },
  last_name: {
    required: true,
    message: "Please enter Last Name",
    trigger: ["input", "blur"],
  },
  reg_num: {
    required: true,
    message: "Please enter Register Number",
    trigger: ["input", "blur"],
  },
  email: {
    required: true,
    trigger: ["input", "blur"],
    validator(rules, value) {
      if (!/(^[a-zA-Z0-9_.]+[@]{1}[a-z0-9]+[\.][a-z]+$)/.test(value))
        return new Error("Please enter a valid email address.");
    },
  },
  office_phone: {
    required: true,
    trigger: ["input", "blur"],
    validator(rules, value) {
      if (!/^[(]\d{3}[)][\s]?\d{3}[-\s]?\d{4}$/.test(value))
        return new Error("Please enter a valid phone number");
    },
  },
  cell: {
    required: true,
    trigger: ["input", "blur"],
    validator(rules, value) {
      if (!/^[(]\d{3}[)][\s]?\d{3}[-\s]?\d{4}$/.test(value))
        return new Error("Please enter a valid phone number");
    },
  },
};

const onSubmitForm = async () => {
  try {
    await formRef.value.validate();
    emits("submit", form.value);
  } catch {}

  //message.success('Valid')
};
const updateShow = (show) => {
  emits("update:show", show);
};
</script>
<template>
  <n-drawer :show="showDrawer" @update:show="updateShow" :width="500">
    <n-drawer-content title="Dealer Contact">
      <n-form
        :model="form"
        :rules="rules"
        size="medium"
        ref="formRef"
        :disabled="isLoading"
      >
        <n-form-item label="Job Title" path="job_title" class="pt-0">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Job title"
            clearable
            v-model:value.trim="form.job_title"
            :loading="isLoading"
          />
        </n-form-item>

        <n-form-item label="First Name" path="first_name">
          <n-input
            placeholder="First Name"
            clearable
            v-model:value="form.first_name"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Last Name" path="last_name">
          <n-input
            placeholder="Last Name"
            clearable
            v-model:value="form.last_name"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Registered Number" path="reg_number">
          <n-input
            placeholder="Registered Number"
            clearable
            v-model:value="form.reg_num"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input
            placeholder="Email"
            clearable
            v-model:value="form.email"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Office Phone" path="office_phone">
          <MaskedInput
            mask="(###) ###-####"
            masked
            placeholder="Office Phone"
            clearable
            v-model:value="form.office_phone"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Cell" path="cell">
          <MaskedInput
            mask="(###) ###-####"
            masked
            placeholder="Cell"
            clearable
            v-model:value="form.cell"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Enable Email Notification">
          <n-switch v-model:value="form.enable_email" />
        </n-form-item>
        <n-form-item label="Enable SMS Notification">
          <n-switch v-model:value="form.enable_sms" />
        </n-form-item>
        <n-button size="large" attr-type="submit" class="invisible"
          >Add</n-button
        >
      </n-form>
      <template #footer>
        <div class="flex gap-x-4">
          <n-button
            size="large"
            type="error"
            v-if="form?.id"
            @click="showModal = true"
          >
            Delete
          </n-button>
          <n-button size="large" @click="onSubmitForm">Submit</n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
  <n-modal
    v-model:show="showModal"
    @positive-click="$emit('delete', form?.id)"
    content="Are you sure you want to delete?"
    positive-text="Yes"
    preset="dialog"
    type="error"
    @mask-click="showModal = false"
    @negative-click="showModal = false"
    negative-text="Cancel"
    title="Delete"
  />
</template>
