import vendors from '@/api/vendors'

export default {
    
    state: () => ( {
        all: []
    }),
    
    getters: {
        vendorsFiltered(state) {
            return state.all
        }
    },

    mutations: {
        setVendors( state, data ) {
            state.all = data
        }
    },

    actions: {
        getVendors({ commit }) {
            vendors.all().then( res => commit( 'setVendors', res.data ) )
        }
    }

}