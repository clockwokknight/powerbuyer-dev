import { defineStore } from 'pinia';

export const useGlobalState = defineStore('global', {
    state: () => {
        return {
            drawer: { active: false, context: null },
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
    },
});

