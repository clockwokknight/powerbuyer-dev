<script setup>
import { watch, computed, ref } from "vue";
import { useGlobalState } from "@/store/global";
import { useMessage } from "naive-ui";
import vendors from "@/api/vendors";

import MaskedInput from "@/components/common/MaskedInput.vue";

const rules = {
  name: {
    required: true,
    message: "Please enter a Name",
    trigger: ["input"],
  },
  description: {
    required: false,
    message: "Please enter a valid Description",
    trigger: ["input"],
  },
  type: {
    required: true,
    message: "Please enter a valid type",
    trigger: ["input"],
  },
  amount: {
    required: true,
    message: "Please select a valid amount",
    trigger: ["input"],
  },
};

const global = useGlobalState();
const message = useMessage();

const showOuterRef = ref(false);
const formValue = ref({});
const formRef = ref(null);

let drawer = computed(() => global.drawer);

watch(drawer, (val) => {
  showOuterRef.value = val.active;
});

function validateEmail(v) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) {
    console.log("success");
  } else {
  }
}

function addExpense() {
  formRef.value.validate((errors) => {
    console.log(route.params?.id);
    validateEmail(this.formValue.email);
    if (!errors) {
      const data = {
        vendor_id: route.params?.id,
        name: this.formValue.name,
        description: this.formValue.description,
        type: this.formValue.type,
        amount: this.formValue.amount,
      };
      vendors
        .addContacts(data)
        .then((res) => {
          message.success("Successfully added contact!");
          global.hideDrawer;
        })
        .finally((res) => {
          (this.formValue.id = 0),
            (this.formValue.name = ""),
            (this.formValue.description = ""),
            (this.formValue.type = ""),
            (this.formValue.amount = "");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(errors);
    }
  });
}
</script>

<template>
  <n-button class="w-[220px]" @click="global.openDrawer('payments')">
    <n-icon>
      <svg viewBox="0 0 24 24">
        <path
          d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
          fill="currentColor"
        ></path>
      </svg>
    </n-icon>
    Add Payment
  </n-button>
  <n-drawer v-model:show="showOuterRef" :on-update:show="global.closeDrawer" :width="500">
    <n-drawer-content title="Add Payment">
      <n-form
        :model="formValue"
        :label-width="90"
        :rules="rules"
        size="medium"
        ref="formRef"
      >
        <n-form-item label="Name" path="name" class="pt-0">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Name"
            clearable
            v-model:value.trim="formValue.name"
          />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <masked-input
            mask="(###) ###-####"
            placeholder="Enter Description"
            clearable
            v-model:value="formValue.description"
          />
        </n-form-item>
        <n-form-item label="Type" path="type">
          <masked-input
            mask="(###) ###-####"
            placeholder="Enter Type"
            clearable
            v-model:value="formValue.type"
          />
        </n-form-item>
        <n-form-item label="Amount" path="amount">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Amount"
            clearable
            v-model:value.trim="formValue.amount"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button size="large" @click="addExpense()">Add</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
