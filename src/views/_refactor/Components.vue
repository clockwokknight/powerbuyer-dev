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

watchEffect(() => {
  console.clear();
  log.cyan(" basic input: ", form.value.basic);
  log.cyan("  cost input: ", form.value.cost);
  log.cyan(" phone input: ", form.value.phone);
  log.cyan("select input: ", form.value.select);
});
</script>

<template>
  <main class="fill-screen center-content p-[120px]">
    <Card>
      <n-form :model="form" class="grid gap-[24px] grid-cols-1">
        <CustomInput
          basic
          required
          label="Basic Input"
          v-model:value="form.basic"
          class="__input"
        />
        <CustomInput
          basic
          currency
          label="Cost"
          v-model:value="form.cost"
          class="__input"
        />
        <CustomInput
          basic
          phone
          label="Phone"
          required
          v-model:value="form.phone"
          class="__input"
        />
        <CustomInput
          basic
          select
          label="Pick an option"
          v-model:value="form.select"
          class="__input"
        />
      </n-form>
    </Card>
  </main>
</template>

<style scoped>
.__input {
  @apply grid-cols-1;
}
</style>
