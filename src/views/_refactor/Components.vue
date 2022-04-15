<script setup>
import { ref, reactive, watchEffect } from "vue";
import { utils, log } from "@/lib/utils";

import Input from "@/components/common/Input.vue";
import Card from "@/components/_refactor/Card.vue";

const form = reactive({
  basic: "",
  phone: "",
  disabled: "",
  warning: "",
  error: "",
  textarea: "",
  resize: "",
  editable: "some data for you",
});

const query = ref("");
const searchStatus = ref("Ready to search");

function fetchStuff() {
  searchStatus.value = "Fetched data: { ... }";
}
</script>

<template>
  <main class="fill-screen center-content p-[120px]">
    <Card class="__main p-[64px] h-[60vh]">
      <Input
        class="__input"
        label="Required input"
        placeholder="Type here"
        v-model:value="form.basic"
        :rules="['required']"
      />
      <Input
        class="__input"
        label="Phone number"
        v-model:value="form.phone"
        :rules="['required', 'phone']"
        :mask="'(###) ###-####'"
      />
      <Input
        class="__input"
        label="Disabled Input"
        placeholder="You can't type here"
        v-model:value="form.disabled"
        disabled
      />
      <Input
        class="__input"
        label="Textarea"
        placeholder="Notes"
        v-model:value="form.textarea"
        type="textarea"
        editable
      />
      <Input
        class="mb-[24px] min-w-[150px]"
        label="Autosize"
        placeholder="Title"
        v-model:value="form.resize"
        autosize
      />
      <div class="relative">
        <Input
          class="__input !mb-0"
          label="Debounce (1500ms)"
          placeholder="Search"
          v-model:value="query"
          :debounce="1500"
          @debounced="fetchStuff"
          @typing="searchStatus = 'Typing...'"
        />
        <Card class="w-[250px] mb-[36px] rounded-t-none">
          <div class="flex">
            <span class="opacity-50">Status:</span>
            <span class="ml-[6px]">{{ searchStatus }}</span>
          </div>
        </Card>
      </div>
      <Input
        class="__input"
        label="Editable Input"
        placeholder="Edit me"
        :value="form.editable"
        v-model:value="form.editable"
        editable
        :rules="['required']"
      />
    </Card>
  </main>
</template>

<style lang="scss" scoped>
.__main {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 32px;
}
.__input {
  width: 250px;
}
</style>
