<script setup>
import axios from "axios";
import ActionButtons from "@/components/vehicle/DocumentActionButtons.vue";
import { h, ref, computed, watch, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { utils, log } from "@/lib/utils";
import { useMutation } from "vue-query";
import Dynamsoft from "dwt";
import { useMessage } from "naive-ui";
import { getDocuments, getDocumentTypeOptions } from "@/hooks/document";

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

const containerId = "dwtControlContainer";
const bWASM = ref(false);

const saveFileFormRef = ref(null);
const saveFileFormMessage = useMessage();
const saveFileFormValue = ref({
  name: "",
  type: "pdf",
  description: "",
  // doc_type: 1,
});

const saveFileFormRules = {
  name: {
    required: true,
    message: "Please input file name",
    trigger: "blur",
  },
  type: {
    required: true,
    message: "Please select file type",
    trigger: "blur",
  },
  // doc_type: {
  //   required: true,
  //   message: "Please select Document Type",
  //   trigger: "blur",
  // },
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
const { data: documentTypeOptions, isLoading: isVendorLoading } =
  getDocumentTypeOptions();

let DWObject;
let selectSources;

const initFormValue = () => {
  saveFileFormValue.value = {
    name: "",
    type: "pdf",
    description: "",
    // doc_type: 1,
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

  var fileName = formValue.name;

  strHTTPServer = "https://gmtvinventory.com";
  DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;

  strActionPage = "/api/documents";
  var strPageType = formValue.type;
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
  };

  var OnFailure = (errorCode, errorString, httpResponse) => {
    if (errorCode != 0 && errorCode != -2003)
      saveFileFormMessage.error(errorString);
    else {
      saveFileFormMessage.success("Successfully uploaded");
      initFormValue();
    }
  };

  DWObject.SetHTTPFormField("deal_id", routeParamId.value);
  DWObject.SetHTTPFormField("title ", formValue.name);
  DWObject.SetHTTPFormField("type", strImageType);
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
  },
  {
    title: "",
    fixed: "right",
    render(row) {
      return h(ActionButtons, {
        // onClick: () => console.log(row),
        onDelete: () => console.log("delete"),
        onView: () => console.log("view"),
      });
    },
  },
];

// Need API endpoints
const { data: documents, isLoading: isLoading } = getDocuments(routeParamId);

const showScanModal = ref(false);

const handleScan = () => {
  showScanModal.value = true;
};

const handleUpload = () => {};
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
      :loading="isLoading"
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
          <n-card title="Save Documents" size="small" class="mt-4">
            <n-form
              ref="saveFileFormRef"
              :label-width="80"
              :model="saveFileFormValue"
              :rules="saveFileFormRules"
              class="grid grid-cols-3 gap-2"
            >
              <n-form-item label="File Name" path="name" class="col-span-2">
                <n-input
                  v-model:value="saveFileFormValue.name"
                  placeholder="File Name"
                />
              </n-form-item>
              <n-form-item label="File Type" path="type" class="col-span-1">
                <n-select
                  class="w-full"
                  v-model:value="saveFileFormValue.type"
                  :options="fileTypes"
                  clearable
                />
              </n-form-item>
              <!-- <n-form-item
                label="Document Type"
                path="doc_type"
                class="col-span-3"
              >
                <n-select
                  class="w-full"
                  v-model:value="saveFileFormValue.doc_type"
                  :options="documentTypeOptions"
                  clearable
                />
              </n-form-item> -->
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

<style>
.dynamsoft-dialog img {
  display: inline;
}
</style>
