import vehicles from "@/api/vehicles";
import { defineStore } from "pinia";

export const useVehicles = defineStore('vehicles', {
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
        GET_VEHICLES(state) {
            return state.list.all
        },
        GET_FILTERED_VEHICLES(state) {
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
        SET_SEARCH_TERM(text) {
            this.$state.searchText = text;
        },
        SET_VEHICLE_VALUE(key, val) {
            this.$state.tab.active[key] = val;
        },
        SET_CURRENT_VEHICLE(payload) {
            this.$state.tab.selected = payload;
        },
        GET_ALL_VEHICLES() {
            vendors.all().then( res => {
                const data = res.data
                this.$state.list.all = res.data.data
                this.$state.list.filtered = [ ...this.$state.list.all ]
            } )
        },
        CREATE_NEW_TAB(payload) {
            // if the tabs list doesn't already have the vendor information in it
            if ( !this.$state.tabs.includes( payload ) ) {
                // add the vendor data to the tabs list
                this.$state.tabs = this.$state.tabs.concat(payload)
            }

            // set it as the active tab
            this.tab.active = payload;

            // set it as the selected tab
            this.tab.selected = payload;
        },
        SET_NEW_TABS(payload) {
            this.$state.tabs = payload;
        },
        CLOSE_TAB(payload) {
            this.$state.tabs = this.$state.tabs.filter(tab => tab.id != payload)
        },
        FILTER_LIST(searchText) {
            if( searchText.length < 2 ) {
                // remove the slice in order to get all data
                this.$state.list.filtered = this.$state.list.all;
            }
            else {
                this.$state.list.filtered = this.$state.list.filtered.filter( vendor => vendor.name.toLowerCase().includes(searchText) )
            }
        },
        SET_ACTIVE_TAB(payload) {
            this.$state.tab.active = payload
        },
        SET_SELECTED_TAB(payload) {
            this.$state.tab.selected = payload
        },
        TRIGGER_INPUT_FOCUS(el) {
            el.focus();
        },
        TRIGGER_INPUT_BLUR(el) {
            el.blur();
        },
        SET_LATEST(id) {
            if (id) {
                this.latest = id;
            }
        }
    },
} );
