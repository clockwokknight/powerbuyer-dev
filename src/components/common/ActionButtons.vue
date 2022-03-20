<script setup>
import { ref } from "vue";
const showDeleteModal = ref(false);
defineEmits(["edit", "delete"]);
defineProps({
  /**
   * Show the title for delete dialog prompt
   */
  deleteTitle: {
    type: String,
    default: "Delete",
  },
  /**
   * If delete button should be visible
   */
  showDeleteButton: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex items-center justify-center gap-x-3">
    <!--    Edit Button -->
    <n-button @click="$emit('edit')" class="group">
      <n-icon
        ><svg
          class="h-6 w-6 text-gray-300 transition-colors group-hover:text-primary"
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
    <!--   Delete Button -->
    <n-button @click="showDeleteModal = true">
      <n-icon>
        <svg
          class="cubic-timing-tab h-2 w-2 text-red-500 transition-transform duration-300"
          viewBox="0 0 11 11"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.00007 9.72795L9.72803 1"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M9.72844 9.72795L1.00049 1"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </n-icon>
    </n-button>

    <!--   Delete Button Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteModal"
      @negative-click="showDeleteModal = false"
      @positive-click="$emit('delete', true)"
      :title="deleteTitle"
      content="Are you sure?"
      positive-text="Delete"
      negative-text="Cancel"
      preset="dialog"
      type="error"
    ></n-modal>
  </div>
</template>

<style>
button.n-button[type="button"] {
  --n-color: #000;
  background-color: var(--n-color);
}
</style>
