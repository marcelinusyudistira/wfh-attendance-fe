import { useState, useEffect } from "react";
import departmentService from "../../services/departmentService";
import roleService from "../../services/roleService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

function EmployeeFormModal({ open, onClose, onSubmit, initialData }) {
    const defaultForm = {
        employee_code: "",
        name: "",
        email: "",
        dob: "",
        department_id: "",
        role_id: "",
        position: "",
    };

    const [form, setForm] = useState(defaultForm);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [optionsLoading, setOptionsLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (initialData) {
            setForm({
                employee_code: initialData.employee_code || "",
                name: initialData.name || "",
                email: initialData.email || "",
                dob: initialData.dob || "",
                department_id: initialData.department_id || "",
                role_id: initialData.role_id || "",
                position: initialData.position || "",
            });
        } else {
            setForm(defaultForm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialData]);

    useEffect(() => {
        if (!open) return;

        const loadOptions = async () => {
            setOptionsLoading(true);
            try {
                const [deptRes, roleRes] = await Promise.all([
                    departmentService.getDepartments(),
                    roleService.getRoles(),
                ]);

                const deptData = deptRes?.data;
                const deptList =
                    (Array.isArray(deptData) ? deptData : null) ||
                    (Array.isArray(deptData?.data) ? deptData.data : null) ||
                    (Array.isArray(deptData?.items) ? deptData.items : null) ||
                    (Array.isArray(deptData?.data?.items)
                        ? deptData.data.items
                        : null) ||
                    [];

                const nextDeptOptions = deptList
                    .map((dept) => ({
                        value: dept?.id || "",
                        label:
                            dept?.department_name ||
                            dept?.name ||
                            dept?.departmentName ||
                            "",
                    }))
                    .filter((opt) => opt.value && opt.label);

                const roleData = roleRes?.data;
                const roleList =
                    (Array.isArray(roleData) ? roleData : null) ||
                    (Array.isArray(roleData?.data) ? roleData.data : null) ||
                    (Array.isArray(roleData?.items) ? roleData.items : null) ||
                    (Array.isArray(roleData?.data?.items)
                        ? roleData.data.items
                        : null) ||
                    [];

                const nextRoleOptions = roleList
                    .map((role) => ({
                        value: role?.id || "",
                        label:
                            role?.role_name ||
                            role?.name ||
                            role?.roleName ||
                            "",
                    }))
                    .filter((opt) => opt.value && opt.label);

                setDepartmentOptions(nextDeptOptions);
                setRoleOptions(nextRoleOptions);
            } catch (err) {
                console.error(err);
                setDepartmentOptions([]);
                setRoleOptions([]);
            } finally {
                setOptionsLoading(false);
            }
        };

        loadOptions();
    }, [open]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        const payload = { ...form };
        onSubmit(payload);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-xl">
                <h2 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Employee" : "Create Employee"}
                </h2>

                <div className="space-y-4">
                    <Input
                        label="Employee Code"
                        name="employee_code"
                        value={form.employee_code}
                        onChange={handleChange}
                        placeholder="e.g. EMP001"
                        required
                    />

                    <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        required
                    />

                    <Input
                        label="Date of Birth"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        type="date"
                        required
                    />

                    <Select
                        label="Department"
                        name="department_id"
                        value={form.department_id}
                        onChange={handleChange}
                        options={departmentOptions}
                        placeholder={
                            optionsLoading
                                ? "Loading departments..."
                                : "Select department"
                        }
                        disabled={optionsLoading}
                        required
                    />

                    <Select
                        label="Role"
                        name="role_id"
                        value={form.role_id}
                        onChange={handleChange}
                        options={roleOptions}
                        placeholder={
                            optionsLoading ? "Loading roles..." : "Select role"
                        }
                        disabled={optionsLoading}
                        required
                    />

                    <Input
                        label="Position"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button onClick={handleSubmit}>Save</Button>
                </div>
            </div>
        </div>
    );
}

export default EmployeeFormModal;
