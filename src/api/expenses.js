import { api } from '@/api/config';

export default {
    all()
    {
        return api.get( '/expenses' );
    },
    getItems(id)
    {
        return api.get( `/expense_items/${id}` );
    },
    update()
    {
        
    },
};