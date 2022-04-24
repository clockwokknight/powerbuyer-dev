<script setup>
import axios from "axios";
import ActionButtons from "@/components/vehicle/DocumentActionButtons.vue";
import { h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Dynamsoft from "dwt";
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
import DirectUploadModal from "./DirectUploadModal.vue";

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

const { data: dealId, isLoading: isDealsLoading } =
  getDealIdByVin(routeParamId);
const {
  data: documents,
  isLoading: isDocsLoading,
  refetch,
} = getDocuments(dealId);
const { data: documentTypeOptions, isLoading: isDocTypeLoading } =
  getDocumentTypeOptions();

const showScanModal = ref(false);
const viewDocumentModal = ref(false);

const columns = [
  {
    title: "TITLE",
    key: "title",
  },
  {
    title: "DESCRIPTION",
    key: "description",
  },
  {
    title: "TYPE",
    key: "type",
    render(row) {
      return row?.document_type?.name || "";
    },
  },
  {
    title: "",
    fixed: "right",
    render(row) {
      return h(ActionButtons, {
        onDelete: () => {
          confirmDialog.error({
            title: "Delete",
            content: "Are you sure you want to delete?",
            positiveText: "Yes",
            negativeText: "No",
            onPositiveClick: async () => {
              await axios.delete(`/documents/${row.id}`);
              refetch.value();
            },
            onNegativeClick: () => {},
          });
        },
        onView: () => {
          viewDocumentModal.value = row;
        },
      });
    },
  },
];

const refreshTbl = () => {
  refetch.value();
};

const containerId = "dwtControlContainer";
const bWASM = ref(false);
const DWObject = ref({
  CurrentImageIndexInBuffer: -1,
});
let selectSources;

const showScannerUI = ref(false);
const useAdf = ref(true);
const autoRemoveBlankPage = ref(false);
const twoSidedScan = ref(false);
const pixelType = ref("Gray");
const pixelTypeOptions = PIXEL_TYPE_OPTIONS;
const resolution = ref(200);
const resoultionOptions = RESOLUTION_OPTIONS;

const saveFileFormRef = ref(null);
const saveFileFormMessage = useMessage();
const saveFileFormValue = ref({
  title: "",
  file_type: "pdf",
  description: "",
  doc_type: "1",
});

const saveFileFormRules = SAVE_FILE_FORM_RULES;
const fileTypes = FILE_TYPES;

const handleScan = () => {
  initDynamSoft();
  showScanModal.value = true;
};

const initDynamSoft = () => {
  Dynamsoft.DWT.ResourcesPath = "../dwt-resources";
  Dynamsoft.DWT.ProductKey = import.meta.env.VITE_DWT_LICENSE_Key;
  Dynamsoft.DWT.Containers = [
    {
      WebTwainId: "dwtObject",
      ContainerId: containerId,
      Width: "100%",
      Height: "700px",
    },
  ];
  Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", () => {
    Dynamsoft_OnReady();
  });
  Dynamsoft.DWT.Load();
};

/**
 * Dynamsoft_OnReady is called when a WebTwain instance is ready to use.
 * In this callback we do some initialization.
 */
