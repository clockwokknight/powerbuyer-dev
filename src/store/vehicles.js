import { defineStore } from "pinia";

export const useVehicles = defineStore('vehicles', {
    state: () => ({
        latest: '1'
    }),
    actions: {
        setLatest(id) {
            if (id) {
                this.latest = id;
            }
        }
    },
});