<template>
  <n-button @click="doShowOuter">
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
    Add Contact
  </n-button>
  <n-drawer v-model:show="showOuter" :width="500">
    <n-drawer-content title="Add Vendor Contact">
      <n-form
        :model="formValue"
        :label-width="90"
        :rules="rules"
        size="medium"
        ref="formRef"
      >
        <n-form-item label="First Name" path="first_name" class="pt-0">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Name"
            clearable
            v-model:value.trim="formValue.first_name"
          />
        </n-form-item>
        <n-form-item label="Last Name" path="last_name" class="pt-0">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Name"
            clearable
            v-model:value.trim="formValue.last_name"
          />
        </n-form-item>

        <n-form-item label="Cell" path="cell_phone">
          <masked-input
            mask="(###) ###-####"
            placeholder="Enter Cell Phone"
            clearable
            v-model:value="formValue.cell_phone"
          />
        </n-form-item>
        <n-form-item label="Office" path="office_phone">
          <masked-input
            mask="(###) ###-####"
            placeholder="Enter Office Phone"
            clearable
            v-model:value="formValue.office_phone"
          />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Email"
            clearable
            v-model:value.trim="formValue.email"
          />
        </n-form-item>
        <n-form-item label="Position" path="job_title">
          <n-input
            type="text"
            min-length="2"
            placeholder="Enter Job Title"
            clearable
            v-model:value.trim="formValue.job_title"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button size="large" @click="addVendor()">Add</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import vendors from "@/api/vendors";
import { useMessage } from "naive-ui";
import MaskedInput from "@/components/common/MaskedInput.vue";
import { useQueryClient } from "vue-query";

export default defineComponent({
  emits: ["getContacts"],
  setup() {
    const showOuterRef = ref(false);
    const route = useRoute();
    const formRef = ref(null);
    const message = useMessage();
    const queryClient = useQueryClient();
    function addVendor() {
      formRef.value.validate((errors) => {
        if (!errors) {
          const data = {
            vendor_id: route.params?.id,
            first_name: this.formValue.first_name || "",
            last_name: this.formValue.last_name || "",
            office_phone: this.formValue.office_phone,
            cell_phone: this.formValue.cell_phone || "",
            email: this.formValue.email || "",
            job_title: this.formValue.job_title || "",
          };
          let filteredData = Object.fromEntries(
            Object.entries(data).filter((value) => value[1])
          );

          vendors
            .addContacts(filteredData)
            .then((res) => {
              queryClient.invalidateQueries([
                "vendorContacts",
                route.params?.id,
              ]);
              message.success("Successfully added contact!");
            })
            .finally((res) => {
              showOuterRef.value = false;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log(errors);
        }
      });
    }

    return {
      formRef,
      formValue: ref({}),
      rules: {
        first_name: {
          required: true,
          message: "Please enter the First Name",
          trigger: ["input"],
        },
        last_name: {
          required: true,
          message: "Please enter the Last Name",
          trigger: ["input"],
        },
        cell_phone: {
          required: false,
          message: "Please enter a valid Cell Phone #",
          trigger: ["input"],
        },
        email: {
          required: false,
          message: "Please enter a valid Email Address",
          trigger: ["input"],
        },
      },
      addVendor,

      showOuter: showOuterRef,

      doShowOuter() {
        showOuterRef.value = true;
      },
    };
  },

  components: {
    MaskedInput,
  },
});
</script>
