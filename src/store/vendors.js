import vendors from "@/api/vendors";
import { defineStore } from "pinia";

export const useVendors = defineStore('vendors', {
    state: () => ( {
        list: {
            all: [],
            filtered: []
        },
        tabs: [],
        tab: {
            active: {},
            selected: {}
        },
        searchText: '',
        latest: '1'
    } ),
    getters: {
        GET_VENDORS(state) {
            return state.list.all
        },
        GET_FILTERED_VENDORS(state) {
            return state.list.filtered
        },
        GET_TABS(state) {
            let tabs = [ ...state.tabs ];
            tabs.reverse()
            return tabs
        },
        GET_ACTIVE_TAB(state) {
            return state.tab.active
        },
        GET_SELECTED_TAB(state) {
            return state.tab.selected
        },
    },
    actions: {
        setLatest(id) {
            if (id) {
                this.latest = id;
            }
        }
    },
} );
