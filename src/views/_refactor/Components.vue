<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import { useGlobalState } from "@/store/global";
import { utils, log } from "@/lib/utils";

import Input from "@/components/_refactor/Input.vue";
import CustomInput from "@/components/common/CustomInput.vue";
import Card from "@/components/_refactor/Card.vue";

const form = ref({
  basic: "",
  cost: "",
  phone: "",
  select: "",
});

const code = ref([
  `       
  <CustomInput
    basic
    label="Basic Input"
    :validate="['required']"
    v-model:value="form.basic"
  />
  `,
  `       
  <CustomInput
    basic
    currency
    label="Cost"
    v-model:value="form.cost"
  />
  `,
  `       
  <CustomInput
    basic
    label="Phone"
    mask="(###) ### ####"
    :validate="['required', 'phone']"
    v-model:value="form.phone"
  />
  `,
  `       
  <CustomInput
    basic
    type="select"
    label="Pick an option"
    v-model:value="form.select"
  />
  `,
]);

const codeOpen = ref(false);
const current = ref(0);

watchEffect(() => {
  console.clear();
  log.cyan(" basic input: ", form.value.basic);
  log.cyan("  cost input: ", form.value.cost);
  log.cyan(" phone input: ", form.value.phone);
  log.cyan("select input: ", form.value.select);
});

function handleClick(context) {
  current.value = context;
  codeOpen.value = true;
}
</script>

<template>
  <main class="fill-screen center-content p-[120px]">
    <Card>
      <n-form :model="form" class="grid gap-[16px] grid-cols-1">
        <div class="flex">
          <CustomInput
            basic
            label="Basic Input"
            :validate="['required']"
            v-model:value="form.basic"
            class="__input"
          />
          <n-button @click="handleClick(0)" class="mt-[6px] ml-[16px]"
            >view code</n-button
          >
        </div>
        <div class="flex">
          <CustomInput
            basic
            currency
            label="Cost"
            v-model:value="form.cost"
            class="__input"
          />
          <n-button @click="handleClick(1)" class="mt-[6px] ml-[16px]"
            >view code</n-button
          >
        </div>
        <div class="flex">
          <CustomInput
            basic
            label="Phone"
            mask="(###) ### ####"
            :validate="['required', 'phone']"
            v-model:value="form.phone"
            class="__input"
          />
          <n-button @click="handleClick(2)" class="mt-[6px] ml-[16px]"
            >view code</n-button
          >
        </div>
        <div class="flex">
          <CustomInput
            basic
            type="select"
            label="Pick an option"
            v-model:value="form.select"
            class="__input"
          />
          <n-button @click="handleClick(3)" class="mt-[6px] ml-[16px]"
            >view code</n-button
          >
        </div>
      </n-form>
    </Card>
    <div
      class="h-[260px] duration-[300ms] ml-[24px] bg-black border-[1px] border-[#ffffff21] rounded-round overflow-hidden"
      :class="codeOpen ? 'w-[400px]' : 'w-[0px] opacity-0 pointer-events-none'"
    >
      <div
        @click="codeOpen = false"
        class="py-[8px] px-[14px] float-right cursor-pointer truncate overflow-hidden bg-[#ffffff21] hover:bg-red-400"
      >
        X
      </div>
      <pre class="overflow-hidden">
      <code class="overflow-hidden">
        {{ code[current] }}
      </code>
    </pre>
    </div>
  </main>
</template>

<style scoped>
.__input {
  @apply w-full;
}
</style>
