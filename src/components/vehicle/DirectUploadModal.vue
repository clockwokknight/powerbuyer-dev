<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { useMessage, useDialog } from "naive-ui";
import {
  getDealIdByVin,
  getDocuments,
  getDocumentTypeOptions,
} from "@/hooks/document";
import {
  SAVE_FILE_FORM_RULES,
  FILE_TYPES,
  PIXEL_TYPE_OPTIONS,
  RESOLUTION_OPTIONS,
} from "./util";

const route = useRoute();
const routeParamId = ref(route.params?.id);
watch(
  () => route.params?.id,
  (val) => {
    if (route.params?.id) {
      routeParamId.value = route.params?.id;
    }
  },
  {
    immediate: true,
  }
);

const props = defineProps({
  showDirectUploadModal: {
    type: Boolean,
    default: false,
  },
});
const showModal = ref(true);

watch(
  () => showModal,
  (val) => {
    console.log(val);
    if (!val) {
      handleClose();
    }
  }
);

// const emit = defineEmits(["update:showDirectUploadModal"]);

const { data: documentTypeOptions, isLoading: isDocTypeLoading } =
  getDocumentTypeOptions();

const saveFileFormRef = ref(null);
const saveFileFormMessage = useMessage();
const saveFileFormValue = ref({
  title: "",
  description: "",
  doc_type: "1",
});
const saveFileFormRules = {
  title: {
    required: true,
    message: "Please input title",
    trigger: "blur",
  },
  doc_type: {
    required: true,
    message: "Please select type",
    trigger: "blur",
  },
};

const saveFile = (e) => {
  e.preventDefault();
  saveFileFormRef.value?.validate((errors) => {
    if (!errors) {
      uploadToServer();
    } else {
      return;
    }
  });
};

const uploadToServer = () => {
  const formValue = saveFileFormValue.value;
};

const handleClose = () => {
  alert("aaa");
};
</script>
<template>
  <n-modal v-model:show="showModal" @close="handleClose">
    <n-card
      style="max-width: 1248px"
      title="Upload Document"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra> </template>
      <!-- Content -->
      <div id="DWTcontainer" class="grid grid-cols-3 gap-4">
        <div class="col-span-2"></div>
        <div class="col-span-1">
          <n-card
            title="Save Documents"
            size="small"
            class="mt-4"
            v-if="!isDocTypeLoading"
          >
            <n-form
              ref="saveFileFormRef"
              :label-width="80"
              :model="saveFileFormValue"
              :rules="saveFileFormRules"
              class="grid grid-cols-3 gap-2"
            >
              <n-form-item label="Title" path="title" class="col-span-2">
                <n-input
                  v-model:value="saveFileFormValue.title"
                  placeholder="Title"
                />
              </n-form-item>
              <n-form-item label="Type" path="doc_type" class="col-span-3">
                <n-select
                  class="w-full"
                  v-model:value="saveFileFormValue.doc_type"
                  :options="documentTypeOptions"
                  clearable
                />
              </n-form-item>
              <n-form-item
                label="Description"
                path="description"
                class="col-span-3"
              >
                <n-input
                  v-model:value="saveFileFormValue.description"
                  placeholder="Description"
                  type="textarea"
                />
              </n-form-item>

              <n-button @click="saveFile"> Upload </n-button>
            </n-form>
          </n-card>
        </div>
      </div>
      <template #footer> </template>
    </n-card>
  </n-modal>
</template>