const Dynamsoft_OnReady = () => {
  DWObject.value = Dynamsoft.DWT.GetWebTwain(containerId);
  bWASM.value = Dynamsoft.Lib.env.bMobile || !Dynamsoft.DWT.UseLocalService;
  if (bWASM.value) {
    DWObject.value.Viewer.cursor = "pointer";
  } else {
    if (!DWObject.value) return;
    let sources = DWObject.value.GetSourceNames();
    selectSources = document.getElementById("sources");
    selectSources.options.length = 0;
    for (let i = 0; i < sources.length; i++) {
      selectSources.options.add(new Option(sources[i], i.toString()));
    }
  }

  if (DWObject.value) {
    if (DWObject.value.ErrorCode == 0) {
      var thumbnailViewer = DWObject.value.Viewer.createThumbnailViewer();
      thumbnailViewer.size = "180px";
      thumbnailViewer.showPageNumber = true;
      thumbnailViewer.selectedPageBackground = thumbnailViewer.background;
      thumbnailViewer.selectedPageBorder = "solid 2px #FE8E14";
      thumbnailViewer.hoverPageBorder = "solid 2px #FE8E14";
      thumbnailViewer.placeholderBackground = "#D1D1D1";
      thumbnailViewer.show();
      thumbnailViewer.hoverPageBackground = thumbnailViewer.background;
      thumbnailViewer.on("click", Dynamsoft_OnMouseClick);
      thumbnailViewer.on("dragdone", Dynamsoft_OnIndexChangeDragDropDone);
      thumbnailViewer.on("keydown", Dynamsoft_OnKeyDown);

      DWObject.value.Viewer.on("wheel", Dynamsoft_OnMouseWheel); //H5 only
      DWObject.value.Viewer.on("OnPaintDone", Dynamsoft_OnMouseWheel); //ActiveX only
      DWObject.value.Viewer.allowSlide = false;
      DWObject.value.IfAllowLocalCache = true;
      DWObject.value.ImageCaptureDriverType = 4;

      cropRect.value = {
        _iLeft: 0,
        _iTop: 0,
        _iRight: 0,
        _iBottom: 0,
      };

      updatePageInfo();

      DWObject.value.RegisterEvent(
        "CloseImageEditorUI",
        Dynamsoft_CloseImageEditorUI
      );
      DWObject.value.RegisterEvent(
        "OnBitmapChanged",
        Dynamsoft_OnBitmapChanged
      );
      DWObject.value.RegisterEvent("OnPostTransfer", Dynamsoft_OnPostTransfer);
      DWObject.value.RegisterEvent("OnPostLoad", Dynamsoft_OnPostLoadfunction);
      DWObject.value.RegisterEvent(
        "OnPostAllTransfers",
        Dynamsoft_OnPostAllTransfers
      );
      DWObject.value.RegisterEvent("OnGetFilePath", Dynamsoft_OnGetFilePath);
      DWObject.value.Viewer.on(
        "pageAreaSelected",
        Dynamsoft_OnImageAreaSelected
      );
      DWObject.value.Viewer.on(
        "pageAreaUnselected",
        Dynamsoft_OnImageAreaDeselected
      );
    }
  }
};
/**
 * Acquire images from scanners or cameras or local files
 */
const acquireImage = () => {
  if (!DWObject.value) DWObject.value = Dynamsoft.DWT.GetWebTwain();
  if (bWASM.value) {
    alert("Scanning is not supported under the WASM mode!");
  } else if (
    DWObject.value.SourceCount > 0 &&
    DWObject.value.SelectSourceByIndex(selectSources.selectedIndex)
  ) {
    const onAcquireImageSuccess = () => {
      DWObject.value.CloseSource();
      updatePageInfo();
    };
    const onAcquireImageFailure = onAcquireImageSuccess;
    DWObject.value.OpenSource();

    var i,
      iPixelType = 0;
    for (i = 0; i < 3; i++) {
      if (pixelTypeOptions[i].vaule == pixelType) iPixelType = i;
    }
    DWObject.value.AcquireImage(
      {
        IfShowUI: showScannerUI.value,
        PixelType: iPixelType,
        Resolution: resolution.value,
        IfFeederEnabled: useAdf.value,
        IfDuplexEnabled: twoSidedScan.value,
        IfAutoDiscardBlankpages: autoRemoveBlankPage.value,
        IfDisableSourceAfterAcquire: true,
      },
      onAcquireImageSuccess,
      onAcquireImageFailure
    );
  } else {
    alert("No Source Available!");
  }
};

/**
 * Open local images.
 */
const openImage = () => {
  if (!DWObject.value) DWObject.value = Dynamsoft.DWT.GetWebTwain();
  DWObject.value.IfShowFileDialog = true;
  /**
   * Note, this following line of code uses the PDF Rasterizer which is an extra add-on that is licensed seperately
   */
  DWObject.value.Addon.PDF.SetConvertMode(
    Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL
  );
  DWObject.value.LoadImageEx(
    "",
    Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL,
    () => {
      updatePageInfo();
    },
    () => {
      updatePageInfo();
    }
  );
};

const download = (url) => {
  window.open(url, "_blank");
};

const checkIfImagesInBuffer = () => {
  if (!DWObject.value || DWObject.value.HowManyImagesInBuffer == 0) {
    return false;
  } else return true;
};

const currentPageNum = ref(0);
const totalPageNum = ref(0);
const spanZoom = ref("100%");

function updatePageInfo() {
  totalPageNum.value = DWObject.value.HowManyImagesInBuffer;
  currentPageNum.value = DWObject.value.CurrentImageIndexInBuffer + 1;
  updateZoomInfo();
}

function updateZoomInfo() {
  if (DWObject.value.HowManyImagesInBuffer == 0) spanZoom.value = "100%";
  else spanZoom.value = Math.round(DWObject.value.Viewer.zoom * 100) + "%";
}

