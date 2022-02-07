import vendors from "@/api/vendors";
import { defineStore } from "pinia";

export const useVendors = defineStore( 'vendors', {
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
        searchText: ''
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
        GET_SELECTED_TABS(state) {
            return state.tab.selected
        },
    },
    actions: {
        SET_SEARCH_TERM(text) {
            this.$state.searchText = text;
        },
        GET_ALL_VENDORS() {
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
        }
    },
} );