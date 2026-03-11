import axios from "axios";

function getStoredToken() {
    try {
        const rawAuth = localStorage.getItem("auth");
        if (rawAuth) {
            const parsed = JSON.parse(rawAuth);
            if (parsed?.token) return parsed.token;
        }
    } catch {}
    return null;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

api.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

export default api;