const confirmDialog = useDialog();
const confirmMessage = useMessage();
const btnRemoveCurrentImage_onclick = () => {
  if (!checkIfImagesInBuffer()) return;
  confirmDialog.error({
    title: "Delete",
    content: "Are you sure to delete current page?",
    positiveText: "Yes",
    negativeText: "No",
    onPositiveClick: () => {
      DWObject.value.RemoveImage(DWObject.value.CurrentImageIndexInBuffer);
      if (DWObject.value.HowManyImagesInBuffer == 0)
        DWObject.value.RemoveImage(0);
      confirmMessage.success("Successfully deleted");
      updatePageInfo();
    },
    onNegativeClick: () => {},
  });
};

const btnRemoveAllImages_onclick = () => {
  if (!checkIfImagesInBuffer()) return;
  confirmDialog.error({
    title: "Delete",
    content: "Are you sure to delete all pages?",
    positiveText: "Yes",
    negativeText: "No",
    onPositiveClick: () => {
      DWObject.value.RemoveAllImages();
      DWObject.value.RemoveImage(0);
      confirmMessage.success("Successfully deleted");
      updatePageInfo();
    },
    onNegativeClick: () => {},
  });
};

const btnZoomIn_onclick = () => {
  if (!checkIfImagesInBuffer()) {
    return;
  }

  var zoom = Math.round(DWObject.value.Viewer.zoom * 100);
  if (zoom >= 6500) return;

  var zoomInStep = 5;
  DWObject.value.Viewer.zoom =
    (DWObject.value.Viewer.zoom * 100 + zoomInStep) / 100.0;
  updateZoomInfo();
};

const btnZoomOut_onclick = () => {
  if (!checkIfImagesInBuffer()) {
    return;
  }

  var zoom = Math.round(DWObject.value.Viewer.zoom * 100);
  if (zoom <= 2) return;

  var zoomOutStep = 5;
  DWObject.value.Viewer.zoom =
    (DWObject.value.Viewer.zoom * 100 - zoomOutStep) / 100.0;
  updateZoomInfo();
};

const orgBtn = ref(true);
const btnOrigSize_onclick = () => {
  if (!checkIfImagesInBuffer()) {
    return;
  }
  orgBtn.value = false;
  DWObject.value.Viewer.zoom = 1;
  updateZoomInfo();
};
const btnFitWindow_onclick = () => {
  if (!checkIfImagesInBuffer()) {
    return;
  }

  orgBtn.value = true;
  DWObject.value.Viewer.fitWindow();
  updateZoomInfo();
};

const btnRotateLeft_onclick = () => {
  if (!checkIfImagesInBuffer()) {
    return;
  }
  DWObject.value.RotateLeft(DWObject.value.CurrentImageIndexInBuffer);
};

const cropRect = ref({
  _iLeft: 0,
  _iTop: 0,
  _iRight: 0,
  _iBottom: 0,
});
const btnCrop_onclick = () => {
  if (!checkIfImagesInBuffer()) {
    return;
  }
  if (
    cropRect.value._iLeft != 0 ||
    cropRect.value._iTop != 0 ||
    cropRect.value._iRight != 0 ||
    cropRect.value._iBottom != 0
  ) {
    DWObject.value.Crop(
      DWObject.value.CurrentImageIndexInBuffer,
      cropRect.value._iLeft,
      cropRect.value._iTop,
      cropRect.value._iRight,
      cropRect.value._iBottom
    );
    cropRect.value = {
      _iLeft: 0,
      _iTop: 0,
      _iRight: 0,
      _iBottom: 0,
    };

    if (DWObject.value.isUsingActiveX())
      DWObject.value.SetSelectedImageArea(
        DWObject.value.CurrentImageIndexInBuffer,
        0,
        0,
        0,
        0
      );
    return;
  } else {
  }
};

const btnShowImageEditor_onclick = () => {
  if (!checkIfImagesInBuffer()) {
    return;
  }
  var imageEditor = DWObject.value.Viewer.createImageEditor();
  imageEditor.show();
};

const selectOnClick = ref(false);
const handOnClick = ref(false);
const btnSelect_onclick = () => {
  selectOnClick.value = true;
  handOnClick.value = false;

  DWObject.value.Viewer.cursor = "crosshair";
};

const btnHand_onclick = () => {
  selectOnClick.value = false;
  handOnClick.value = true;

  DWObject.value.Viewer.cursor = "pointer";
};

const Dynamsoft_OnMouseClick = () => {
  updatePageInfo();
};

const Dynamsoft_OnMouseWheel = () => {
  updatePageInfo();
};

const Dynamsoft_OnIndexChangeDragDropDone = (event) => {
  updatePageInfo();
};

