<script setup>
import { defineComponent, h, ref, watch } from "vue";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { NButton, NModal, useMessage } from "naive-ui";
import { objectFilter, pick } from "@/lib/helper";
import { useRoute } from "vue-router";
import { api } from "@/api/config";
import axios from "axios";
import ActionButtons from "./ActionButtons.vue";
import VendorAdd from "@/components/vendor/VendorContactsAdd.vue";
import MaskedInput from "@/components/common/MaskedInput.vue";

const showOuterRef = ref(false);
const route = useRoute();
const update = ref(0);
const queryClient = useQueryClient();
const message = useMessage();

const rules = {
  first_name: {
    required: true,
    message: "Please enter the First Name",
    trigger: ["input"],
  },
  last_name: {
    required: true,
    message: "Please enter the First Name",
    trigger: ["input"],
  },
};

const formValue = ref({
  vendor_id: 0,
  first_name: "",
  last_name: "",
  cell_phone: "",
  office_phone: "",
  email: "",
  job_title: "",
});

const routeParamId = ref(route.params?.id);
const showModal = ref(false);

const { data: vendorContacts, isLoading: isVendorContactLoading } = useQuery(
  ["vendorContacts", routeParamId],
  ({ queryKey }) =>
    axios
      .get(`/vendor_contacts/by_vendor/${queryKey[1]}`)
      .then((res) => (Array.isArray(res.data) ? res.data : []))
);

watch(
  () => route.params?.id,
  () => {
    if (route.params?.id) {
      routeParamId.value = route.params?.id;
    }
  }
);

const doShowOuter = (row) => {
  formValue.value = pick(row, [
    "cell_phone",
    "email",
    "first_name",
    "id",
    "job_title",
    "last_name",
    "office_phone",
  ]);

  showOuterRef.value = true;
};

const { isLoading, mutate } = useMutation(
  ({ id, ...rest }) => api.put(`/vendor_contacts/${id}`, rest),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendorContacts", route.params?.id]);
      message.success("Contact updated Successfully");
    },
  }
);

const { mutate: deleteVendorContact } = useMutation(
  (id) => axios.delete(`/vendor_contacts/${id}`),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendorContacts", route.params?.id]);
    },
  }
);

function updateVendor() {
  mutate(objectFilter(formValue.value, (key, value) => value));
  showOuterRef.value = false;
}

function deleteContact() {
  deleteVendorContact(formValue.value.id);
  showOuterRef.value = false;
}

const columns = [
  {
    title: "Name",
    key: "first_name",
    //fixed: 'left'
  },
  {
    title: "Cell",
    key: "cell_phone",
    //fixed: 'left'
  },
  {
    title: "Email",
    key: "email",
    //fixed: 'left'
  },
  {
    title: "Position",
    key: "job_title",
    //fixed: 'left'
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return h(ActionButtons, {
        row,
        onEdit: () => doShowOuter(row),
      });
    },
  },
];
const pagination = { pageSize: 10 };
</script>

<template>
  <div id="contacts" class="_vendor-contacts scroll-smooth">
    <div class="mt-[24px]">
      <div class="rounded-round bg-foreground_light py-8 px-8 dark:bg-foreground_dark">
        <div class="flex justify-between">
          <p class="pb-8 text-2xl font-bold">Contacts</p>
          <VendorAdd />
        </div>
        <n-data-table
          class="rounded-round"
          :columns="columns"
          :data="vendorContacts"
          :pagination="pagination"
          :bordered="false"
          :key="update"
          :loading="isVendorContactLoading || isLoading"
        />
      </div>
    </div>

    <n-drawer v-model:show="showOuterRef" :width="500">
      <n-drawer-content title="Vendor Details">
        <n-form
          :model="formValue"
          :rules="rules"
          :label-width="90"
          size="medium"
          ref="formRef"
          :disabled="isLoading"
          @submit.prevent="updateVendor"
        >
          <n-form-item label="First Name" class="pr-12" path="first_name">
            <n-input
              style="width: 400px"
              class="rounded-round border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
              :default-value="formValue.first_name"
              type="text"
              v-model:value="formValue.first_name"
            />
          </n-form-item>
          <n-form-item label="Last Name" class="pr-12" path="last_name">
            <n-input
              style="width: 400px"
              class="rounded-round border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
              type="text"
              v-model:value="formValue.last_name"
            />
          </n-form-item>

          <n-form-item label="Email" class="pr-12">
            <n-input
              style="width: 400px"
              class="rounded-round border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
              type="text"
              placeholder="Enter Email"
              v-model:value="formValue.email"
            />
          </n-form-item>

          <n-form-item label="Position" class="pr-12">
            <n-input
              style="width: 400px"
              class="rounded-round border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
              :default-value="formValue.job_title"
              type="text"
              v-model:value="formValue.job_title"
              placeholder="Enter Job Title"
            />
          </n-form-item>

          <n-form-item label="Cell Phone" class="pr-12">
            <masked-input
              style="width: 400px"
              class="rounded-round border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
              :default-value="formValue.cell_phone"
              mask="(###) ###-####"
              v-model:value="formValue.cell_phone"
            />
          </n-form-item>

          <n-form-item label="Office Phone" class="pr-12">
            <masked-input
              style="width: 400px"
              class="rounded-round border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
              :default-value="formValue.office_phone"
              mask="(###) ###-####"
              v-model:value="formValue.office_phone"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <div class="flex gap-x-4">
            <n-button size="large" type="error" @click="showModal = true"
              >Delete</n-button
            >
            <n-button size="large" @click="updateVendor">Update</n-button>
          </div>
        </template>
        <n-modal
          v-model:show="showModal"
          @positive-click="deleteContact"
          content="Are you sure you want to delete?"
          positive-text="Yes"
          preset="dialog"
          type="error"
          @mask-click="showModal = false"
          @negative-click="showModal = false"
          negative-text="Cancel"
          title="Delete"
        />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
