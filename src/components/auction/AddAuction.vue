<script setup>
import { ref } from "vue";
import MaskedInput from "@/components/common/MaskedInput.vue";
import { getStates } from "@/hooks/common_query";

const showDrawer = ref(false);

const initialForm = {
  code: "",
  auction_company: "",
  address_one: "",
  address_two: "",
  email: "",
  phone: "",
  fax: "",
  city: "",
  state: null,
  zip: "",
};

const form = ref({ ...initialForm });

const { data: stateList } = getStates();

const rules = {
  code: {
    required: true,
    message: "Code is required",
    trigger: "input",
  },
  auction_company: {
    required: true,
    message: "Please provide Auction Company",
    trigger: "input",
  },
  address_one: {
    required: true,
    message: "Address is required",
    trigger: "input",
  },
  city: {
    required: true,
    message: "City is required",
    trigger: "input",
  },
  state: {
    required: true,
    message: "State is required",
    trigger: "input",
  },
  zip: {
    required: true,
    message: "Zip is required",
    trigger: "input",
  },
  email: {
    required: true,
    trigger: "input",
    validator(rules, value) {
      if (!/(^[a-zA-Z0-9_.]+[@]{1}[a-z0-9]+[\.][a-z]+$)/.test(value))
        return new Error("Please enter a valid email address.");
    },
  },
  phone: {
    required: true,
    validator(rules, value) {
      if (!/^[(]\d{3}[)][\s]?\d{3}[-\s]?\d{4}$/.test(value))
        return new Error("Please enter a valid phone number");
    },
    trigger: "input",
  },
};
</script>

<template>
  <n-button
    @click="showDrawer = true"
    content="Create Auction"
    v-tippy="{ placement: 'right', duration: 50 }"
  >
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
  <n-drawer v-model:show="showDrawer" :width="500">
    <n-drawer-content title="Add Auction">
      <n-form :model="form" :rules="rules" size="medium" ref="formRef">
        <n-form-item label="Auction Company" path="auction_company">
          <n-input v-model:value="form.auction_company" />
        </n-form-item>
        <n-form-item path="code" label="Code">
          <n-input v-model:value="form.code" />
        </n-form-item>
        <n-form-item path="address_one" label="Address 1">
          <n-input v-model:value="form.address_one" />
        </n-form-item>
        <n-form-item label="Address 2">
          <n-input v-model:value="form.address_two" />
        </n-form-item>
        <n-form-item label="City" path="city">
          <n-input v-model:value="form.city" />
        </n-form-item>
        <div class="grid gap-4 md:grid-cols-2">
          <n-form-item path="state" label="State">
            <n-select
              :options="stateList"
              filterable
              v-model:value="form.state"
            />
          </n-form-item>
          <n-form-item path="zip" label="Zip">
            <masked-input mask="#####-####" v-model:value="form.zip" masked />
          </n-form-item>
        </div>
        <n-form-item label="Email" path="email">
          <n-input v-model:value="form.email" />
        </n-form-item>
        <n-form-item label="Phone" path="phone">
          <masked-input
            mask="(###) ###-####"
            masked
            v-model:value="form.phone"
          />
        </n-form-item>
        <n-form-item label="Fax">
          <masked-input mask="(###) ###-####" masked v-model:value="form.fax" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button size="large">Add</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