const Dynamsoft_OnKeyDown = () => {
  updatePageInfo();
};

const Dynamsoft_CloseImageEditorUI = () => {
  updatePageInfo();
};

function btnPreImage_wheel() {
  if (DWObject.value.HowManyImagesInBuffer != 0) btnPreImage_onclick();
}

function btnNextImage_wheel() {
  if (DWObject.value.HowManyImagesInBuffer != 0) btnNextImage_onclick();
}

function btnPreImage_onclick() {
  if (!checkIfImagesInBuffer()) {
    return;
  }
  DWObject.value.Viewer.previous();
  updatePageInfo();
}

function btnNextImage_onclick() {
  if (!checkIfImagesInBuffer()) {
    return;
  }
  DWObject.value.Viewer.next();
  updatePageInfo();
}

const Dynamsoft_OnBitmapChanged = (aryIndex, type) => {
  if (type == 3) {
    updatePageInfo();
  }

  if (type == 4) updateZoomInfo();

  if (type == 5) Dynamsoft_OnImageAreaDeselected();
};

const Dynamsoft_OnPostTransfer = () => {
  updatePageInfo();
};

const Dynamsoft_OnPostLoadfunction = (path, name, type) => {
  updatePageInfo();
};

const Dynamsoft_OnPostAllTransfers = () => {
  DWObject.value.CloseSource();
  updatePageInfo();
};

const Dynamsoft_OnImageAreaSelected = (index, rect) => {
  if (rect.length > 0) {
    var currentRect = rect[rect.length - 1];
    cropRect.value = {
      _iLeft: currentRect.x,
      _iTop: currentRect.y,
      _iRight: currentRect.x + currentRect.width,
      _iBottom: currentRect.y + currentRect.height,
    };
  }
};

const Dynamsoft_OnImageAreaDeselected = (index) => {
  cropRect.value = {
    _iLeft: 0,
    _iTop: 0,
    _iRight: 0,
    _iBottom: 0,
  };
};

