import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { userFromJwt } from "../../utils/jwt";

function LoginPage() {
    const { login } = useAuth();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await authService.login(form);
            const data = res?.data;

            const token =
                data?.token ||
                data?.access_token ||
                data?.accessToken ||
                data?.data?.token ||
                data?.data?.access_token ||
                data?.data?.accessToken;

            const resolvedUser =
                data?.user ||
                data?.data?.user ||
                data?.profile ||
                data?.data?.profile ||
                null;

            if (!token) {
                throw new Error("Login response missing token");
            }

            const fallbackUser = {
                email: form.email,
                role: data?.role || data?.data?.role || "employee",
                name: data?.name || data?.data?.name || form.email,
            };

            const decodedUser = userFromJwt(token, fallbackUser);
            const userData = resolvedUser || decodedUser || fallbackUser;

            login({ user: userData, token });
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        WFH Attendance
                    </h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Demo Accounts:</p>
                    <p className="text-xs text-gray-500">
                        • Admin: admin@example.com / password
                    </p>
                    <p className="text-xs text-gray-500">
                        • Employee: employee@example.com / password
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
