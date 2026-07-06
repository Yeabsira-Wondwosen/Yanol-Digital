import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api", // change to your Laravel API URL
    headers: {
        Accept: "application/json",
    },
});

// Attach the stored token (if any) to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is invalid/expired, clear it so the app falls back to the login screen
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("admin_token");
        }
        return Promise.reject(error);
    }
);

export default api;