const Dynamsoft_OnGetFilePath = (bSave, count, index, path, name) => {};

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
  if (DWObject.value.HowManyImagesInBuffer == 0) {
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
  DWObject.value.IfSSL = Dynamsoft.Lib.detect.ssl;

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

  DWObject.value.SetHTTPFormField("deal_id", dealId.value);
  DWObject.value.SetHTTPFormField("title", formValue.title);
  DWObject.value.SetHTTPFormField("type", parseInt(formValue.doc_type));
  DWObject.value.SetHTTPFormField("description", formValue.description);

  DWObject.value.HTTPUploadThroughPostEx(
    strHTTPServer,
    DWObject.value.CurrentImageIndexInBuffer,
    strActionPage,
    uploadfilename,
    strImageType,
    OnSuccess,
    OnFailure
  );
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
    <DirectUploadModal :deal-id="dealId" @refetch="refreshTbl" />
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
          <div id="divEdit">
            <n-button
              :bordered="false"
              @click="btnRemoveCurrentImage_onclick"
              class="ml-1"
            >
              <img
                class="menuIcon"
                src="/images/RemoveSelectedImages.png"
                title="Remove current page"
                alt="Remove current page"
                id="DW_btnRemoveCurrentImage"
              />
            </n-button>
            <n-button
              :bordered="false"
              @click="btnRemoveAllImages_onclick"
              class="ml-1 mr-3"
            >
              <img
                class="menuIcon"
                src="/images/RemoveAllImages.png"
                title="Remove All pages"
                alt="Remove All pages"
                id="DW_btnRemoveAllImages"
              />
            </n-button>
            <span style="width: 20px" />
            <span class="page-detail"
              >{{ currentPageNum }} / {{ totalPageNum }}</span
            >
            <n-button
              :bordered="false"
              @click="btnZoomOut_onclick"
              class="ml-1 mr-3"
            >
              <img
                class="menuIcon"
                src="/images/ZoomOut.png"
                title="ZoomOut"
                alt="Erase"
                id="btnZoomOut"
              />
            </n-button>
            <span class="zoom-detail">{{ spanZoom }} </span>
            <n-button
              :bordered="false"
              @click="btnZoomIn_onclick"
              class="ml-1 mr-3"
            >
              <img
                class="menuIcon"
                src="/images/ZoomIn.png"
                title="ZoomIn"
                alt="ZoomIn"
                id="btnZoomIn"
              />
            </n-button>
            <n-button
              :bordered="false"
              v-if="orgBtn"
              @click="btnOrigSize_onclick"
              class="ml-1 mr-3"
            >
              <img
                style="margin-left: 10px"
                class="menuIcon"
                src="/images/Orig_size.png"
                title="1:1"
                alt="1:1"
                id="btnOrigSize"
              />
            </n-button>
            <n-button
              :bordered="false"
              v-if="!orgBtn"
              @click="btnFitWindow_onclick"
              class="ml-1 mr-3"
            >
              <img
                class="menuIcon"
                src="/images/FitWindow.png"
                title="Fit To Window"
                alt="Fit To Window"
                id="btnFitWindow"
              />
            </n-button>
            <n-button
              :bordered="false"
              @click="btnRotateLeft_onclick"
              class="ml-1 mr-3"
            >
              <img
                class="menuIcon"
                src="/images/RotateLeft.png"
                title="Rotate Left"
                alt="Rotate Left"
                id="btnRotateL"
              />
            </n-button>
            <n-button
              :bordered="false"
              @click="btnCrop_onclick"
              class="ml-1 mr-3"
            >
              <img
                class="menuIcon"
                src="/images/Crop.png"
                title="Crop"
                alt="Crop"
                id="btnCrop"
              />
            </n-button>
            <n-button
              :bordered="false"
              @click="btnShowImageEditor_onclick"
              class="ml-1 mr-3"
            >
              <img
                class="menuIcon"
                src="/images/ShowEditor.png"
                title="Show Image Editor"
                alt="Show Image Editor"
                id="btnShowImageEditor"
              />
            </n-button>
            <n-button
              :bordered="false"
              @click="btnSelect_onclick"
              class="ml-2 mr-3"
            >
              <img
                class="menuIcon"
                :src="
                  selectOnClick
                    ? '/images/Select_selected.png'
                    : '/images/Select.png'
                "
                title="Select"
                alt="Select"
                id="btnSelect"
              />
            </n-button>
            <n-button
              :bordered="false"
              @click="btnHand_onclick"
              class="ml-0 mr-3"
            >
              <img
                class="menuIcon"
                :src="
                  handOnClick ? '/images/Hand_selected.png' : '/images/Hand.png'
                "
                title="Hand"
                alt="Erase"
                id="btnHand_selected"
              />
            </n-button>
          </div>
          <div :id="containerId" v-once></div>
        </div>
        <div class="col-span-1">
          <div class="grid grid-cols-2 gap-2">
            <select
              v-if="!bWASM"
              class="col-span-2 dark:bg-[#333333]"
              id="sources"
            ></select>
            <n-checkbox v-model:checked="showScannerUI" class="col-span-1">
              Show Scanner UI
            </n-checkbox>
            <n-checkbox v-model:checked="useAdf" class="col-span-1">
              Use ADF
            </n-checkbox>
            <n-checkbox
              v-model:checked="autoRemoveBlankPage"
              class="col-span-1"
            >
              Auto Remove Blank Page
            </n-checkbox>
            <n-checkbox v-model:checked="twoSidedScan" class="col-span-1">
              2-sided Scan
            </n-checkbox>

            <div class="flex justify-start items-center col-span-2 mt-2">
              <span class="mr-2">Pixel Type:</span>
              <n-radio-group
                v-model:value="pixelType"
                name="pixelTypeGroup"
                class=""
              >
                <n-space>
                  <n-radio
                    v-for="pt in pixelTypeOptions"
                    :key="pt.value"
                    :value="pt.value"
                    :label="pt.label"
                  />
                </n-space>
              </n-radio-group>
            </div>
            <div class="flex justify-start items-center col-span-2 mt-2">
              <span class="mr-2">Resolution:</span>
              <n-select
                v-model:value="resolution"
                :options="resoultionOptions"
                placeholder="Please select Resolution"
              />
            </div>
            <n-button
              v-if="!bWASM"
              class="col-span-1 mt-2"
              @click="acquireImage()"
              >Scan Image</n-button
            >
            <n-button class="col-span-1 mt-2" @click="openImage()"
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
#divEdit {
  display: flex;
  align-items: center;
  float: left;
  margin: 0;
  padding: 0;
  width: 771px;
  height: 40px;
  background: #fff;
  border: 1px solid #ccc;
  background: #323234 0% 0% no-repeat padding-box;
  color: white;
  -webkit-box-sizing: unset;
  -moz-box-sizing: border-box;
  box-sizing: unset;
  margin-top: -1px;
  cursor: default;
}
#divEdit .page-detail {
  height: 100%;
  line-height: 40px;
  border-right: 1px solid #525252;
  padding-right: 10px;
}
</style>
