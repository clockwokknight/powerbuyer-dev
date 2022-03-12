<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useGlobalState } from "@/store/global";
import Input from "@/components/_refactor/Input.vue";
const phone = ref(null);
</script>

<template>
  <main class="w-full h-100vh center-content p-[120px]">
    <Input
      label="Phone #"
      placeholder="(###) ###-####"
      :value="null"
      :validate="['required', 'phone']"
      @update:value="(val) => (phone.value = val)"
      @save="(e) => log('save', e)"
      @cancel="(e) => log('cancel', e)"
      @focus="(e) => log('focus', e)"
    />
  </main>
</template>
