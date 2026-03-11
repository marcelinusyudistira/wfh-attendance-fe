import { useEffect, useState } from "react";
import Table from "../../components/composite/Table";
import { Eye, MapPin } from "lucide-react";
import Button from "../../components/ui/Button";
import PhotoModal from "../../components/composite/PhotoModal";
import FilterBar from "../../components/composite/FilterBar";
import reportService from "../../services/reportService";

const formatTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatWorkHours = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    const numberValue = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numberValue)) return String(value);
    return numberValue.toFixed(2);
};

const STATUS_META = {
    CHECKED_IN: { label: "Checked In", className: "text-yellow-600" },
    CHECKED_OUT: { label: "Checked Out", className: "text-green-600" },
    ABSENT: { label: "Absent", className: "text-red-600" },
    AUTO_CHECKOUT: { label: "Auto Checkout", className: "text-purple-600" },
};

function Attendance() {
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [type, setType] = useState("checkin");

    const [query, setQuery] = useState({
        start_date: "",
        end_date: "",
        status: "",
        search: "",
        employee_id: "",
        page: 1,
        limit: 10,
    });

    const loadAttendances = async (nextQuery = query) => {
        try {
            setLoading(true);

            const params = {
                ...(nextQuery.start_date
                    ? { start_date: nextQuery.start_date }
                    : {}),
                ...(nextQuery.end_date ? { end_date: nextQuery.end_date } : {}),
                ...(nextQuery.status ? { status: nextQuery.status } : {}),
                ...(nextQuery.search ? { search: nextQuery.search } : {}),
                ...(nextQuery.employee_id
                    ? { employee_id: nextQuery.employee_id }
                    : {}),
                page: String(nextQuery.page),
                limit: String(nextQuery.limit),
            };

            const res = await reportService.getAttendanceReport(params);

            const data = res?.data;

            const list = (Array.isArray(data?.data) ? data.data : null) || [];

            const total = data.data.total;

            setAttendances(list);
            setTotalItems(Number(total) || 0);
        } catch (err) {
            console.error(err);
            alert("Failed to load attendance report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadAttendances(query);
        }, 250);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        query.start_date,
        query.end_date,
        query.status,
        query.search,
        query.employee_id,
        query.page,
        query.limit,
    ]);
    const handleSearch = (searchTerm) => {
        setQuery((prev) => ({ ...prev, search: searchTerm || "", page: 1 }));
    };

    const handleFilterChange = (filters) => {
        setQuery((prev) => ({
            ...prev,
            start_date: filters.start_date || "",
            end_date: filters.end_date || "",
            status: filters.status || "",
            page: 1,
        }));
    };

    const handleClearFilters = () => {
        setQuery((prev) => ({
            ...prev,
            start_date: "",
            end_date: "",
            status: "",
            search: "",
            employee_id: "",
            page: 1,
        }));
    };
    const statusOptions = [
        { value: "CHECKED_IN", label: "Checked In" },
        { value: "CHECKED_OUT", label: "Checked Out" },
        { value: "ABSENT", label: "Absent" },
        { value: "AUTO_CHECKOUT", label: "Auto Checkout" },
    ];

    const columns = [
        {
            key: "employee_code",
            title: "Employee Code",
            render: (row) => row?.employee?.employee_code || "-",
        },
        {
            key: "name",
            title: "Name",
            render: (row) => row?.employee?.name || "-",
        },
        {
            key: "attendance_date",
            title: "Date",
        },
        {
            key: "check_in",
            title: "Check In",
            render: (row) => formatTime(row?.check_in),
        },
        {
            key: "check_out",
            title: "Check Out",
            render: (row) => formatTime(row?.check_out),
        },
        {
            key: "work_hours",
            title: "Work Hours",
            render: (row) => formatWorkHours(row?.work_hours),
        },
        {
            key: "status",
            title: "Status",
            render: (row) => {
                const meta = STATUS_META[row?.status] || {
                    label: row?.status || "-",
                    className: "text-gray-600",
                };

                return (
                    <span className={`${meta.className} font-medium`}>
                        {meta.label}
                    </span>
                );
            },
        },
        {
            key: "photo_checkin",
            title: "Check In Photo",
            render: (row) => {
                const photo = row?.photo_checkin;
                const disabled = !photo;

                return (
                    <Button
                        variant="secondary"
                        disabled={disabled}
                        onClick={() => {
                            setPreviewPhoto(photo);
                            setType("checkin");
                        }}
                        title={disabled ? "No photo" : "Preview photo"}
                    >
                        <Eye size={16} />
                    </Button>
                );
            },
        },
        {
            key: "photo_checkout",
            title: "Check Out Photo",
            render: (row) => {
                const photo = row?.photo_checkout;
                const disabled = !photo;

                return (
                    <Button
                        variant="secondary"
                        disabled={disabled}
                        onClick={() => {
                            setPreviewPhoto(photo);
                            setType("checkout");
                        }}
                        title={disabled ? "No photo" : "Preview photo"}
                    >
                        <Eye size={16} />
                    </Button>
                );
            },
        },
        {
            key: "location",
            title: "Location",
            render: (row) => {
                const lat = row?.checkin_lat;
                const long = row?.checkin_long;
                const disabled = !lat || !long;

                return (
                    <Button
                        variant="secondary"
                        disabled={disabled}
                        title={
                            disabled
                                ? "No location data"
                                : "Open location in Google Maps"
                        }
                        onClick={() =>
                            window.open(
                                `https://maps.google.com?q=${lat},${long}`,
                                "_blank",
                            )
                        }
                    >
                        <MapPin size={16} />
                    </Button>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Attendance Monitoring
                </h1>
                <p className="text-sm text-gray-500">
                    Monitor employee attendance in real-time
                </p>
            </div>

            <FilterBar
                searchPlaceholder="Search by employee name or code..."
                onSearch={handleSearch}
                filters={[
                    {
                        type: "input",
                        name: "start_date",
                        inputType: "date",
                        placeholder: "From Date",
                    },
                    {
                        type: "input",
                        name: "end_date",
                        inputType: "date",
                        placeholder: "To Date",
                    },
                    {
                        type: "select",
                        name: "status",
                        options: statusOptions,
                        placeholder: "All Status",
                    },
                ]}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <Table
                        columns={columns}
                        data={attendances}
                        loading={loading}
                        pagination={true}
                        pageSize={query.limit}
                        currentPage={query.page}
                        totalItems={totalItems}
                        onPageChange={(page, pageSize) => {
                            setQuery((prev) => ({
                                ...prev,
                                page,
                                limit: pageSize,
                            }));
                        }}
                    />
                </div>
            </div>
            <PhotoModal
                photo={previewPhoto}
                type={type}
                onClose={() => setPreviewPhoto(null)}
            />
        </div>
    );
}

export default Attendance;
