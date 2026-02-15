import axios from "axios";

export const api = axios.create({
    baseURL: "https://todolist-api-fastify-production.up.railway.app",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("@todo:token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});