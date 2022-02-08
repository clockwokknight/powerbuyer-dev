import { createApp } from "vue";

import axios from "axios";

//UI framework
import naive from "naive-ui";

//Tippy Tooltips
import VueTippy from "vue-tippy";

import App from "./App.vue";

//Tailwind CSS
import "./index.css";

//Pinia
import { createPinia } from "pinia";

//Custom Directives
import mask from "@/directives/mask";
import { router } from "@/routes";
import { VueQueryPlugin } from "vue-query";

axios.defaults.baseURL = "https://gmtvinventory.com/api";

createApp(App)
  .use(router)
  .use(naive)
  .directive("mask", mask)
  .use(createPinia())
  .use(VueTippy)
  .use(VueQueryPlugin)
  .mount("#app");
