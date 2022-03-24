<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import { useGlobalState } from "@/store/global";
import { utils, log } from "@/lib/utils";
import Input from "@/components/_refactor/Input.vue";
import CustomInput from "@/components/common/CustomInput.vue";
import Card from "@/components/_refactor/Card.vue";

const newPhone = ref("");

watchEffect(() => {
  log("newPhone.value", newPhone.value);
});
</script>

<template>
  <main class="fill-screen center-content p-[120px]">
    <Card class="p-[64px]">
      <CustomInput basic type="select" label="phone" v-model:value="newPhone" />
    </Card>
  </main>
</template>
