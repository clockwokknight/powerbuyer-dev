<script setup>
import TextInput from "@/components/common/TextInput.vue";
import { ref } from "vue";

const price = ref(0);
</script>

<template>
  <div>
    <h1>Inventory</h1>
    <text-input v-model="price" />
    {{ price }}
  </div>
</template>
