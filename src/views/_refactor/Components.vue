<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useGlobalState } from "@/store/global";
import { utils, log } from "@/lib/utils";
import Input from "@/components/_refactor/Input.vue";
import CustomInput from "@/components/common/CustomInput.vue";
const phone = ref();
</script>

<template>
  <main class="fill-screen center-content p-[120px] bg-white">
    <Input
      label="Normal Input"
      placeholder="Type something"
      :value="'init value'"
      v-model="phone.value"
      @save="(e) => log('save', e)"
      @cancel="(e) => log('cancel', e)"
      @focus="(e) => log('focus', e)"
    />
  </main>
</template>
