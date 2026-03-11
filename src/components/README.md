# Component Usage Guide

## Table Component

### Basic Usage

```jsx
import Table from "./components/composite/Table";

const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    {
        key: "status",
        title: "Status",
        render: (row) => (
            <span
                className={
                    row.status === "active" ? "text-green-600" : "text-red-600"
                }
            >
                {row.status}
            </span>
        ),
    },
];

const data = [
    { id: 1, name: "John", status: "active" },
    { id: 2, name: "Jane", status: "inactive" },
];

<Table columns={columns} data={data} />;
```

### With Pagination

```jsx
<Table columns={columns} data={data} pagination={true} pageSize={10} />
```

### With Loading State

```jsx
<Table columns={columns} data={data} loading={isLoading} />
```

### Controlled Pagination (Server-side)

```jsx
<Table
    columns={columns}
    data={data}
    pagination={true}
    pageSize={10}
    totalItems={totalCount}
    onPageChange={(page, pageSize) => {
        fetchData(page, pageSize);
    }}
/>
```

---

## FilterBar Component

### Basic Usage

```jsx
import FilterBar from "./components/composite/FilterBar";

<FilterBar
    searchPlaceholder="Search employees..."
    onSearch={(value) => setSearchTerm(value)}
/>;
```

### With Filters

```jsx
<FilterBar
    searchPlaceholder="Search employees..."
    onSearch={handleSearch}
    filters={[
        {
            type: "select",
            name: "status",
            label: "Status",
            options: [
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
            ],
        },
        {
            type: "select",
            name: "department",
            label: "Department",
            options: [
                { value: "engineering", label: "Engineering" },
                { value: "hr", label: "Human Resources" },
            ],
        },
        {
            type: "input",
            name: "dateFrom",
            label: "From Date",
            inputType: "date",
        },
    ]}
    onFilterChange={(filterValues) => {
        console.log(filterValues); // { status: "active", department: "engineering" }
    }}
    onClear={() => {
        // Reset your state
    }}
/>
```

---

## Select Component

```jsx
import Select from "./components/ui/Select";

<Select
    label="Department"
    options={[
        { value: "eng", label: "Engineering" },
        { value: "hr", label: "Human Resources" },
    ]}
    value={selectedDept}
    onChange={(e) => setSelectedDept(e.target.value)}
    placeholder="Select department"
    required
/>;
```

---

## Button Component

```jsx
import Button from "./components/ui/Button";

// Primary (default)
<Button onClick={handleSubmit}>Submit</Button>

// Secondary
<Button variant="secondary" onClick={handleCancel}>Cancel</Button>

// Danger
<Button variant="danger" onClick={handleDelete}>Delete</Button>

// With custom className
<Button className="w-full" onClick={handleSubmit}>Full Width Button</Button>
```

---

## Input Component

```jsx
import Input from "./components/ui/Input";

<Input
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email"
    error={emailError}
/>;
```

---

## Complete Example: Filtered Table with Pagination

```jsx
import { useState, useEffect } from "react";
import Table from "./components/composite/Table";
import FilterBar from "./components/composite/FilterBar";

function EmployeePage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        // fetch data
        setLoading(false);
    };

    const handleSearch = (searchTerm) => {
        const filtered = data.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredData(filtered);
    };

    const handleFilterChange = (filters) => {
        let filtered = [...data];

        if (filters.status) {
            filtered = filtered.filter(
                (item) => item.status === filters.status,
            );
        }

        if (filters.department) {
            filtered = filtered.filter(
                (item) => item.department === filters.department,
            );
        }

        setFilteredData(filtered);
    };

    const columns = [
        { key: "name", title: "Name" },
        { key: "email", title: "Email" },
        { key: "department", title: "Department" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Employees</h1>

            <FilterBar
                searchPlaceholder="Search employees..."
                onSearch={handleSearch}
                filters={[
                    {
                        type: "select",
                        name: "status",
                        label: "Status",
                        options: [
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                        ],
                    },
                ]}
                onFilterChange={handleFilterChange}
                onClear={() => setFilteredData(data)}
            />

            <div className="bg-white rounded-lg shadow-md p-6">
                <Table
                    columns={columns}
                    data={filteredData}
                    loading={loading}
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </div>
    );
}
```

---

## Best Practices

### Filter Placement

1. **Above the table** - Most common and intuitive
2. **Sticky at top** - For long tables with scrolling
3. **As a sidebar** - For complex multi-step filters
4. **In a modal** - For advanced/optional filters

### Recommended Layout Structure

```
┌─────────────────────────────────────┐
│  Page Title                  [Action Button]
├─────────────────────────────────────┤
│  FilterBar (Search + Filters)       │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │   Table with Pagination        │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### State Management Tips

- Keep filter state in parent component
- Debounce search inputs for better performance
- Store filter state in URL params for shareable links
- Reset filters when changing pages/sections
