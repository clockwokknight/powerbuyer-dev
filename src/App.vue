<script setup>
import { VueQueryDevTools } from "vue-query/devtools";
import { darkTheme } from "naive-ui";
import MainMenu from "@/components/MainMenu.vue";
import CommandPalette from "@/components/global_search/CommandPalette.vue";
import { useGlobalState } from "@/store/global";
const global = useGlobalState();
</script>

<template>
  <n-config-provider :theme="global.isDark ? darkTheme : null">
    <n-loading-bar-provider>
      <n-message-provider placement="bottom">
        <n-notification-provider>
          <n-dialog-provider>
            <section
              class="fill-screen relative flex bg-background_light dark:!bg-background_dark"
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
