<script setup>
import { watch } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import { useGlobalState } from "../store/global";

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

watch(
  () => global.value,
  (val) => {
    log.label("global", val);
  }
);

const isDark = useDark();
const toggleDark = useToggle(isDark);

watch(
  () => isDark.value,
  (val) => {
    global.setDark(val);
  }
);
</script>

<template>
  <aside class="flex flex-col sticky top-0 left-0 w-[60px] h-screen bg-black z-50">
    <div class="w-full text-[#ffffff]">
      <nav>
        <ul class="menu-items flex w-[60px] flex-col items-center">
          <router-link to="/">
            <li
              class="!mt-5 !mb-5 h-[40px] w-[40px] rounded-round !bg-[#027bff] !pt-[8px] text-center text-lg font-bold hover:!bg-[#003874]"
            >
              PB
            </li>
          </router-link>
          <router-link to="/">
            <li content="Dashbaord" v-tippy="{ placement: 'right', duration: 50 }">
              <!-- TODO : make tippy BG white on dark mode -->
              <img src="/icons/SpaceDashboardRound.svg" />
            </li>
          </router-link>
          <router-link to="/deals">
            <li content="Deals" v-tippy="{ placement: 'right', duration: 50 }">
              <img src="/icons/MdPricetags.svg" />
            </li>
          </router-link>
          <router-link to="/inventory">
            <li content="Inventory" v-tippy="{ placement: 'right', duration: 50 }">
              <img src="/icons/CarSport.svg" />
            </li>
          </router-link>
          <router-link to="/lanes">
            <li content="Lanes" v-tippy="{ placement: 'right', duration: 50 }">
              <img class="mt-3 h-5" src="/icons/TrafficLight.svg" />
            </li>
          </router-link>
          <router-link to="/buyers">
            <li content="Buyers" v-tippy="{ placement: 'right', duration: 50 }">
              <img src="/icons/GroupsFilled.svg" />
            </li>
          </router-link>
          <router-link to="/vendors">
            <li content="Vendors" v-tippy="{ placement: 'right', duration: 50 }">
              <img class="mt-[15px] h-4" src="/icons/Tools.svg" />
            </li>
          </router-link>
          <router-link to="/dealers">
            <li content="Dealers" v-tippy="{ placement: 'right', duration: 50 }">
              <img class="mt-[15px] h-4" src="/icons/Tools.svg" />
            </li>
          </router-link>
          <router-link to="/auctions">
            <li content="Auctions" v-tippy="{ placement: 'right', duration: 50 }">
              <img src="/icons/GavelRound.svg" />
            </li>
          </router-link>
          <router-link to="/system">
            <li content="More Items" v-tippy="{ placement: 'right', duration: 50 }">
              <img src="/icons/OverflowMenuVertical.svg" />
            </li>
          </router-link>
        </ul>
      </nav>
    </div>
    <div class="mt-auto mb-4 w-[60px] flex justify-center">
      <button
        :content="global.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        v-tippy="{ placement: 'right', duration: 50 }"
        class="theme-toggle theme-toggle-js h-[55px] w-[55px] p-[8px] cursor-pointer"
        @click="toggleDark"
      >
        <svg
          v-show="global.isDark"
          viewBox="0 0 24 24"
          class="scale-[0.6] hover:scale-[0.4] duration-500"
        >
          <g>
            <path
              d="M20.026 17.001c-2.762 4.784-8.879 6.423-13.663 3.661A9.965 9.965 0 0 1 3.13 17.68a.75.75 0 0 1 .365-1.132c3.767-1.348 5.785-2.91 6.956-5.146c1.232-2.353 1.551-4.93.689-8.463a.75.75 0 0 1 .769-.927a9.961 9.961 0 0 1 4.457 1.327c4.784 2.762 6.423 8.879 3.66 13.662z"
              fill="#ffffff"
            ></path>
          </g>
        </svg>
        <svg
          v-show="!global.isDark"
          viewBox="0 0 24 24"
          class="scale-[0.8] hover:scale-[0.6] hover:rotate-45 duration-500"
        >
          <g>
            <path
              d="M12 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 2zm5 10a5 5 0 1 1-10 0a5 5 0 0 1 10 0zm4.25.75a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5zM12 19a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 19zm-7.75-6.25a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5zm-.03-8.53a.75.75 0 0 1 1.06 0l1.5 1.5a.75.75 0 0 1-1.06 1.06l-1.5-1.5a.75.75 0 0 1 0-1.06zm1.06 15.56a.75.75 0 1 1-1.06-1.06l1.5-1.5a.75.75 0 1 1 1.06 1.06l-1.5 1.5zm14.5-15.56a.75.75 0 0 0-1.06 0l-1.5 1.5a.75.75 0 0 0 1.06 1.06l1.5-1.5a.75.75 0 0 0 0-1.06zm-1.06 15.56a.75.75 0 1 0 1.06-1.06l-1.5-1.5a.75.75 0 1 0-1.06 1.06l1.5 1.5z"
              fill="#ffffff"
            ></path>
          </g>
        </svg>
      </button>
    </div>
  </aside>
</template>

<style lang="scss" scoped></style>
