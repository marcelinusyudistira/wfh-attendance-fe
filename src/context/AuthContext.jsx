import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { userFromJwt } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = () => {
            try {
                const storedAuth = localStorage.getItem("auth");
                if (storedAuth) {
                    const parsed = JSON.parse(storedAuth);
                    if (parsed?.token) {
                        setToken(parsed.token);
                    }

                    if (parsed?.user) {
                        setUser(parsed.user);
                    } else if (parsed?.token) {
                        const decoded = userFromJwt(parsed.token);
                        if (decoded) setUser(decoded);
                    }
                    setLoading(false);
                    return;
                }

                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch {}
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(
        ({ user: userData, token: tokenValue }) => {
            setUser(userData || null);
            setToken(tokenValue || null);

            localStorage.setItem(
                "auth",
                JSON.stringify({
                    user: userData || null,
                    token: tokenValue || null,
                }),
            );

            if (userData) {
                localStorage.setItem("user", JSON.stringify(userData));
            } else {
                localStorage.removeItem("user");
            }

            if (userData?.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/attendance");
            }
        },
        [navigate],
    );

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        navigate("/");
    }, [navigate]);

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated: !!token || !!user,
            isAdmin: user?.role === "admin",
        }),
        [user, token, loading, login, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
