<script setup>
import { ref } from "vue";

const emits = defineEmits(["add", "edit", "delete"]);
const deleteModal = ref(false);
const onDelete = () => {
  emits("delete");
  deleteModal.value = false;
};
</script>

<template>
    <div class="flex content-center justify-center space-x-3">
    <n-tooltip>
      <template #trigger>
      <button
        class="text-gray-300 hover:text-primary md:invisible md:group-hover:visible"
        @click="$emit('edit')"
      >
        <n-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
          >
            <g fill="none">
              <path
                d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </n-icon>
      </button>
      </template>
      Edit Item
    </n-tooltip>
    <n-button-group>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button round class="w-4" @click="deleteModal = true">
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <line
                  x1="400"
                  y1="256"
                  x2="112"
                  y2="256"
                  style="
                    fill: none;
                    stroke: currentcolor;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-width: 32px;
                  "
                ></line>
              </svg>
            </n-icon>
          </n-button>
        </template>
        Remove Item
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button round class="w-4" @click="$emit('add')">
            <n-icon>
              <svg
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M256 112V400M400 256H112"
                  stroke="currentColor"
                  stroke-width="32"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </n-icon>
          </n-button>
        </template>
        Add Item
      </n-tooltip>
    </n-button-group>
  </div>
  <n-modal
    preset="dialog"
    type="error"
    title="Delete Expense"
    content="Are you sure?"
    positive-text="Delete"
    negative-text="Cancel"
    @negative-click="deleteModal = false"
    @positive-click="onDelete"
    v-model:show="deleteModal"
  >
  </n-modal>
</template>
