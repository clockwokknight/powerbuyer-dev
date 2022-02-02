import vendors from '@/api/vendors'

export default {
    
    state: () => ( {
        list: [],
        filteredList: [],
        tab: {
            selected: {},
            active: {}
        },
        tabsList: [],
        filter: {
            search: ''
        }
    }),
    
    getters: {
        FILTERED_VENDORS(state) {
            return state.list
        },
        GET_TABS_LIST(state) {
            return state.tabsList
        },
    },

    mutations: {
        SET_TABS( state, data ) {
            state.tabsList = data
        },
        SET_VENDORS( state, data ) {
            state.list = data
        },
        SET_VENDOR_TAB( state, data ) {
            state.tab.selected = data
        },
        SET_FILTERED_VENDORS( state, data ) {
            state.filteredList = data;
        },
        // FILTER_VENDORS( state ) {
        //     const list = [...state.list];
        //     state.filteredList = list
        //     state.filteredList = (filter) => {
        //         if (condition) {
                    
        //         }
        //     }
        // },
    },

    actions: {
        GET_VENDORS({ commit }) {
            vendors.all().then( res => commit( 'SET_VENDORS', res.data ) )
        },
        SET_SELECTED_VENDOR({ commit }, vendorInfo ) {
            commit( 'SET_VENDOR_TAB', vendorInfo )
        },
        UPDATE_VENDORS_LIST({ commit, state }, input) {
            let updatedList = state.list.filter(vendor => vendor.company.toLowerCase().includes(input))
            commit( 'SET_VENDORS', updatedList );
        },
        ADD_TAB({ commit, state }, payload) {
            // alert('hi')
            const tabs = [...state.tabsList.concat( payload )]
            commit( 'SET_TABS', tabs );
        },
    }

}