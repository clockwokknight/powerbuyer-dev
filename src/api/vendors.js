import { api } from '@/api/config';

export default {
    all()
    {
        return api.get( '/vendors' );
    },
    retrieve(id)
    {
        return api.get( `/vendors/${ id }`);
    },
    create(data)
    {
        return api.post( `/vendors/update/${ data.id }`, data );
    },
    add(data)
    {   
        console.log(data)
        //console.log(api.post( '/vendors/store', data ))
        return api.post( '/vendors/store', data )
    },
    allCategories()
    {
        return api.get( '/vendor_categories' );
    },
};
