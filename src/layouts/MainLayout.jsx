import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LogOut,
    Home,
    Calendar,
    Clock,
    Users,
    BarChart2,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import Button from "../components/ui/Button";

function MainLayout() {
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const employeeLinks = [
        { to: "/attendance", label: "Attendance", icon: Calendar },
        { to: "/history", label: "History", icon: Clock },
    ];

    const adminLinks = [
        { to: "/admin/dashboard", label: "Dashboard", icon: BarChart2 },
        { to: "/admin/employees", label: "Employees", icon: Users },
        { to: "/admin/attendance", label: "Monitoring", icon: Home },
    ];

    const links = isAdmin ? [...employeeLinks, ...adminLinks] : employeeLinks;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-blue-600">
                                WFH Attendance
                            </h1>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            {links.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                        isActive(to)
                                            ? "bg-blue-100 text-blue-600 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {isAdmin ? "Admin" : "Employee"}
                                </p>
                            </div>
                            <Button
                                type="button"
                                unstyled
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </Button>
                        </div>

                        <Button
                            type="button"
                            unstyled
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </Button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden border-t">
                        <div className="px-4 py-3 space-y-2">
                            {links.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                        isActive(to)
                                            ? "bg-blue-100 text-blue-600 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </Link>
                            ))}

                            <div className="pt-3 mt-3 border-t">
                                <div className="px-3 py-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {isAdmin ? "Admin" : "Employee"}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    unstyled
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
