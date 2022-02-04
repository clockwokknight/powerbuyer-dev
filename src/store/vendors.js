import vendors from "@/api/vendors";
import { defineStore } from "pinia";

export const useVendors = defineStore( 'vendors', {
    state: () => ( {
        list: [],
        tabs: [],
        tab: {
            active: {},
            selected: {}
        }
    } ),
    getters: {
        GET_VENDORS(state) {
            return state.list
        },
        GET_TABS(state) {
            return state.tabs
        },
        GET_ACTIVE_TAB(state) {
            return state.tab.active
        },
        GET_SELECTED_TABS(state) {
            return state.tab.selected
        },
    },
    actions: {
        GET_FILTERED_VENDORS() {
            vendors.all().then( res => this.$state.list = res.data )
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
            // alert(payload)
            this.$state.tabs = this.$state.tabs.filter(tab => tab.id != payload)
        }
    },
} );