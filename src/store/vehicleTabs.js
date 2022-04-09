import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTabsViewStore = defineStore("vehicles-tabs-view", () => {
  const tabs = ref([]);
  
  const findTabIndex = (vin) => tabs.value.findIndex((tab) => tab.vin === vin);
  
  const selectedIndex = computed(() =>
    tabs.value.findIndex((tab) => tab.active)
  );
  
  const initTabs = (payload) => (tabs.value = payload);
  
  const addTab = (payload) => {
    const index = findTabIndex(payload.vin);
    if (index === -1) {
      tabs.value = tabs.value
        .map(({ active, ...rest }) => rest)
        .concat([{ ...payload, active: true }]);
    } else {
      tabs.value = tabs.value.map(({ active, ...rest }, i) => {
        if (i === index) {
          return { ...rest, active: true };
        } else return rest;
      });
    }
  };

  const closeTab = (vin) => {
    const index = findTabIndex(vin);
    if (tabs.value.length > 0 && selectedIndex.value === index) {
      const activeIndex = index === 0 ? index + 1 : index - 1;
      tabs.value = tabs.value.map(({ active, ...rest }, i) => {
        if (i === activeIndex) {
          return { ...rest, active: true };
        } else return rest;
      });
    }
    tabs.value.splice(index, 1);
  };

  return { tabs, addTab, selectedIndex, closeTab, findTabIndex, initTabs };
});
