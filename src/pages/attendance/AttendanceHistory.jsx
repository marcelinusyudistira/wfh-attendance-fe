import { useState, useEffect } from "react";
import Table from "../../components/composite/Table";
import dayjs from "dayjs";
import { Calendar, MapPin } from "lucide-react";

function AttendanceHistory() {
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAttendances();
    }, []);

    const loadAttendances = async () => {
        try {
            setLoading(true);
            const res = {
                data: [
                    {
                        id: 1,
                        datetime: "2026-03-10T09:00:00Z",
                        latitude: "-7.76678",
                        longitude: "110.23387",
                        status: "Present",
                    },
                    {
                        id: 2,
                        datetime: "2026-03-09T08:55:00Z",
                        latitude: "-7.76400",
                        longitude: "110.23100",
                        status: "Present",
                    },
                    {
                        id: 3,
                        datetime: "2026-03-08T09:10:00Z",
                        latitude: "-7.76500",
                        longitude: "110.23200",
                        status: "Late",
                    },
                ],
            };

            setAttendances(res.data);
        } catch (error) {
            console.error("Failed to load attendance history:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: "date",
            title: "Date",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>{dayjs(row.datetime).format("DD MMM YYYY")}</span>
                </div>
            ),
        },
        {
            key: "time",
            title: "Check In Time",
            render: (row) => dayjs(row.datetime).format("HH:mm:ss"),
        },
        {
            key: "status",
            title: "Status",
            render: (row) => {
                const statusColors = {
                    Present: "bg-green-100 text-green-700",
                    Late: "bg-yellow-100 text-yellow-700",
                    Absent: "bg-red-100 text-red-700",
                };

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[row.status] || "bg-gray-100 text-gray-700"}`}
                    >
                        {row.status}
                    </span>
                );
            },
        },
        {
            key: "location",
            title: "Location",
            render: (row) => (
                <a
                    href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                    <MapPin size={16} />
                    <span>View Map</span>
                </a>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Attendance History
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View your attendance records
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading...
                    </div>
                ) : (
                    <div className="p-6">
                        <Table columns={columns} data={attendances} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AttendanceHistory;
