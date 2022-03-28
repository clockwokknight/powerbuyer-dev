import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useGlobalState = defineStore("global", {
  state: () => {
    return useLocalStorage("state", {
      isMobile: true,
      isDark: true,
      tabs: {
        active: false,
        context: null,
        stuck: [false, false],
      },
      list: {
        active: false,
        context: null,
      },
      drawer: {
        active: false,
        context: null,
      },
    });
  },
  actions: {

  },
});
