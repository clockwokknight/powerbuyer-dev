<script setup>
import { computed, ref } from "vue";
import { useMessage } from "naive-ui";
import MaskedInput from "@/components/common/MaskedInput.vue";
import { getPaymentTerms, getStates } from "@/hooks/common_query";
import { useVendorCategories } from "@/hooks/vendor";
import { useMutation } from "vue-query";
import axios from "axios";
import { objectFilter } from "@/lib/helper";

// States
const showDrawer = ref(false);
const initialForm = {
  name: "",
  tax_id_number: "",
  din: "",
  address_one: "",
  address_two: "",
  payment_terms: null,
  vendor_category_id: null,
  phone: "",
  email: "",
  state: "",
  city: "",
  zip: "",
  fax: "",
  comments: "",
  accounting_code: "",
};

const formRef = ref(null);
const message = useMessage();
const form = ref({ ...initialForm });

// Queries
const { data: statesList } = getStates();

const { data: paymentTerms } = getPaymentTerms();
const paymentTermOptions = computed(() =>
  paymentTerms.value?.map((payment) => ({
    label: payment.name,
    value: payment.name,
  }))
);

const {
  data: vendorCategory,
  hasNextPage: hasMoreVendorCategory,
  fetchNextPage: fetchNextVendorCategory,
} = useVendorCategories();

const vendorCategoryOptions = computed(() =>
  vendorCategory.value?.pages.reduce(
    (prev, current) =>
      prev.concat(
        current.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      ),
    []
  )
);

// Mutations
const { mutateAsync: createVendor, isLoading } = useMutation(
  (data) => axios.post("/vendors/store", data),
  {
    onSuccess() {
      message.success("Vendor created Successfully");
      form.value = { ...initialForm };
      showDrawer.value = false;
    },
    onError(e) {
      if (e.response?.status === 422) {
        Object.entries(e.response?.data.errors).forEach(([key, value]) =>
          value?.forEach((v) => message.error(v))
        );
      }
    },
  }
);
async function addVendor() {
  try {
    await formRef.value.validate();
    await createVendor(objectFilter(form.value, (key, value) => value));
  } catch {}
}

/**
 *
 * @param {} e Event
 */
const handleVendorCategorySelectScroll = (e) => {
  const currentTarget = e.currentTarget;

  if (
    currentTarget.scrollTop + currentTarget.offsetHeight >=
    currentTarget.scrollHeight
  ) {
    if (hasMoreVendorCategory.value) {
      fetchNextVendorCategory.value();
    }
  }
};

const rules = {
  name: {
    required: true,
    message: "Please enter a Company Name",
    trigger: ["input"],
  },
  din: {
    required: true,
    message: "Please enter a valid DIN",
    trigger: ["input"],
  },
  payment_terms: {
    required: true,
    trigger: ["blur", "change"],
    message: "Please select a Payment Term",
  },
  vendor_category_id: {
    required: true,
    type: "number",
    message: "Please select a vendor category",
    trigger: ["blur", "change"],
  },
  tax_id_number: {
    required: true,
    message: "Please enter a valid Tax ID #",
    trigger: ["input"],
  },
  address_one: {
    required: true,
    message: "Please enter a valid Address",
    trigger: ["input"],
  },
  email: {
    required: true,
    message: "Please enter a valid Email Address",
    validator(rules, value) {
      if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value)) {
        return new Error("Please enter a valid email address");
      }
    },
    trigger: ["input"],
  },
  state: {
    required: true,
    message: "Please select a state",
    trigger: ["input"],
  },
  city: {
    required: true,
    message: "Please enter a City",
    trigger: ["input"],
  },
  phone: {
    required: true,
    message: "Please enter a phone number",
    trigger: ["input"],
  },
  zip: {
    required: true,
    message: "Please enter a Zip Code",
    validator(rules, value) {
      if (value.length < 5) {
        return new Error("Please enter a valid Zip Code");
      }
    },
    trigger: ["input"],
  },
};
</script>
<template>
  <div content="Create New Vendor" v-tippy="{ placement: 'right', duration: 50 }">
    <n-button @click="showDrawer = true">
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
  </div>
  <n-drawer v-model:show="showDrawer" :width="500">
    <n-drawer-content title="Add Vendor">
      <n-form
        :model="form"
        :label-width="90"
        :rules="rules"
        size="medium"
        :disabled="isLoading"
        ref="formRef"
      >
        <n-form-item label="Company Name" path="name">
          <n-input
            type="text"
            placeholder="Enter Name"
            clearable
            v-model:value.trim="form.name"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="DIN" path="din">
          <n-input
            type="text"
            placeholder="Enter DIN"
            clearable
            v-model:value.trim="form.din"
          />
        </n-form-item>
        <n-form-item label="Payment Terms" path="payment_terms">
          <n-select
            placeholder="Select Payment Term"
            :options="paymentTermOptions"
            v-model:value="form.payment_terms"
            filterable
          />
        </n-form-item>
        <n-form-item label="Vendor Category" path="vendor_category_id">
          <n-select
            placeholder="Select Vendor Category"
            :options="vendorCategoryOptions"
            v-model:value="form.vendor_category_id"
            @scroll="handleVendorCategorySelectScroll"
            filterable
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Tax ID" path="tax_id_number">
          <n-input
            type="text"
            placeholder="Enter Tax ID #"
            clearable
            v-model:value.trim="form.tax_id_number"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Address" path="address_one">
          <n-input
            type="text"
            placeholder="Enter Address"
            clearable
            v-model:value.trim="form.address_one"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Address Two" path="address_two">
          <n-input
            type="text"
            placeholder="Enter Address Two"
            clearable
            v-model:value.trim="form.address_two"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="City" path="city">
          <n-input
            type="text"
            placeholder="Enter City"
            clearable
            v-model:value.trim="form.city"
          />
        </n-form-item>
        <n-space>
          <n-form-item label="State" path="state">
            <n-select
              style="width: 220px"
              placeholder="Select State"
              :options="statesList"
              v-model:value="form.state"
              :loading="isLoading"
              filterable
            />
          </n-form-item>
          <n-form-item label="ZIP Code" path="zip">
            <n-input
              type="text"
              min-length="2"
              maxlength="5"
              placeholder="Enter Zip"
              clearable
              :loading="isLoading"
              v-model:value="form.zip"
            />
          </n-form-item>
        </n-space>
        <n-form-item label="Phone Number" path="phone">
          <masked-input
            mask="(###) ###-####"
            placeholder="Enter Phone Number"
            clearable
            v-model:value="form.phone"
            :loading="isLoading"
          />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input
            type="email"
            placeholder="Enter Email"
            clearable
            v-model:value="form.email"
          />
        </n-form-item>
        <n-form-item label="Fax">
          <masked-input
            mask="(###) ###-####"
            placeholder="Enter Fax #"
            clearable
            v-model:value.trim="form.fax"
          />
        </n-form-item>
        <n-form-item label="Comments">
          <n-input
            type="textarea"
            show-count
            placeholder="Enter Comments"
            clearable
            v-model:value.trim="form.comments"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-button
          size="large"
          :disabled="isLoading"
          :loading="isLoading"
          @click="addVendor"
          >Add</n-button
        >
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
