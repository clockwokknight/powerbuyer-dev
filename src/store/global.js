import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useGlobalState = defineStore("global", {
  state: () => {
    const obj = useLocalStorage("state", {
      isMobile: false,
      isDark: true,

      stuck: [false, false],
      list: {
        active: false,
        context: null,
      },
      drawer: {
        active: false,
        context: null,
      },
    });
    return {
      ...obj,
      isCommandPalletOpen: false,
    };
  },
  actions: {
    toggleCommandPallet() {
      this.isCommandPalletOpen = !this.isCommandPalletOpen;
    },
    // mobile
    setMobile(val) {
      this.isMobile = val;
    },
    // dark mode
    setDark(val) {
      this.isDark = val;
    },
    // hidden drawer
    toggleDrawer() {
      this.drawer.active = !this.drawer.active;
    },
    openDrawer(context) {
      this.drawer = { active: true, context: context };
    },
    closeDrawer(context) {
      this.drawer = { active: false, context: context };
    },
    // list
    toggleList() {
      this.list.active = !this.list.active;
    },
    setListActive(val, context) {
      this.list = { active: val, context: context };
    },
    // sticky nav
    stick(val) {
      this.stuck = val;
    },
  },
});
