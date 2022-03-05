<script setup>
import { ref } from 'vue';
import MainMenu from "@/components/MainMenu.vue";
import { VueQueryDevTools } from "vue-query/devtools";
import { darkTheme } from 'naive-ui';

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

const isDarkTheme = ref(localStorage.getItem('theme') === 'dark');

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark')
}

const handleThemeChange = (isDark) => {
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

</script>

<template>
  <n-config-provider :theme="isDarkTheme ? darkTheme : null">
    <n-loading-bar-provider>
      <n-message-provider placement="bottom">
        <n-notification-provider>
          <n-dialog-provider>
            <div class="h-screen w-full overflow-hidden bg-[#fff] antialiased">
              <div class="flex h-full w-full">
                <aside class="flex flex-col sticky top-0 left-0 z-10 w-[60px] bg-[#202124]">
                  <MainMenu />
                  <n-switch class="mt-auto mb-4" v-model:value="isDarkTheme"  @update:value="handleThemeChange"/>
                </aside>
                <section class="relative flex h-full w-full bg-[#F8F8FA]">
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
