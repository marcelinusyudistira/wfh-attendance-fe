import { useEffect, useState } from "react";
import employeeService from "../../services/employeeService";
import departmentService from "../../services/departmentService";
import Table from "../../components/composite/Table";
import Button from "../../components/ui/Button";
import EmployeeFormModal from "../../components/composite/EmployeeFormModal";
import FilterBar from "../../components/composite/FilterBar";
import Snackbar from "../../components/ui/Snackbar";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [departmentOptions, setDepartmentOptions] = useState([]);

    const [query, setQuery] = useState({
        search: "",
        department_id: "",
        page: 1,
        limit: 10,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const loadEmployees = async (nextQuery = query) => {
        try {
            setLoading(true);
            const params = {
                ...(nextQuery.search ? { search: nextQuery.search } : {}),
                ...(nextQuery.department_id
                    ? { department_id: nextQuery.department_id }
                    : {}),
                page: String(nextQuery.page),
                limit: String(nextQuery.limit),
            };

            const res = await employeeService.getEmployees(params);
            const data = res?.data;

            const list =
                (Array.isArray(data) ? data : null) ||
                (Array.isArray(data?.data) ? data.data : null) ||
                (Array.isArray(data?.items) ? data.items : null) ||
                (Array.isArray(data?.data?.items) ? data.data.items : null) ||
                [];

            const total =
                data?.total ||
                data?.meta?.total ||
                data?.pagination?.total ||
                data?.data?.total ||
                list.length;

            setEmployees(list);
            setTotalItems(Number(total) || 0);
        } catch (err) {
            console.error(err);
            alert("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadEmployees(query);
        }, 250);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.search, query.department_id, query.page, query.limit]);

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const res = await departmentService.getDepartments();
                const data = res?.data;

                const list =
                    (Array.isArray(data) ? data : null) ||
                    (Array.isArray(data?.data) ? data.data : null) ||
                    (Array.isArray(data?.items) ? data.items : null) ||
                    (Array.isArray(data?.data?.items)
                        ? data.data.items
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
                console.error(err);
                setDepartmentOptions([]);
            }
        };

        loadDepartments();
    }, []);

    const handleCreate = () => {
        setSelectedEmployee(null);
        setModalOpen(true);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setModalOpen(true);
    };

    const handleDelete = async (employee) => {
        const confirmDelete = globalThis.confirm(`Delete ${employee.name}?`);

        if (!confirmDelete) return;

        try {
            await employeeService.deleteEmployee(employee.id);
        } catch (err) {
            console.error(err);
            alert("Delete endpoint not integrated yet");
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (selectedEmployee) {
                await employeeService.updateEmployee(data, selectedEmployee.id);
                showSnackbar("Employee updated successfully");
            } else {
                await employeeService.createEmployee(data);
                showSnackbar("Employee created successfully");
            }

            setModalOpen(false);

            const nextQuery = { ...query, page: 1 };
            setQuery(nextQuery);
            loadEmployees(nextQuery);
        } catch (err) {
            console.error(err);
            alert("Save failed");
        }
    };

    const handleSearch = (searchTerm) => {
        setQuery((prev) => ({ ...prev, search: searchTerm || "", page: 1 }));
    };

    const handleFilterChange = (filters) => {
        setQuery((prev) => ({
            ...prev,
            department_id: filters.department_id || "",
            page: 1,
        }));
    };

    const handleClearFilters = () => {
        setQuery((prev) => ({
            ...prev,
            search: "",
            department_id: "",
            page: 1,
        }));
    };

    const columns = [
        {
            key: "employee_code",
            title: "Employee Code",
        },
        {
            key: "name",
            title: "Name",
        },
        {
            key: "email",
            title: "Email",
        },
        {
            key: "position",
            title: "Position",
        },
        {
            key: "department_name",
            title: "Department",
            render: (row) =>
                row?.department_name || row?.department?.department_name || "-",
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEdit(row)}>
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        disabled={true}
                        onClick={() => handleDelete(row)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Employee Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage employee data and information
                    </p>
                </div>

                <Button onClick={handleCreate}>Add Employee</Button>
            </div>
            <FilterBar
                searchPlaceholder="Search by name, code, or email..."
                onSearch={handleSearch}
                filters={[
                    {
                        type: "select",
                        name: "department_id",
                        options: departmentOptions,
                        placeholder: "All Departments",
                    },
                ]}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <Table
                        columns={columns}
                        data={employees}
                        loading={loading}
                        pagination={true}
                        pageSize={10}
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

            <EmployeeFormModal
                open={modalOpen}
                initialData={selectedEmployee}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />

            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                duration={5000}
                onClose={() => setSnackbarOpen(false)}
            />
        </div>
    );
}

export default Employees;
