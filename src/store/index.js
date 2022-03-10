import { createStore } from 'vuex';
import vendors from '@/store/vendors';
import global from '@/store/global';

export default createStore({
    modules: {
        vendors,
        global,
    }
});