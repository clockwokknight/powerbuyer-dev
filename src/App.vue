<template>
  <div class="bg-[#fff] h-screen overflow-hidden w-full">
    <div class="flex w-full h-full">
      <aside class="w-[60px] bg-[#202124] sticky top-0 left-0 z-10">
        <MainMenu />
      </aside>
      <section class="flex h-full relative w-full bg-[#F8F8FA]">
        <n-loading-bar-provider>
          <router-view />
        </n-loading-bar-provider>
      </section>
    </div>
  </div>
  <VueQueryDevTools />
</template>

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
