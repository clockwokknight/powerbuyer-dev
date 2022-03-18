<script setup>
import { onMounted } from "vue";
import { VueQueryDevTools } from "vue-query/devtools";
import { darkTheme } from "naive-ui";
import MainMenu from "@/components/MainMenu.vue";
import CommandPalette from "@/components/global_search/CommandPalette.vue";
import { useGlobalState } from "@/store/global";

const global = useGlobalState();

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

onMounted(() => {
  global.setMobile(window.innerWidth <= 768);
});
</script>

<template>
  <n-config-provider
    :theme="global.isDark ? darkTheme : null"
    :theme-overrides="themeOverrides"
  >
    <n-loading-bar-provider>
      <n-message-provider placement="bottom">
        <n-notification-provider>
          <n-dialog-provider>
            <section
              class="fill-screen relative flex bg-background_light dark:!bg-background_dark overflow-hidden"
            >
              <CommandPalette />
              <MainMenu />
              <router-view />
            </section>
            <!-- <VueQueryDevTools /> -->
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&family=Open+Sans:wght@300;400;700&display=swap");
</style>
