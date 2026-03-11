import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import reportService from "../../services/reportService";
import departmentService from "../../services/departmentService";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const formatDayLabel = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return String(dateString);
    return new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "short",
    }).format(date);
};

const fallbackData = [
    { day: "Mon", attendance: 20 },
    { day: "Tue", attendance: 18 },
    { day: "Wed", attendance: 25 },
    { day: "Thu", attendance: 22 },
    { day: "Fri", attendance: 19 },
];

const toISODate = (d) => dayjs(d).format("YYYY-MM-DD");

const getDefaultRange = () => {
    const end = dayjs();
    const start = end.subtract(6, "day");
    return {
        start_date: toISODate(start),
        end_date: toISODate(end),
    };
};

function Dashboard() {
    const [data, setData] = useState(fallbackData);
    const [loading, setLoading] = useState(false);
    const [departmentOptions, setDepartmentOptions] = useState([]);

    const [filters, setFilters] = useState(() => {
        const range = getDefaultRange();
        return {
            start_date: range.start_date,
            end_date: range.end_date,
            department_id: "",
        };
    });

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const res = await departmentService.getDepartments();
                const payload = res?.data;
                const list =
                    (Array.isArray(payload) ? payload : null) ||
                    (Array.isArray(payload?.data) ? payload.data : null) ||
                    (Array.isArray(payload?.items) ? payload.items : null) ||
                    (Array.isArray(payload?.data?.items)
                        ? payload.data.items
                        : null) ||
                    [];

                const options = list
                    .map((dept) => ({
                        value: dept?.id || "",
                        label:
                            dept?.department_name ||
                            dept?.name ||
                            dept?.departmentName ||
                            "",
                    }))
                    .filter((opt) => opt.value && opt.label);

                setDepartmentOptions(options);
            } catch (err) {
                console.error("Failed to load departments:", err);
                setDepartmentOptions([]);
            }
        };

        loadDepartments();
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const params = {
                    ...(filters.start_date
                        ? { start_date: filters.start_date }
                        : {}),
                    ...(filters.end_date ? { end_date: filters.end_date } : {}),
                    ...(filters.department_id
                        ? { department_id: filters.department_id }
                        : {}),
                };

                const res = await reportService.getDashboardReport(params);
                const payload = res?.data;

                const daily =
                    (Array.isArray(payload?.daily) ? payload.daily : null) ||
                    (Array.isArray(payload?.data?.daily)
                        ? payload.data.daily
                        : null);

                if (daily && daily.length > 0) {
                    const series = daily.map((d) => {
                        const checkedIn = Number(d?.CHECKED_IN || 0);
                        const checkedOut = Number(d?.CHECKED_OUT || 0);
                        const attendance =
                            (Number.isNaN(checkedIn) ? 0 : checkedIn) +
                            (Number.isNaN(checkedOut) ? 0 : checkedOut);

                        return {
                            day: formatDayLabel(d?.date),
                            attendance,
                        };
                    });

                    setData(series);
                    return;
                }

                const series =
                    (Array.isArray(payload) ? payload : null) ||
                    (Array.isArray(payload?.data) ? payload.data : null) ||
                    (Array.isArray(payload?.items) ? payload.items : null) ||
                    (Array.isArray(payload?.data?.items)
                        ? payload.data.items
                        : null) ||
                    (Array.isArray(payload?.weeklyAttendance)
                        ? payload.weeklyAttendance
                        : null) ||
                    (Array.isArray(payload?.weekly_attendance)
                        ? payload.weekly_attendance
                        : null);

                if (series && series.length > 0) setData(series);
            } catch (err) {
                console.error("Failed to load dashboard report:", err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            load();
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [filters.start_date, filters.end_date, filters.department_id]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                    Overview of attendance statistics
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <Input
                        label="Start Date"
                        type="date"
                        value={filters.start_date}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                start_date: e.target.value,
                            }))
                        }
                    />

                    <Input
                        label="End Date"
                        type="date"
                        value={filters.end_date}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                end_date: e.target.value,
                            }))
                        }
                    />

                    <Select
                        label="Department"
                        value={filters.department_id}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                department_id: e.target.value,
                            }))
                        }
                        options={departmentOptions}
                        placeholder="All Departments"
                        placeholderDisabled={false}
                    />
                </div>

                <h2 className="text-lg font-semibold mb-4">
                    Weekly Attendance
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="day" />

                        <YAxis />

                        <Tooltip />

                        <Bar dataKey="attendance" />
                    </BarChart>
                </ResponsiveContainer>

                {loading && (
                    <p className="mt-3 text-sm text-gray-500">Loading...</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
