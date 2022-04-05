<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useMessage } from "naive-ui";
import MaskedInput from "@/components/common/MaskedInput.vue";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import { useVendorCategories } from "@/hooks/vendor";
import { getBuyerManagers, getBuyerTypes } from "@/hooks/buyer";
import { getGmtvLocations } from "@/hooks/location";
import { objectFilter } from "@/lib/helper";

const openDrawer = ref(false);
const formRef = ref(null);
const message = useMessage();
const queryClient = useQueryClient();
const formInitialValue = {
  first_name: "",
  last_name: "",
  din: "",
  payment_terms: null,
  commission_id: null,
  buyer_type_id: null,
  buyer_manager_id: null,
  code: "",
  phone: "",
  cell: "",
  fax: "",
  comments: "",
  email: "",
  tax_id: "",
  address_one: "",
  address_two: "",
  city: "",
  state: null,
  zipcode: "",
  gmtv_location_id: null,
  country: "United States",
};
const form = ref({ ...formInitialValue });
const rules = {
  first_name: {
    required: true,
    message: "First Name is required",
    trigger: "blur",
  },
  last_name: {
    required: true,
    message: "Last Name is required",
    trigger: "blur",
  },
  buyer_type_id: {
    required: true,
    message: "Buyer Type is required",
  },
  gmtv_location_id: {
    required: true,
    message: "Please select a location",
  },
  email: {
    trigger: "input",
    required: true,
    validator(rule, value) {
      if (value === "") return new Error("Email is required");
      else if (!/(^[a-zA-Z0-9_.]+[@][a-z0-9]+[.][a-z]+$)/.test(value)) {
        return new Error("Not a valid email address");
      }
    },
  },
};

const { data: paymentTerms } = useQuery("paymentTerms", () =>
  axios.get("/payment_terms").then((res) => res.data)
);

const { data: statesList } = useQuery("states", () =>
  axios
    .get("/states")
    .then((res) => res.data?.map((el) => ({ label: el.name, value: el.name })))
);

const { data: buyer_types } = getBuyerTypes();

const { data: commissionTypes } = useQuery("commission_type", () =>
  axios.get("/commission_type").then((res) => res.data)
);

const buyerTypeOptions = computed(() =>
  buyer_types.value?.map((type) => ({ label: type.name, value: type.id }))
);
const commissionTypeOptions = computed(() =>
  commissionTypes.value?.map((comm) => ({ label: comm.name, value: comm.id }))
);

const { data: gmtvLocations } = getGmtvLocations();

const gmtvLocationsOptions = computed(() =>
  gmtvLocations.value?.map((location) => ({
    label: location.name,
    value: location.id,
  }))
);

const paymentTermOptions = computed(() =>
  paymentTerms.value?.map((payment) => ({
    label: payment.name,
    value: payment.name,
  }))
);
const { mutate, isLoading } = useMutation(
  (data) => axios.post("/buyers", data).then((res) => res.data),
  {
    onSuccess(data, variables) {
      queryClient.invalidateQueries("buyers");
      openDrawer.value = false;
      form.value = { ...formInitialValue };
    },
    onError(error) {
      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        message.error(error?.response?.data?.message);
        errors.value = error?.response?.data?.errors;
      }
    },
  }
);

const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    mutate(objectFilter(form.value, (key, value) => value));
  } catch (e) {
    // e.forEach(([err]) => message.error(err.message));
  }
};

const errors = ref({});
</script>

