import { api } from '@/api/config';

export default {
    all()
    {
        return api.get( '/vendors' );
    },
    create(data)
    {
        return api.post( `/vendors/update/${ data.id }`, data );
    },
};
