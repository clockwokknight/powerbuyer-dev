<script setup>
import { h, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { NButton } from "naive-ui";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import { objectFilter, omit, pick } from "@/lib/helper";
import { getVendorExpenseItems } from "@/hooks/expense";
import ActionButtons from "@/components/vendor/ActionButtons.vue";
import DealerContactForm from "@/components/dealer/DealerContactForm.vue";

const route = useRoute();
const queryClient = useQueryClient();
const visibleForm = ref(false);

const formRow = ref(null);

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,
  (toParams) => {
    if (toParams?.id) routeParamId.value = toParams?.id;
  }
);

const { data: vendorContacts, isFetching: isVendorContactLoading } = useQuery(
  ["dealerContacts", routeParamId],
  ({ queryKey }) =>
    axios
      .get(`/dealer_contacts/by_dealer/${queryKey[1]}`)
      .then((res) => (Array.isArray(res.data) ? res.data : []))
);

const showUpdateForm = (row) => {
  const obj = omit(row, ["created_at", "updated_at"]);
  obj.enable_email = Boolean(obj.enable_email);
  obj.enable_sms = Boolean(obj.enable_sms);
  formRow.value = obj;
  visibleForm.value = true;
};

const { mutate: createForm, isLoading: createFormLoading } = useMutation(
  (data) => axios.post("/dealer_contacts", data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["dealerContacts", routeParamId.value]);
      formRow.value = null;
      visibleForm.value = false;
    },
  }
);

const { isLoading: updateFormLoading, mutate: updateForm } = useMutation(
  ({ id, ...rest }) => axios.put(`/dealer_contacts/${id}`, rest),
  {
    onSuccess() {
      queryClient.invalidateQueries(["dealerContacts", routeParamId.value]);
      formRow.value = null;
      visibleForm.value = false;
    },
  }
);

const { mutate: deleteExpenseItem } = useMutation(
  (id) => axios.delete(`/dealer_contacts/${id}`),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["dealerContacts", routeParamId.value]);
    },
  }
);

const columns = [
  {
    title: "First Name",
    key: "first_name",
    fixed: "left",
  },
  {
    title: "Last Name",
    key: "last_name",
  },
  {
    title: "Job Title",
    key: "job_title",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Office Phone",
    key: "office_phone",
  },
  {
    title: "Cell",
    key: "cell",
  },
  {
    title: "Register Number",
    key: "reg_num",
    //fixed: 'left'
  },
  {
    title: "Enabled Email",
    key: "enable_email",
    render(row) {
      return h("span", { innerHTML: Boolean(row.enable_email) });
    },
  },
  {
    title: "Enabled SMS",
    key: "enable_sms",
    render(row) {
      return h("span", { innerHTML: Boolean(row.enable_sms) });
    },
  },
  {
    title: "",
    key: "edit",
    fixed: "right",
    render(row) {
      return h(ActionButtons, {
        row,
        onEdit: () => showUpdateForm(row),
      });
    },
  },
];

const pagination = { pageSize: 10 };

const showCreateForm = () => {
  formRow.value = { dealer_id: parseInt(routeParamId.value) };
  visibleForm.value = true;
};

const onSubmitForm = (formValue) => {
  const obj = objectFilter(formValue, (key, value) => value);
  obj.enable_sms = Number(obj.enable_sms) || 0;
  obj.enable_email = Number(obj.enable_email) || 0;
  if (formValue?.id) {
    updateForm(obj);
  } else createForm(obj);
  // formRow.value = null;
  // visibleForm.value = false;
};

const onDeleteExpenseItem = (id) => {
  deleteExpenseItem(id);
  visibleForm.value = false;
};
</script>
<template>
  <div class="mt-4 px-4 bg-white dark:bg-foreground_dark rounded-[3px]">
    <div class="justify-end py-4">
      <n-button @click="showCreateForm">
        <n-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
              fill="currentColor"
            ></path>
          </svg>
        </n-icon>
        Add Contacts
      </n-button>
    </div>
    <DealerContactForm
      :show-drawer="visibleForm"
      :row="formRow"
      :is-loading="createFormLoading || updateFormLoading"
      @update:show="visibleForm = false"
      @submit="onSubmitForm"
      @delete="onDeleteExpenseItem"
    />

    <div class="rounded-round py-8 px-8">
      <div><p class="pb-8 text-2xl font-bold">Contacts</p></div>
      <n-data-table
        class="rounded-round"
        :columns="columns"
        :data="vendorContacts"
        :pagination="pagination"
        :bordered="false"
        :loading="isVendorContactLoading"
        :max-height="500"
        :scroll-x="1500"
        virtual-scroll
      />
    </div>
  </div>
</template>
