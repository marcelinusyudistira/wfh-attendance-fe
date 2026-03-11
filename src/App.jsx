import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

import LoginPage from "./pages/auth/LoginPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";

import AttendancePage from "./pages/attendance/AttendancePage";
import AttendanceHistory from "./pages/attendance/AttendanceHistory";

import Dashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import Attendance from "./pages/admin/Attendance";

function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/attendance" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginPage />} />

                    <Route
                        path="/attendance"
                        element={
                            <ProtectedRoute>
                                <AttendancePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/change-password"
                        element={
                            <ProtectedRoute>
                                <ChangePasswordPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        element={
                            <ProtectedRoute>
                                <EmployeeLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path="/history"
                            element={<AttendanceHistory />}
                        />
                    </Route>

                    <Route
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path="/admin/dashboard"
                            element={<Dashboard />}
                        />
                        <Route
                            path="/admin/employees"
                            element={<Employees />}
                        />
                        <Route
                            path="/admin/attendance"
                            element={<Attendance />}
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
