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
    Add Expense
  </n-button>
  <n-drawer v-model:show="showOuter" :width="500">
    <n-drawer-content title="Add Expense">
      <n-form :model="formValue" :label-width="90" size="medium" ref="formRef">
        <n-form-item label="VIN" path="vin" class="pt-0">
          <n-select
            placeholder="Search VIN"
            :options="vehiclelist"
            v-model:value="formValue.vin"
            filterable
          />
          <!-- <n-input type="text" min-length="2" placeholder="Enter VIN" clearable v-model:value.trim="formValue.name" /> -->
        </n-form-item>
        <n-form-item
          label="Expense Item(s)"
          disabled
          path="expense_item"
          class="pt-0"
        >
          <n-dynamic-input
            v-model:value="value"
            placeholder="Please type Expense Item here"
            :options="vehicelist"
            :min="1"
            :max="20"
          />
        </n-form-item>

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

<script>
import { defineComponent, ref } from "vue";
import vehicles from "@/api/vehicles";
import deals from "@/api/deals";
import { useMessage } from "naive-ui";
import MaskedInput from "@/components/common/MaskedInput.vue";

export default defineComponent({
  setup() {
    const showOuterRef = ref(false);

    const formRef = ref(null);
    const message = useMessage();

    const vehiclelist = ref([]);

    deals.all().then((res) => {
      vehiclelist.value = res.data.data.map((v) => ({
        label: v.vin,
        value: v.id,
      }));
    });

    function addExpense() {
      var deal_id = this.formValue.vin; // this passes value which is id, rather than vin. see how vehicle list is pulled.
      console.log(deal_id);
    }

    return {
      formRef,
      formValue: ref({}),

      vehiclelist,
      addExpense,

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
