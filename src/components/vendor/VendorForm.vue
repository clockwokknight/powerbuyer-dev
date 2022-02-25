<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import Input from "@/components/common/CustomInput.vue";

const opts = ref([
  {
    label: "Option 1",
    value: "One",
  },
  {
    label: "Option 2",
    value: "Two",
  },
  {
    label: "Option 3",
    value: "Three",
  },
  {
    label: "Option 4",
    value: "Four",
  },
  {
    label: "Option 5",
    value: "Five",
  },
]);
</script>

<template>
  <div class="__form block">
    <h3 class="font-bold translate-x-4 mb-4">VENDOR</h3>
    <Input type="header" placeholder="Company Name" />
    <div class="grid grid-cols-12 gap-4 mt-12">
      <!-- row 1 -->
      <div class="col-span-6">
        <Input label="Address" />
      </div>
      <div class="col-span-6">
        <Input label="Address 2" />
      </div>
      <!-- row 2 -->
      <div class="col-span-4">
        <Input label="City" />
      </div>
      <div class="col-span-4">
        <Input type="select" :options="opts" label="State" placeholder="Missouri" />
      </div>
      <div class="col-span-4">
        <Input label="Zip Code" />
      </div>
      <!-- row 3 -->
      <div class="col-span-4">
        <Input label="Email" placeholder="" />
      </div>
      <div class="col-span-4">
        <Input label="Phone" mask="+1 (###) ### ####" placeholder="(###) ### ####" />
      </div>
      <div class="col-span-4">
        <Input label="Fax" placeholder="" />
      </div>
      <!-- row 4 -->
      <div class="col-span-4">
        <Input label="DIN" />
      </div>
      <div class="col-span-4">
        <Input label="Tax ID" />
      </div>
      <div class="col-span-4">
        <Input type="select" :options="opts" label="Vendor Category" />
      </div>
    </div>
  </div>
</template>
