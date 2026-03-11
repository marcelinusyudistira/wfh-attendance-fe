import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import attendanceService from "../../services/attendanceService";
import CameraCapture from "../../components/composite/CameraCapture";
import Button from "../../components/ui/Button";
import Snackbar from "../../components/ui/Snackbar";
import useGeolocation from "../../hooks/useGeolocation";
import { useAuth } from "../../context/AuthContext";
import { LogOut, History } from "lucide-react";

const isAlreadyActionError = (err) => {
    const status = err?.response?.status;
    const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "";

    if (status === 409) return true;
    if (typeof message !== "string") return false;
    const lower = message.toLowerCase();
    return (
        lower.includes("already") ||
        lower.includes("sudah") ||
        lower.includes("checked in") ||
        lower.includes("checked out") ||
        lower.includes("checkin") ||
        lower.includes("checkout")
    );
};

function AttendancePage() {
    const [photo, setPhoto] = useState(null);
    const [captureKey, setCaptureKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const { location, loadingLocation, getLocation, resetLocation } =
        useGeolocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [time, setTime] = useState(dayjs());
    const date = time.format("DD MMMM YYYY");
    const currentTime = time.format("HH:mm:ss");

    const handlePhotoCapture = (file) => {
        setPhoto(file);
        getLocation();
    };

    const handleSubmit = async (action) => {
        if (!photo) {
            alert("Please take photo first");
            return;
        }

        if (loadingLocation) {
            alert("Waiting for location, please try again");
            return;
        }

        if (!location) {
            getLocation();
            alert("Please allow location access");
            return;
        }

        const coords = {
            latitude: String(location.latitude),
            longitude: String(location.longitude),
        };

        try {
            setLoading(true);
            if (action === "checkout") {
                await attendanceService.checkout({ photo, ...coords });
                alert("Checkout submitted");
            } else {
                await attendanceService.checkin({ photo, ...coords });
                alert("Check-in submitted");
            }

            setPhoto(null);
            resetLocation();
            setCaptureKey((prev) => prev + 1);
            navigate("/attendance", { replace: true });
        } catch (err) {
            console.error("Submit failed:", err);
            const already = isAlreadyActionError(err);
            const message = already
                ? action === "checkout"
                    ? "Anda sudah checkout."
                    : "Anda sudah checkin."
                : "Submit gagal. Silakan coba lagi.";

            setSnackbar({ open: true, message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(dayjs());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0) || "E"}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">
                                {user?.name || "Employee"}
                            </p>
                            <p className="text-xs text-gray-500">
                                Employee Portal
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            unstyled
                            onClick={() => navigate("/change-password")}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span className="hidden sm:inline">Password</span>
                            <span className="sm:hidden">Pwd</span>
                        </Button>
                        <Button
                            type="button"
                            unstyled
                            onClick={() => navigate("/history")}
                            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <History size={18} />
                            <span className="hidden sm:inline">History</span>
                        </Button>
                        <Button
                            type="button"
                            unstyled
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex justify-center items-center p-4">
                <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-xl font-bold text-center mb-6">
                        WFH Attendance
                    </h1>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold">{date}</p>

                        <p className="text-sm text-gray-500 mt-2">Time</p>
                        <p className="text-2xl font-bold">{currentTime}</p>
                    </div>

                    <CameraCapture
                        key={captureKey}
                        onCapture={handlePhotoCapture}
                    />

                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Photo</span>
                            <span
                                className={
                                    photo ? "text-green-600" : "text-gray-400"
                                }
                            >
                                {photo ? "Captured" : "Waiting"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Location</span>
                            <span
                                className={
                                    location
                                        ? "text-green-600"
                                        : "text-gray-400"
                                }
                            >
                                {location ? "Detected" : "Waiting"}
                            </span>
                        </div>
                    </div>

                    {loadingLocation && (
                        <p className="text-center text-sm text-gray-500 mt-3">
                            Getting location...
                        </p>
                    )}

                    {location && (
                        <a
                            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 text-sm mt-2 block"
                        >
                            View on Map
                        </a>
                    )}

                    {location && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Location</p>

                            <p className="text-sm">Lat: {location.latitude}</p>

                            <p className="text-sm">
                                Long: {location.longitude}
                            </p>
                        </div>
                    )}

                    {photo && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                                onClick={() => handleSubmit("checkin")}
                                disabled={
                                    loading || loadingLocation || !location
                                }
                                className="w-full py-3"
                            >
                                {loading ? "Submitting..." : "Check In"}
                            </Button>
                            <Button
                                onClick={() => handleSubmit("checkout")}
                                disabled={
                                    loading || loadingLocation || !location
                                }
                                className="w-full py-3"
                            >
                                {loading ? "Submitting..." : "Check Out"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Snackbar
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar({ open: false, message: "" })}
            />
        </div>
    );
}

export default AttendancePage;
