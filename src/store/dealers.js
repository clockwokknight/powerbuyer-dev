import { defineStore } from "pinia";

export const useDealers = defineStore('dealers', {
    state: () => ({
        latest: '1'
    }),
    getters: {
    },
    actions: {
        SET_LATEST(id) {
            if (id) {
                this.latest = id;
            }
        }
    },
});
