import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api", // change to your Laravel API URL
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
async function checkAuthentication() {
    try {
        // 1. Try to hit your protected Laravel route
        const response = await api.get('http://localhost:8000');
        // If successful, the user is authenticated. Let them stay on the dashboard!
    } catch (error) {
        // 2. If Laravel responds with a 401 Unauthorized, kick them to login
        if (error.response && error.response.status === 401) {
            window.location.href = '/login'; // Or use your framework's router.push('/login')
        }
    }
}

export default api;
