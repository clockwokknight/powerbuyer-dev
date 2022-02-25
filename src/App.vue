<script setup>
import MainMenu from "@/components/MainMenu.vue";
import { VueQueryDevTools } from "vue-query/devtools";
import { NConfigProvider } from "naive-ui";

const themeOverrides = {
  Input: {
    color: "rgba(0,0,0,0)",
    colorDisabled: "rgba(0,0,0,0)",
    border: "none",
    borderHover: "none",
    borderDisabled: "none",
    borderFocus: "none",
    boxShadowFocus: "none",
    borderRadius: "64px",
    paddingSmall: "0px",
    paddingMedium: "0px",
    paddingLarge: "0px",
    placeholderColor: "#bdbdbd",
    fontSizeMedium: "18px",
  },
  Select: {
    peers: {
      InternalSelection: {
        color: "rgba(0,0,0,0)",
        colorDisabled: "rgba(0,0,0,0)",
        border: "none",
        borderHover: "none",
        borderDisabled: "none",
        borderFocus: "none",
        borderRadius: "6px",
        boxShadowFocus: "none",
        paddingTiny: "0px",
        paddingSmall: "0px",
        paddingMedium: "0px",
        paddingLarge: "0px",
        placeholderColor: "#bdbdbd",
        fontSizeMedium: "18px",
      },
    },
  },
};

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
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <div class="h-screen w-full overflow-hidden bg-[#fff] antialiased">
              <div class="flex h-full w-full">
                <aside class="sticky top-0 left-0 z-10 w-[60px] bg-[#202124]">
                  <MainMenu />
                </aside>
                <section class="relative flex h-full w-full bg-[#F8F8FA]">
                  <router-view />
                </section>
              </div>
            </div>
            <VueQueryDevTools />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&family=Open+Sans:wght@300;400;700&display=swap");
</style>
