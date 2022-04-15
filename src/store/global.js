import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useGlobalState = defineStore("global", {
  state: () => {
    return { // TODO : find out why local storage is broken (adblock?)
      
      documentTitle: "PowerBuyer",
      isMobile: true,
      isDark: true,

      validators: {
        required: (input) => {
          return input && input !== "";
        },
        phone: (input) => {
          return /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(input);
        },
        email: (input) => {
          return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
            input
          );
        },
        // add further validators here
      },
      
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
