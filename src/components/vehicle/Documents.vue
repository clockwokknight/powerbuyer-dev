<script setup>
import axios from "axios";
import ActionButtons from "@/components/vehicle/DocumentActionButtons.vue";
import { h, ref, computed, watch, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { utils, log } from "@/lib/utils";
import { fetchById } from "@/hooks";
import Dynamsoft from "dwt";

const containerId = "dwtControlContainer";
const bWASM = ref(false);

let DWObject;
let selectSources;
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
})

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

const route = useRoute();

const { documents, isLoading } = {
  documents: [
    {
      title: "Driver's License",
      description: "description",
      type: "license",
    },
    {
      title: "Driver's License",
      description: "description",
      type: "license",
    },
  ],
  isLoading: false,
};

const showScanModal = ref(false);

const handleScan = () => {
  showScanModal.value = true;
  console.log(showScanModal.value);
};

const handleUpload = () => {};
</script>

<template>
  <div
    class="rounded-round dark:bg-foreground_dark w-full border-[1px] bg-white p-[24px] dark:border-0"
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
      style="width: 600px"
      title="Upload Document"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra> </template>
      <!-- Content -->
      <select v-if="!bWASM" class="" id="sources"></select>
      <n-button v-if="!bWASM" class="" @click="acquireImage()"
        >Scan Image</n-button
      >
      <n-button class="mt-[10px] ml-[10px]" @click="openImage()">Open Image</n-button>
      <div :id="containerId" v-once></div>
      <template #footer> </template>
    </n-card>
  </n-modal>
</template>

<style>
.dynamsoft-dialog img {
  display: inline;
}
</style>
