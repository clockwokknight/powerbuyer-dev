<script setup>
import { ref, reactive, watchEffect } from "vue";
import { utils, log } from "@/lib/utils";

import Input from "@/components/common/Input.vue";
import Card from "@/components/_refactor/Card.vue";

const form = reactive({
  basic: "",
  disabled: "",
  warning: "",
  error: "",
  textarea: "",
  resize: "",
  editable: "edit me plz",
});

const query = ref("");
const searchStatus = ref("Ready to search");

function fetchStuff() {
  searchStatus.value = "Fetched data: { ... }";
}
</script>

<template>
  <main class="fill-screen center-content p-[120px]">
    <Card class="p-[24px]">
      <Input
        class="w-[400px]"
        label="Basic input"
        placeholder="Type here"
        v-model:value="form.basic"
        :rules="['required']"
      />
      <Input
        class="mt-[24px] w-[400px]"
        label="Disabled Input"
        placeholder="You can't type here"
        v-model:value="form.disabled"
        disabled
      />
      <Input
        class="mt-[24px] w-[400px]"
        label="Warning state"
        placeholder="Something isn't quite right"
        v-model:value="form.warning"
        status="warning"
      />
      <Input
        class="mt-[24px] w-[400px]"
        label="Error state"
        placeholder="Invalid input"
        v-model:value="form.error"
        status="error"
      />
      <Input
        class="mt-[24px] w-[400px]"
        label="Textarea"
        placeholder="Notes"
        v-model:value="form.textarea"
        type="textarea"
      />
      <Input
        class="mt-[24px] min-w-[100px]"
        label="Autosize"
        placeholder="Title"
        v-model:value="form.resize"
        autosize
      />
      <Input
        class="mt-[24px] w-[400px] rounded-b-none"
        label="Debounce (1500ms)"
        placeholder="Search"
        v-model:value="query"
        :debounce="1500"
        @debounced="fetchStuff"
        @typing="searchStatus = 'Typing...'"
      />
      <!-- ☝️ @typing could be @change, @input, etc -->
      <Card class="w-[400px] rounded-t-none">
        <div class="flex">
          <span class="opacity-50">Status:</span>
          <span class="ml-[6px]">{{ searchStatus }}</span>
        </div>
      </Card>
      <Input
        class="mt-[24px] w-[400px] rounded-b-none"
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
