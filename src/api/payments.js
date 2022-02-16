import { api } from '@/api/config';

export default {
    all()
    {   
        
        return api.get( '/payments' );
    },
};