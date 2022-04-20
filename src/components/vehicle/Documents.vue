<script setup>
import axios from "axios";
import ActionButtons from "@/components/vehicle/DocumentActionButtons.vue";
import { h, ref, computed, watch, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { utils, log } from "@/lib/utils";
import { useMutation } from "vue-query";
import Dynamsoft from "dwt";
import { useMessage } from "naive-ui";
import {
  getDealIdByVin,
  getDocuments,
  getDocumentTypeOptions,
} from "@/hooks/document";

const route = useRoute();
const routeParamId = ref(route.params?.id);

const { data: dealId, isLoading: isDealsLoading } =
  getDealIdByVin(routeParamId);
const {
  data: documents,
  isLoading: isDocsLoading,
  refetch,
} = getDocuments(dealId);

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

const containerId = "dwtControlContainer";
const bWASM = ref(false);

const saveFileFormRef = ref(null);
const saveFileFormMessage = useMessage();
const saveFileFormValue = ref({
  title: "",
  file_type: "pdf",
  description: "",
  doc_type: "1",
});

const saveFileFormRules = {
  file_type: {
    required: true,
    message: "Please select file type",
    trigger: "blur",
  },
  doc_type: {
    required: true,

    message: "Please select type",
    trigger: "blur",
  },
};

const fileTypes = [
  {
    label: "PDF",
    value: "pdf",
  },
  {
    label: "JPG",
    value: "jpg",
  },
  ,
  {
    label: "PNG",
    value: "png",
  },
  ,
  {
    label: "BMP",
    value: "bmp",
  },
];
const { data: documentTypeOptions, isLoading: isDocTypeLoading } =
  getDocumentTypeOptions();

let DWObject;
let selectSources;

const initFormValue = () => {
  saveFileFormValue.value = {
    title: "",
    file_type: "pdf",
    description: "",
    doc_type: "1",
  };
};

const saveFile = (e) => {
  e.preventDefault();
  if (DWObject.HowManyImagesInBuffer == 0) {
    saveFileFormMessage.error("There is no image in buffer.");
    return;
  }
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
  var strHTTPServer, strActionPage, strImageType;

  var fileName = formValue.title;

  strHTTPServer = "https://gmtvinventory.com";
  DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;

  strActionPage = "/api/documents";
  var strPageType = formValue.file_type;
  switch (strPageType) {
    case "bmp":
      strImageType = 0;
      break;
    case "jpg":
      strImageType = 1;
      break;
    case "tif":
      strImageType = 2;
      break;
    case "png":
      strImageType = 3;
      break;
    case "pdf":
      strImageType = 4;
      break;
  }

  var replaceStr = "<";
  fileName = fileName.replace(new RegExp(replaceStr, "gm"), "&lt;");
  var uploadfilename = fileName + "." + strPageType;

  const OnSuccess = (httpResponse) => {
    saveFileFormMessage.success("Successfully uploaded");
    initFormValue();
    refetch.value();
  };

  var OnFailure = (errorCode, errorString, httpResponse) => {
    if (errorCode != 0 && errorCode != -2003)
      saveFileFormMessage.error(errorString);
    else {
      saveFileFormMessage.success("Successfully uploaded");
      initFormValue();
      refetch.value();
    }
  };

  DWObject.SetHTTPFormField("deal_id", dealId.value);
  DWObject.SetHTTPFormField("title", formValue.title);
  DWObject.SetHTTPFormField("type", parseInt(formValue.doc_type));
  DWObject.SetHTTPFormField("description", formValue.description);

  DWObject.HTTPUploadThroughPostEx(
    strHTTPServer,
    DWObject.CurrentImageIndexInBuffer,
    strActionPage,
    uploadfilename,
    strImageType,
    OnSuccess,
    OnFailure
  );
};

/**
 * Dynamsoft_OnReady is called when a WebTwain instance is ready to use.
 * In this callback we do some initialization.
 */
const Dynamsoft_OnReady = () => {
  DWObject = Dynamsoft.DWT.GetWebTwain(containerId);
  bWASM.value = Dynamsoft.Lib.env.bMobile || !Dynamsoft.DWT.UseLocalService;
  if (bWASM.value) {
    DWObject.Viewer.cursor = "pointer";
  } else {
    if (!DWObject) return;
    let sources = DWObject.GetSourceNames();
    selectSources = document.getElementById("sources");
    selectSources.options.length = 0;
    for (let i = 0; i < sources.length; i++) {
      selectSources.options.add(new Option(sources[i], i.toString()));
    }
  }
};
/**
 * Acquire images from scanners or cameras or local files
 */
const acquireImage = () => {
  if (!DWObject) DWObject = Dynamsoft.DWT.GetWebTwain();
  if (bWASM.value) {
    alert("Scanning is not supported under the WASM mode!");
  } else if (
    DWObject.SourceCount > 0 &&
    DWObject.SelectSourceByIndex(selectSources.selectedIndex)
  ) {
    const onAcquireImageSuccess = () => {
      DWObject.CloseSource();
    };
    const onAcquireImageFailure = onAcquireImageSuccess;
    DWObject.OpenSource();
    DWObject.AcquireImage({}, onAcquireImageSuccess, onAcquireImageFailure);
  } else {
    alert("No Source Available!");
  }
};
/**
 * Open local images.
 */
const openImage = () => {
  if (!DWObject) DWObject = Dynamsoft.DWT.GetWebTwain();
  DWObject.IfShowFileDialog = true;
  /**
   * Note, this following line of code uses the PDF Rasterizer which is an extra add-on that is licensed seperately
   */
  DWObject.Addon.PDF.SetConvertMode(
    Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL
  );
  DWObject.LoadImageEx(
    "",
    Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL,
    () => {
      //success
    },
    () => {
      //failure
    }
  );
};

onUpdated(() => {
  Dynamsoft.DWT.ResourcesPath = "../dwt-resources";
  Dynamsoft.DWT.ProductKey =
    "t00891wAAAKFs7VjcTP0UG20tzpw0mVsqmlIukOMDImLaclVr8l5ReM0df50rg9RNaH7A9mwLt6khlmvJyIqEixQeDZAz0iBvgzHPOXcQA/gbSOY51F46ANDILMM=";
  Dynamsoft.DWT.Containers = [
    {
      WebTwainId: "dwtObject",
      ContainerId: containerId,
      Width: "100%",
      Height: "400px",
    },
  ];
  Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", () => {
    Dynamsoft_OnReady();
  });
  Dynamsoft.DWT.Load();
});

