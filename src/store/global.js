import { defineStore } from 'pinia';

export const useGlobalState = defineStore('global', {
    state: () => {
        return {
            drawer: { active: false, context: null },
            tabs: [],
            stuck: [false, false],
        };
    },
    actions: {
        toggleDrawer() {
            this.drawer = !this.drawer;
        },
        openDrawer(context) {
            this.drawer = { active: true, context: context };
        },
        closeDrawer(context) {
            this.drawer = { active: false, context: context };
        },
        addTab(item) {
            let tabs = this.tabs;
            item && tabs.push(item);
            this.tabs = Array.from(new Set(tabs));
            this.tabIDs = Array.from(new Set(tabs));
            console.log('tabs: ', this.tabs);
        },
        closeTab(index) {
            this.tabs.splice(index, 1);
        },
        stick(val) {
            this.stuck = val;
        }
    },
});

