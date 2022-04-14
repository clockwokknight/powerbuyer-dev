<script setup>
import { reactive, watchEffect } from "vue";
import { utils, log } from "@/lib/utils";

import Input from "@/components/common/Input.vue";
import Card from "@/components/_refactor/Card.vue";

const form = reactive({
  note: "",
});
</script>

<template>
  <main class="fill-screen center-content p-[120px]">
    <Card class="p-[180px]">
      <Input
        class="w-[400px]"
        label="Notes"
        placeholder="my placeholder"
        v-model:value="form.note"
        :debounce="500"
        @debounced="log('debounced')"
        disabled
      />
      <Input
        class="w-[400px]"
        label="Notes"
        placeholder="my placeholder"
        v-model:value="form.note"
        :debounce="500"
        @debounced="log('debounced')"
      />
      <Input
        class="w-[400px]"
        label="Notes"
        placeholder="my placeholder"
        v-model:value="form.note"
        :debounce="500"
        @debounced="log('debounced')"
      />
      <Input
        class="w-[400px]"
        label="Notes"
        placeholder="my placeholder"
        v-model:value="form.note"
        :debounce="500"
        @debounced="log('debounced')"
      />
    </Card>
  </main>
</template>
