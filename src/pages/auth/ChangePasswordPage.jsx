import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function ChangePasswordPage() {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.changePassword(form);
            alert("Password berhasil diubah");

            navigate(isAdmin ? "/admin/dashboard" : "/attendance");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Gagal mengubah password";

            console.error("Change password error:", error);
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Change Password
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {user?.email || ""}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Old Password"
                        name="old_password"
                        type="password"
                        value={form.old_password}
                        onChange={handleChange}
                        placeholder="Enter old password"
                        required
                    />

                    <Input
                        label="New Password"
                        name="new_password"
                        type="password"
                        value={form.new_password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                            type="button"
                            unstyled
                            onClick={() =>
                                navigate(
                                    isAdmin
                                        ? "/admin/dashboard"
                                        : "/attendance",
                                )
                            }
                            className="w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordPage;
