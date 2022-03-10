<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { VueQueryDevTools } from "vue-query/devtools";
import { darkTheme } from "naive-ui";
import { useDark, useToggle } from "@vueuse/core";
import { useGlobalState } from "./store/global";
import { log } from "./lib/utils";
import MainMenu from "@/components/MainMenu.vue";

const userMenu = [
  {
    label: "Profile",
    key: "profile",
  },
  {
    label: "Edit Profile",
    key: "editProfile",
  },
  {
    label: "Logout",
    key: "logout",
  },
];

const global = useGlobalState();

const isDark = useDark();
const toggleDark = useToggle(isDark);

const windowWidth = computed(() => window.innerWidth);

watch(
  () => global.value,
  (val) => {
    log.label("global", val);
  }
);

watch(
  () => isDark.value,
  (val) => {
    global.setDark(val);
  }
);

watch(
  // TODO : figure out why this value won't update
  () => windowWidth.value,
  (val) => {
    log.label("new width: ", val);
  }
);

onMounted(() => {
  log.green("App.vue mounted");
  global.setMobile(windowWidth.value <= 768);
  log.label("mobile? ", global.isMobile);
});

onUnmounted(() => {
  log.yellow("App.vue unmounted");
});
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : null">
    <n-loading-bar-provider>
      <n-message-provider placement="bottom">
        <n-notification-provider>
          <n-dialog-provider>
            <div class="h-screen w-full overflow-hidden bg-[#fff] antialiased">
              <div class="flex w-full h-full">
                <aside
                  class="flex flex-col sticky top-0 left-0 w-[60px] bg-[#202124] dark:bg-black z-50"
                >
                  <MainMenu />
                  <n-switch
                    class="mt-auto mb-4"
                    v-model:value="isDark"
                    @update:value="toggleDark"
                  />
                </aside>
                <section
                  class="relative flex h-full w-full bg-[#F8F8FA] dark:bg-[#1E1F21]"
                >
                  <router-view />
                </section>
              </div>
            </div>
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
