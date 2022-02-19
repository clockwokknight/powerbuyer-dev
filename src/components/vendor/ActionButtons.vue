<script setup>
import { ref } from "vue";
import { NConfigProvider } from "naive-ui";

const themeOverrides = {
  Button: {
    textColor: "#000",
  },
};

defineEmits(["edit", "confirm"]);
const showModal = ref(false);
</script>

<template>
  <div class="flex items-center gap-x-3 justify-center">
    <n-button @click="$emit('edit')" class="group">
      <n-icon
        ><svg
          class="
            h-6
            w-6
            text-gray-300
            transition-colors
            group-hover:text-primary
          "
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <path
              d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z"
              fill="currentColor"
            ></path>
          </g></svg
      ></n-icon>
    </n-button>

    <n-button type="error" secondary @click="showModal = !showModal">
      Delete
    </n-button>
    <n-modal
      v-model:show="showModal"
      @positive-click="$emit('confirm')"
      content="Are you sure you want to delete?"
      positive-text="Yes"
      preset="dialog"
      type="error"
      @mask-click="showModal = false"
      @negative-click="showModal = false"
      negative-text="Cancel"
      title="Delete"
    />
  </div>
</template>

<style>
button.n-button[type="button"] {
  --n-color: #000;
  background-color: var(--n-color);
}
</style>
