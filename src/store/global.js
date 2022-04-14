import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useGlobalState = defineStore("global", {
  state: () => {
    return { // TODO : find out why local storage is broken (adblock?)
      
      documentTitle: "PowerBuyer",
      isMobile: true,
      isDark: true,
      
      stuck: [false, false], // find & refactor

      inventory: {
        stuck: [false, false] // find & refactor
      },

      pages: {
        dashboard: {

        },
        inventory: {

        },
        buyers: {

        },
        lanes: {

        },
        auctions: {

        },
        deals: {

        },
        vendors: {

        },
        lenders: {

        },
      },


      list: {
        active: false,
        context: null,
      },
      drawer: {
        active: false,
        context: null,
      },
      latest: {
        inventory: '',
        vendors: ''
      },

    }
  },
  actions: {
    setMobile(val) {
      this.isMobile = val;
    },
    setDark(val) {
      this.isDark = val;
    },
    toggleDrawer() {
      this.drawer.active = !this.drawer.active;
    },
    openDrawer(context) {
      this.drawer = { active: true, context: context };
    },
    closeDrawer(context) {
      this.drawer = { active: false, context: context };
    },
    toggleList() {
      this.list.active = !this.list.active;
    },
    setListActive(val, context) { // TODO : refactor arg swap
      this.list = { active: val, context: context };
    },
    stick(val) {
      this.stuck = val;
    },
    setDocumentTitle(title) {
      this.documentTitle = title;
    },
    setLatest(id, context) {
      this.latest[context] = id;
    }
  },
});