<template>
  <n-button @click="openDrawer = true">
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
  </n-button>

  <n-drawer v-model:show="openDrawer" width="500">
    <n-drawer-content title="Add a Buyer" style="--n-body-padding: 0px 24px">
      <n-form
        ref="formRef"
        @submit.prevent="handleSubmit"
        :model="form"
        size="medium"
        class="min-h-full pt-4"
        :rules="rules"
        :disabled="isLoading"
      >
        <n-form-item label="First Name" path="first_name">
          <n-input
            clearable
            type="text"
            placeholder="Please enter first Name"
            v-model:value.trim="form.first_name"
          />
        </n-form-item>
        <n-form-item label="Last Name" path="last_name">
          <n-input
            clearable
            type="text"
            placeholder="Please enter last Name"
            v-model:value.trim="form.last_name"
          />
        </n-form-item>
        <n-form-item
          label="Tax ID"
          path="tax_id"
          :validation-status="errors?.tax_id ? 'error' : undefined"
          :feedback="errors?.tax_id?.join(' ')"
        >
          <n-input
            clearable
            type="text"
            placeholder="Tax ID"
            v-model:value.trim="form.tax_id"
          />
        </n-form-item>
        <n-form-item
          label="Code"
          :validation-status="errors?.code ? 'error' : undefined"
          :feedback="errors?.code?.join(' ')"
        >
          <n-input
            clearable
            type="text"
            placeholder="Code"
            v-model:value.trim="form.code"
          />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input clearable placeholder="Email" v-model:value="form.email" />
        </n-form-item>
        <n-form-item label="Payment Terms">
          <n-select
            clearable
            filterable
            :options="paymentTermOptions"
            v-model:value="form.payment_terms"
          />
        </n-form-item>
        <n-form-item label="Buyer Type" path="buyer_type_id">
          <n-select
            clearable
            filterable
            :options="buyerTypeOptions"
            v-model:value="form.buyer_type_id"
          />
        </n-form-item>
        <n-form-item label="GMTV location" path="gmtv_location_id">
          <n-select
            :options="gmtvLocationsOptions"
            filterable
            clearable
            v-model:value="form.gmtv_location_id"
          />
        </n-form-item>
        <n-form-item label="Commission">
          <n-select
            clearable
            filterable
            :options="commissionTypeOptions"
            v-model:value="form.commission_id"
          />
        </n-form-item>
        <n-form-item label="Buyer Manager">
          <n-select
            clearable
            filterable
            :options="buyerTypeOptions"
            v-model:value="form.buyer_manager_id"
        /></n-form-item>
        <n-form-item label="Address 1">
          <n-input clearable v-model:value="form.address_one" />
        </n-form-item>
        <n-form-item label="Address 2">
          <n-input clearable v-model:value="form.address_two" />
        </n-form-item>
        <n-form-item label="City">
          <n-input clearable v-model:value="form.city" />
        </n-form-item>
        <div class="grid grid-cols-2 gap-x-4">
          <n-form-item label="State">
            <n-select
              clearable
              filterable
              :options="statesList"
              v-model:value="form.state"
            />
          </n-form-item>
          <n-form-item label="Zip Code">
            <n-input clearable v-model:value="form.zipcode" />
          </n-form-item>
        </div>
        <n-form-item label="Phone">
          <MaskedInput
            clearable
            type="text"
            placeholder="(xxx) xxx-xxxx"
            v-model:value.trim="form.phone"
            mask="(###) ###-####"
          />
        </n-form-item>
        <n-form-item label="Cell">
          <MaskedInput
            clearable
            type="text"
            placeholder="(xxx) xxx-xxxx"
            v-model:value.trim="form.cell"
            mask="(###) ###-####"
          />
        </n-form-item>
        <n-form-item label="Fax">
          <MaskedInput
            clearable
            type="text"
            placeholder="(xxx) xxx-xxxx"
            v-model:value.trim="form.fax"
            mask="(###) ###-####"
          />
        </n-form-item>
        <n-form-item label="Comment">
          <n-input
            type="textarea"
            placeholder="Enter Comment"
            v-model:value="form.comments"
          />
        </n-form-item>
        <div class="sticky bottom-0 z-20 mt-auto border-t bg-white py-3">
          <n-button attr-type="submit" class="ml-auto grid w-fit"> Add </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
