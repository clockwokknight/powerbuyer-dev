import axios from 'axios';

export const api = axios.create( {
    baseURL: 'https://gmtvinventory.com/api',
    headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json',
    }
} );