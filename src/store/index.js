import { createStore } from 'vuex';
import vendors from '@/store/vendors';
import state from '@/store/global';

export default createStore({
    modules: {
        vendors,
        state,
    }
})