import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Calendar, Clock, Menu, X, KeyRound } from "lucide-react";
import { useState } from "react";
import Button from "../components/ui/Button";

function EmployeeLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { to: "/attendance", label: "Attendance", icon: Calendar },
        { to: "/history", label: "History", icon: Clock },
        { to: "/change-password", label: "Change Password", icon: KeyRound },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-50">
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b">
                        <h1 className="text-xl font-bold text-blue-600">
                            Employee Portal
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            WFH Attendance
                        </p>
                    </div>

                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-2">
                            {menuItems.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive(to)
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{label}</span>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    <div className="p-4 border-t">
                        <Button
                            type="button"
                            unstyled
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <Button
                            type="button"
                            unstyled
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>

                        <div className="hidden lg:block">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {menuItems.find((item) => isActive(item.to))
                                    ?.label || "Attendance"}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">
                                    {user?.name || "Employee"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Employee
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0) || "E"}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default EmployeeLayout;
