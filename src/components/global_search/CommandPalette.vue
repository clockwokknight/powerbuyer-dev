<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      as="div"
      @close="closeModal"
      class="z-max fixed inset-0 overflow-y-auto px-6 pt-10 md:pt-28"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <DialogOverlay class="fixed inset-0 bg-[#00000066]" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <div>
          <GlobalSearch />
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
} from "@headlessui/vue";
import GlobalSearch from "@/components/global_search/GlobalSearch.vue";

import { useEventListener } from "@vueuse/core";

const isOpen = ref(false);

const handleKeyEvent = (evt) => {
  if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
    openModal();
    evt.preventDefault();
  }
};

useEventListener(window, "keydown", handleKeyEvent);

function closeModal() {
  isOpen.value = false;
}

function openModal() {
  isOpen.value = true;
}
</script>
