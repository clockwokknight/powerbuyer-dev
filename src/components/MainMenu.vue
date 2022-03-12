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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2zm6 0h4c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2zm6-13V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </li>
          </router-link>
          <router-link to="/deals">
            <li content="Deals" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path
                    d="M19.75 2A2.25 2.25 0 0 1 22 4.25v5.462a3.25 3.25 0 0 1-.952 2.298l-8.5 8.503a3.255 3.255 0 0 1-4.597.001L3.489 16.06a3.25 3.25 0 0 1-.004-4.596l8.5-8.51a3.25 3.25 0 0 1 2.3-.953h5.465zM17 5.502a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </li>
          </router-link>
          <router-link to="/inventory">
            <li content="Inventory" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 480 512"
              >
                <path
                  d="M438.66 212.33l-11.24-28.1l-19.93-49.83C390.38 91.63 349.57 64 303.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4l-19.93 49.83l-11.24 28.1C17.22 221.5 0 244.66 0 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-27.34-17.22-50.5-41.34-59.67zm-306.73-54.16c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L368 208H112l19.93-49.83zM80 319.8c-19.2 0-32-12.76-32-31.9S60.8 256 80 256s48 28.71 48 47.85s-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S380.8 256 400 256s32 12.76 32 31.9s-12.8 31.9-32 31.9z"
                  fill="currentColor"
                ></path>
              </svg>
            </li>
          </router-link>
          <router-link to="/lanes">
            <li content="Lanes" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19.96 10.59a.514.514 0 0 0-.5-.59H17V8.86a4.01 4.01 0 0 0 2.96-3.27a.514.514 0 0 0-.5-.59H17V4c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H4.54c-.31 0-.54.28-.5.59A4.01 4.01 0 0 0 7 8.86V10H4.54c-.31 0-.54.28-.5.59A4.01 4.01 0 0 0 7 13.86V15H4.54c-.31 0-.54.28-.5.59A4.01 4.01 0 0 0 7 18.86V20c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1.14a4.01 4.01 0 0 0 2.96-3.27a.514.514 0 0 0-.5-.59H17v-1.14a4.01 4.01 0 0 0 2.96-3.27zM12 19a2 2 0 1 1-.001-3.999A2 2 0 0 1 12 19zm0-5a2 2 0 1 1-.001-3.999A2 2 0 0 1 12 14zm0-5a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 1 1 0 4z"
                  fill="currentColor"
                ></path>
              </svg>
            </li>
          </router-link>
          <router-link to="/buyers">
            <li content="Buyers" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path
                    d="M14.75 15c.966 0 1.75.784 1.75 1.75l-.001.962c.117 2.19-1.511 3.297-4.432 3.297c-2.91 0-4.567-1.09-4.567-3.259v-1c0-.966.784-1.75 1.75-1.75h5.5zm-11-5h4.376a4.007 4.007 0 0 0 1.067 3.85l.162.151L9.25 14a2.75 2.75 0 0 0-2.649 2.008l-.034.001C3.657 16.009 2 14.919 2 12.75v-1c0-.966.784-1.75 1.75-1.75zm16.5 0c.966 0 1.75.784 1.75 1.75l-.001.962c.117 2.19-1.511 3.297-4.432 3.297l-.169-.002a2.756 2.756 0 0 0-2.451-2L14.75 14l-.105.001a3.99 3.99 0 0 0 1.229-4L20.25 10zM12 8a3 3 0 1 1 0 6a3 3 0 0 1 0-6zM6.5 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6zm11 0a3 3 0 1 1 0 6a3 3 0 0 1 0-6z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </li>
          </router-link>
          <router-link to="/vendors">
            <li content="Vendors" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 7V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-8zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm9 12h-7v-2h2v-2h-2v-2h2v-2h-2V9h7c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1zm-1-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </li>
          </router-link>
          <router-link to="/dealers">
            <li content="Dealers" v-tippy="{ placement: 'right', duration: 50 }">
              <svg viewBox="0 0 24 24">
                <path
                  d="M21.9 7.89l-1.05-3.37c-.22-.9-1-1.52-1.91-1.52H5.05c-.9 0-1.69.63-1.9 1.52L2.1 7.89c-.46 1.97.85 3.11.9 3.17V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7.94c1.12-1.12 1.09-2.41.9-3.17zM13 5h1.96l.54 3.52c.09.71-.39 1.48-1.28 1.48c-.67 0-1.22-.59-1.22-1.31V5zM6.44 8.86c-.08.65-.6 1.14-1.21 1.14c-.93 0-1.35-.97-1.19-1.64L5.05 5h1.97l-.58 3.86zM11 8.69c0 .72-.55 1.31-1.29 1.31c-.75 0-1.3-.7-1.22-1.48L9.04 5H11v3.69zM18.77 10c-.61 0-1.14-.49-1.21-1.14L16.98 5l1.93-.01l1.05 3.37c.16.67-.25 1.64-1.19 1.64z"
                ></path>
              </svg>
            </li>
          </router-link>
          <router-link to="/auctions">
            <li content="Auctions" v-tippy="{ placement: 'right', duration: 50 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M2 21h10c.55 0 1 .45 1 1s-.45 1-1 1H2c-.55 0-1-.45-1-1s.45-1 1-1zM5.24 8.07l2.83-2.83L20.8 17.97c.78.78.78 2.05 0 2.83c-.78.78-2.05.78-2.83 0L5.24 8.07zm8.49-5.66l2.83 2.83c.78.78.78 2.05 0 2.83l-1.42 1.42l-5.65-5.66l1.41-1.41c.78-.79 2.05-.79 2.83-.01zm-9.9 7.07l5.66 5.66l-1.41 1.41c-.78.78-2.05.78-2.83 0l-2.83-2.83c-.78-.78-.78-2.05 0-2.83l1.41-1.41z"
                  fill="currentColor"
                ></path>
              </svg>
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
      <div class="menu-footer center-content">
        <button
          :content="global.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          v-tippy="{ placement: 'right', duration: 50 }"
          class="theme-toggle theme-toggle-js h-[55px] w-[55px] p-[8px] cursor-pointer"
          @click="toggleDark"
        >
          <svg
            v-show="global.isDark"
            class="fill-white"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            enable-background="new 0 0 512 512"
            xml:space="preserve"
          >
            <path
              d="M401.4,354.2c-2.9,0.1-5.8,0.2-8.7,0.2c-47.9,0-93-18.9-126.8-53.4c-33.9-34.4-52.5-80.1-52.5-128.8
	c0-27.7,6.1-54.5,17.5-78.7c3.1-6.6,9.3-16.6,13.6-23.4c1.9-2.9-0.5-6.7-3.9-6.1c-6,0.9-15.2,2.9-27.7,6.8
	C135.1,95.5,80,168.7,80,255c0,106.6,85.1,193,190.1,193c58,0,110-26.4,144.9-68.1c6-7.2,11.5-13.8,16.4-21.8c1.8-3-0.7-6.7-4.1-6.1
	C418.8,353.7,410.2,353.8,401.4,354.2z"
            ></path>
          </svg>
          <svg v-show="!global.isDark" viewBox="0 0 24 24">
            <g>
              <path
                d="M12 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 2zm5 10a5 5 0 1 1-10 0a5 5 0 0 1 10 0zm4.25.75a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5zM12 19a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 19zm-7.75-6.25a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5zm-.03-8.53a.75.75 0 0 1 1.06 0l1.5 1.5a.75.75 0 0 1-1.06 1.06l-1.5-1.5a.75.75 0 0 1 0-1.06zm1.06 15.56a.75.75 0 1 1-1.06-1.06l1.5-1.5a.75.75 0 1 1 1.06 1.06l-1.5 1.5zm14.5-15.56a.75.75 0 0 0-1.06 0l-1.5 1.5a.75.75 0 0 0 1.06 1.06l1.5-1.5a.75.75 0 0 0 0-1.06zm-1.06 15.56a.75.75 0 1 0 1.06-1.06l-1.5-1.5a.75.75 0 1 0-1.06 1.06l1.5 1.5z"
                fill="#ffffff"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
li svg {
  @apply h-[45px] w-[45px] p-3 fill-white;
}
.menu-items li,
.menu-footer {
  @apply w-[45px] h-[45px] flex justify-center hover:bg-accent rounded-round cursor-pointer my-[3px] border-2 border-transparent duration-200;
}
.menu-items li img,
.menu-footer img {
  @apply max-w-[20px];
}
.menu-items li:hover img,
.menu-footer:hover img {
  filter: invert(0) sepia(0) saturate(1) hue-rotate(0deg) brightness(1.2);
}
.menu-items li:hover,
.menu-footer:hover {
  box-shadow: 0px 3px 8px -1px rgba(0, 0, 0, 0.46);
  -webkit-animation: animation 1000ms linear both;
  animation: animation 1000ms linear both;
}

.menu-footer svg {
  @apply scale-[0.8];
}

.menu-items .router-link-active > li {
  @apply bg-accent bg-opacity-30 border-primary;
  position: relative;
}
</style>
