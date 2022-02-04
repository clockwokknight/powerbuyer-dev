<script setup>
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { ref } from "vue";

const price = ref(0);
</script>

<template>
  <div>
    <h1>Inventory</h1>
    <currency-input v-model="price" />
  </div>
</template>
