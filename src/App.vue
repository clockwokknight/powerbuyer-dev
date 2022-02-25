<script setup>
import MainMenu from "@/components/MainMenu.vue";
import { VueQueryDevTools } from "vue-query/devtools";

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
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&family=Open+Sans:wght@300;400;700&display=swap");
</style>
