<script setup>
import { ref, watchEffect } from "vue";
import { utils, log } from "@/lib/utils";

import LabeledInput from "@/components/common/LabeledInput.vue";
import Card from "@/components/_refactor/Card.vue";

const form = ref({
  basic: "",
});

watchEffect(() => {
  console.clear();
  log.cyan(" basic input: ", form.value.basic);
});
</script>

<template>
  <main class="fill-screen center-content p-[120px]">
    <Card class="p-[180px]">
      <LabeledInput
        class="w-[400px]"
        :label="'Notes'"
        placeholder="my placeholder"
        v-model:value="form.basic"
      />
    </Card>
  </main>
</template>

<style scoped></style>