const columns = [
  {
    title: "TITLE",
    key: "title",
    //fixed: 'left'
  },
  {
    title: "DESCRIPTION",
    key: "description",
    //fixed: 'left'
  },
  {
    title: "TYPE",
    key: "type",
    //fixed: 'left'
    render(row) {
      return row?.document_type?.name || "";
    },
  },
  {
    title: "",
    fixed: "right",
    render(row) {
      return h(ActionButtons, {
        // onClick: () => console.log(row),
        onDelete: () => console.log("delete"),
        onView: () => {
          viewDocumentModal.value = row;
        },
      });
    },
  },
];

const showScanModal = ref(false);
const viewDocumentModal = ref(false);

const handleScan = () => {
  showScanModal.value = true;
};

const handleUpload = () => {};

const download = (url) => {
  window.open(url, "_blank");
};
</script>

<template>
  <div
    class="
      rounded-round
      dark:bg-foreground_dark
      w-full
      border-[1px]
      bg-white
      p-[24px]
      dark:border-0
    "
  >
    <n-button class="w-[220px]" @click="handleScan">Upload Document</n-button>

    <n-data-table
      class="rounded-round mt-[24px]"
      :columns="columns"
      :data="documents"
      :loading="isDocsLoading"
      :pagination="pagination"
      :bordered="false"
      :max-height="400"
      :scroll-x="900"
    />
  </div>
  <n-modal v-model:show="showScanModal">
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
        <div class="col-span-2">
          <div :id="containerId" v-once></div>
        </div>
        <div class="col-span-1">
          <div class="grid grid-cols-2 gap-2">
            <select v-if="!bWASM" class="col-span-2" id="sources"></select>
            <n-button v-if="!bWASM" class="col-span-1" @click="acquireImage()"
              >Scan Image</n-button
            >
            <n-button class="col-span-1" @click="openImage()"
              >Import Local Image</n-button
            >
          </div>
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
              <n-form-item
                label="File Type"
                path="file_type"
                class="col-span-1"
              >
                <n-select
                  class="w-full"
                  v-model:value="saveFileFormValue.file_type"
                  :options="fileTypes"
                  clearable
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
  <n-modal v-model:show="viewDocumentModal">
    <n-card
      style="max-width: 1248px"
      title="View Document"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra> </template>
      <!-- Content -->
      <n-image :src="viewDocumentModal.url" preview-disabled />
      <div
        class="content-center justify-center flex items-stretch"
        v-if="!['pdf'].includes(viewDocumentModal.extension)"
      >
        <n-button
          class="self-auto mt-2"
          @click.prevent="download(viewDocumentModal.url)"
        >
          <n-icon
            ><svg
              class="
                group-hover:text-primary
                h-6
                w-6
                text-gray-300
                transition-colors
              "
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 227 227"
              style="enable-background: new 0 0 227 227"
              xml:space="preserve"
            >
              <path
                d="M196.395,212V100.5h7.5h7.5V227H15.606V100.5h7.5h7.5V212H196.395z M68.231,0h90.531v78.188h41.735L181.64,100.5
	l-68.14,80.618L45.36,100.5L26.501,78.187h41.73V0z M83.231,93.187H58.819l54.681,64.695l54.68-64.693h-24.417V15H83.231V93.187z"
              /></svg
          ></n-icon>
        </n-button>
      </div>
      <div v-else>
        <object
          :data="viewDocumentModal.url"
          type="application/pdf"
          style="width: 100%; height: 700px"
        >
          <div>No online PDF viewer installed</div>
        </object>
      </div>
      <template #footer> </template>
    </n-card>
  </n-modal>
</template>

<style>
.dynamsoft-dialog img {
  display: inline;
}
</style>
