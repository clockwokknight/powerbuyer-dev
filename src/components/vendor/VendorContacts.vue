<script setup>
import { h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { NButton, useMessage } from "naive-ui";
import MaskedInput from "@/components/common/MaskedInput.vue";
import VendorAdd from "@/components/vendor/VendorContactsAdd.vue";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import { api } from "@/api/config";
import { objectFilter, pick } from "@/lib/helper";

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

const { data: vendorContacts } = useQuery(
  ["vendorContacts", routeParamId],
  ({ queryKey }) =>
    axios
      .get(`/vendor_contacts/by_vendor/${queryKey[1]}`)
      .then((res) => (Array.isArray(res.data) ? res.data : []))
);

watch(
  () => route.params?.id,
  () => {
    routeParamId.value = route.params?.id;
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

function updateVendor() {
  mutate(objectFilter(formValue.value, (key, value) => value));
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
      return h(NButton, {
        strong: true,

        size: "medium",
        onClick: () => doShowOuter(row),
        innerHTML: `<svg class="h-6 w-6 text-gray-300 hover:text-[#027BFF]" xmlns=“http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z" fill="currentColor"></path></g></svg>`,
      });
    },
  },
];
const pagination = { pageSize: 10 };
</script>
<template>
  <div class="mt-4 px-4 font-sans">
    <div class="pb-4 justify-end"><VendorAdd /></div>

    <div class="py-8 px-8 rounded-lg border-2">
      <div><p class="text-2xl font-bold pb-8">Contacts</p></div>
      <n-data-table
        class="rounded-lg"
        :columns="columns"
        :data="vendorContacts"
        :pagination="pagination"
        :bordered="false"
        :key="update"
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
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            :default-value="formValue.first_name"
            type="text"
            v-model:value="formValue.first_name"
          />
        </n-form-item>
        <n-form-item label="Last Name" class="pr-12" path="last_name">
          <n-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            type="text"
            v-model:value="formValue.last_name"
          />
        </n-form-item>

        <n-form-item label="Email" class="pr-12">
          <n-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            type="text"
            placeholder="Enter Email"
            v-model:value="formValue.email"
          />
        </n-form-item>

        <n-form-item label="Position" class="pr-12">
          <n-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            :default-value="formValue.job_title"
            type="text"
            v-model:value="formValue.job_title"
            placeholder="Enter Job Title"
          />
        </n-form-item>

        <n-form-item label="Cell Phone" class="pr-12">
          <masked-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            :default-value="formValue.cell_phone"
            mask="(###) ###-####"
            v-model:value="formValue.cell_phone"
          />
        </n-form-item>

        <n-form-item label="Office Phone" class="pr-12">
          <masked-input
            style="width: 400px"
            class="
              border-2
              rounded-md
              hover:border-sky-500 hover:ring-sky-500 hover:ring-0
            "
            :default-value="formValue.office_phone"
            mask="(###) ###-####"
            v-model:value="formValue.office_phone"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button size="large" @click="updateVendor">Update</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
