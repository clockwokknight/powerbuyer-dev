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

const props = defineProps({
  dealId: Number,
});
const emit = defineEmits(["refetch"]);

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

const showDirectUploadModal = ref(false);
const handleDirectUpload = () => {
  showDirectUploadModal.value = true;
};

const { data: documentTypeOptions, isLoading: isDocTypeLoading } =
  getDocumentTypeOptions();

const previewImageUrl = ref("");
const fileList = ref([]);

const handleChange = (data) => {
  console.log(data);
  if (data.fileList.length > 0) {
    fileList.value = [data.fileList[data.fileList.length - 1]];
  } else fileList.value = [];
};

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

const initFormValue = () => {
  saveFileFormValue.value = {
    title: "",
    description: "",
    doc_type: "1",
  };
};

const saveFile = (e) => {
  e.preventDefault();
  console.log(props.dealId);
  if (fileList.value.length < 1) return;
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
  let formData = new FormData();
  formData.append("RemoteFile", fileList.value[0].file);
  formData.append("deal_id", props.dealId);
  formData.append("title", formValue.title);
  formData.append("type", formValue.doc_type);
  formData.append("description", formValue.description);
  axios
    .post("/documents", formData)
    .then(function (response) {
      saveFileFormMessage.success("Successfully uploaded");
      initFormValue();
      emit("refetch");
    })
    .catch(function (error) {
      console.log(error);
      saveFileFormMessage.error("upload failed");
    });
};

const handleClose = () => {
  console.log("closed");
};
</script>
<template>
  <n-button class="w-[220px]" @click="handleDirectUpload"
    >Direct Upload</n-button
  >
  <n-modal
    v-model:show="showDirectUploadModal"
    class="w-[1220px] min-w-[1220px]"
    preset="card"
    title="Direct Upload"
  >
    <template #header-extra> </template>
    <!-- Content -->
    <div id="DWTcontainer" class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <n-upload
          :default-upload="false"
          @change="handleChange"
          :file-list="fileList"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  enable-background="new 0 0 512 512"
                >
                  <g>
                    <g>
                      <path
                        d="M480.6,319c-11.3,0-20.4,9.1-20.4,20.4v120.7H51.8V339.4c0-11.3-9.1-20.4-20.4-20.4c-11.3,0-20.4,9.1-20.4,20.4v141.2    c0,11.3,9.1,20.4,20.4,20.4h449.2c11.3,0,20.4-9.1,20.4-20.4V339.4C501,328.1,491.9,319,480.6,319z"
                      />
                      <path
                        d="m146.2,170l89.4-89.3v259.1c0,11.3 9.1,20.4 20.4,20.4 11.3,0 20.4-9.1 20.4-20.4v-259.1l89.4,89.3c12.3,11.4 24.9,4 28.9,0 8-8 8-20.9 0-28.9l-124.3-124.1c-8-8-20.9-8-28.9,0l-124.1,124.1c-8,8-8,20.9 0,28.9 7.9,8 20.9,8 28.8,0z"
                      />
                    </g>
                  </g>
                </svg>
              </n-icon>
            </div>
            <n-text style="font-size: 16px">
              Click or drag a file to this area to upload
            </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0"> </n-p>
          </n-upload-dragger>
        </n-upload>

        <n-image :src="previewImageUrl" preview-disabled />
      </div>
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
            <n-form-item label="Title" path="title" class="col-span-3">
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
  </n-modal>
</template>
<style>
.n-upload-trigger {
  width: 100%;
}
</style>
