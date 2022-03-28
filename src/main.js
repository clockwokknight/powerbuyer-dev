import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "@/routes";
import { VueQueryPlugin } from "vue-query";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
import VueTippy from "vue-tippy";
import axios from "axios";
import App from "./App.vue";
import naive from "naive-ui";
import { gsap } from "gsap";
import "./scss/index.scss";
import mask from "@/directives/mask";
import ObserveVisibility from "@/directives/observe-visibility";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

axios.defaults.baseURL = "https://gmtvinventory.com/api";

/**
 * @type VueQueryPluginOptions
 */
const vueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};

createApp(App)
  .use(createPinia())
  .use(naive)
  .directive("mask", mask)
  .directive("observe-visibility", ObserveVisibility)
  .use(VueTippy)
  .use(VueQueryPlugin, vueQueryPluginOptions)
  .use(router)
  .mount("#app");
