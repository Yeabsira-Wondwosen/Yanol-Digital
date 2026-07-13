import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api", // Laravel API base
    headers: {
        Accept: "application/json",
    },
    // If you're using Sanctum with cookies, keep this:
    // withCredentials: true,
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
            // Optionally redirect here if you want global handling
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Use your configured baseURL here: DO NOT hardcode full URL
export async function checkAuthentication() {
    try {
        // hit a protected route that requires auth, e.g. /me
        const response = await api.get("/me");
        // If successful, the user is authenticated.
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Not authenticated → send to login
            window.location.href = "/login";
        }
        throw error;
    }
}

export default api;