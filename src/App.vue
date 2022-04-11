<script setup>
import { onMounted, watchEffect } from "vue";
import { darkTheme } from "naive-ui";
import MainMenu from "@/components/MainMenu.vue";
import CommandPalette from "@/components/global_search/CommandPalette.vue";
import { useGlobalState } from "@/store/global";
import { useRoute } from "vue-router";

const global = useGlobalState();
const route = useRoute();
/**
 * Use this for type hints under js file
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = {
  Button: {
    textColorHover: "#027BFF",
    borderHover: "1px solid #027BFF",
    borderColorHover: "#027BFF",
    textColorGhostFocus: "#027BFF",
    borderColorPressed: "#027BFF",
    textColorPressed: "#027BFF",
  },
};

/**
 * Use this for type hints under js file
 * @type import('naive-ui').GlobalThemeOverrides
 */
const darkThemeOverride = {
  Button: {
    textColorHover: "#027BFF",
    borderHover: "1px solid #027BFF",
    borderColorHover: "#027BFF",
    textColorGhostFocus: "#027BFF",
    borderColorPressed: "#027BFF",
    textColorPressed: "#027BFF",
    colorPrimary: "rgba(0, 122, 235, 0.44)",
    textColorPrimary: "#FFFFFFFF",
    textColorHoverPrimary: "#FBFBFBFF",
    textColorPressedPrimary: "#FFFFFFFF",
    textColorFocusPrimary: "#FCFCFCFF",
    textColorDisabledPrimary: "rgba(176, 168, 168, 1)",
    colorPressedPrimary: "rgba(0, 122, 255, 1)",
    colorFocusPrimary: "rgba(0, 122, 255, 1)",
    colorDisabledPrimary: "rgba(54, 145, 244, .5)",
    colorHoverPrimary: "rgba(0, 122, 255, 0.68)",
    borderPrimary: "1.5px solid rgb(0 122 255)",
    borderHoverPrimary: "1.5px solid rgb(0 122 255)",
    borderPressedPrimary: "1.5px solid rgb(0 122 255)",
    borderFocusPrimary: "1.5px solid rgb(0 122 255)",
    borderDisabledPrimary: "1.5px solid rgb(0 122 255/0.3)",
  },
  Card: {
    colorModal: "rgb(24 24 28)",
  },
  Table: {
    tdColorModal: "rgb(24 24 28)",
  },
  DataTable: {
    tdColorModal: "rgb(24 24 28)",
  },
};
onMounted(() => {
  global.setMobile(window.innerWidth <= 768);
});
</script>

<template>
  <n-config-provider
    :theme="global.isDark ? darkTheme : null"
    :theme-overrides="global.isDark ? darkThemeOverride : themeOverrides"
  >
    <n-loading-bar-provider>
      <n-message-provider placement="bottom">
        <n-notification-provider>
          <n-dialog-provider>
            <section
              class="fill-screen relative flex overflow-hidden bg-background_light dark:!bg-background_dark"
            >
              <CommandPalette />
              <MainMenu />
              <router-view />
            </section>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&family=Open+Sans:wght@300;400;700&display=swap");
</style>
