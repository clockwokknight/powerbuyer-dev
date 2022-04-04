<script setup>
import { ref } from "vue";

const emits = defineEmits(["add", "edit", "delete", "view"]);
const deleteModal = ref(false);
const onDelete = () => {
  emits("delete");
  deleteModal.value = false;
};
</script>

<template>
  <div class="flex content-center justify-center gap-x-2">
    <n-tooltip>
      <template #trigger>
        <button
          class="hover:text-primary dark:text-gray-300 md:invisible md:group-hover:visible"
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
    <n-tooltip trigger="hover">
      <template #trigger>
        <button
          class="hover:text-primary dark:text-gray-300 md:invisible md:group-hover:visible"
          @click="$emit('view')"
        >
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="304"
              height="304"
              viewBox="0 0 304 304"
              fill="none"
            >
              <path
                d="M140.796 186.946L117.05 163.2L245.848 34.3981L179.993 34.402V0.799988H286.393C290.85 0.799988 295.124 2.56958 298.276 5.71802C301.424 8.87048 303.194 13.144 303.194 17.601L303.198 124.001H269.596V58.146L140.796 186.946Z"
                fill="currentColor"
              />
              <path
                d="M241.6 303.2H62.3999C46.064 303.2 30.396 296.712 18.8447 285.157C7.29004 273.606 0.801758 257.938 0.801758 241.602V62.4019C0.801758 46.0659 7.28955 30.3979 18.8447 18.8469C30.396 7.29218 46.064 0.803894 62.3999 0.803894H124.002V34.4019H62.3999C54.9736 34.4019 47.8525 37.355 42.6025 42.605C37.3525 47.855 34.3994 54.9762 34.3994 62.402V241.602C34.3994 249.028 37.3525 256.149 42.6025 261.399C47.8525 266.649 54.9741 269.602 62.3999 269.602H241.6C249.026 269.602 256.147 266.649 261.397 261.399C266.647 256.149 269.6 249.028 269.6 241.602V180H303.198V241.602C303.198 257.938 296.71 273.606 285.155 285.157C273.604 296.712 257.936 303.2 241.6 303.2Z"
                fill="currentColor"
              />
            </svg>
          </n-icon>
        </button>
      </template>
      Open Invoice
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
              <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    title="Remove Invoice"
    content="Are you sure?"
    positive-text="Delete"
    negative-text="Cancel"
    @negative-click="deleteModal = false"
    @positive-click="onDelete"
    v-model:show="deleteModal"
  >
  </n-modal>
</template>
