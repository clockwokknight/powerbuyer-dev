<template>
  <div class="w-full h-100vh center-content p-[120px]">
    phone
    <masked-input class="mx-4" :masked="true" :mask="'+1 (###) ### ####'" />
    fax
    <masked-input class="mx-4" :masked="true" :mask="'+1 (###) ### ####'" />
    taxid
    <masked-input class="mx-4" :masked="true" :mask="'### ## ####'" />
  </div>
</template>

<script setup>
import MaskedInput from "@/components/common/MaskedInput.vue";
</script>

<style></style>
