import axios from "axios";

export const api = axios.create({
    baseURL: "https://gmtvinventory.com/api",
    headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    },
});