import { Search, X } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
function FilterBar({
    searchPlaceholder = "Search...",
    onSearch,
    filters = [],
    onFilterChange,
    onClear,
}) {
    const [searchValue, setSearchValue] = useState("");
    const [filterValues, setFilterValues] = useState({});

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleFilterValueChange = (name, value) => {
        const newValues = { ...filterValues, [name]: value };
        setFilterValues(newValues);
        if (onFilterChange) {
            onFilterChange(newValues);
        }
    };

    const handleClear = () => {
        setSearchValue("");
        setFilterValues({});
        if (onClear) {
            onClear();
        }
    };

    const hasActiveFilters =
        searchValue || Object.values(filterValues).some((v) => v);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder={searchPlaceholder}
                        className="pl-10 pr-4 py-2.5 border-gray-300 focus:border-blue-500"
                    />
                </div>

                {filters.map((filter) => {
                    if (filter.type === "select") {
                        return (
                            <div key={filter.name} className="w-full lg:w-52">
                                <Select
                                    value={filterValues[filter.name] || ""}
                                    onChange={(e) =>
                                        handleFilterValueChange(
                                            filter.name,
                                            e.target.value,
                                        )
                                    }
                                    options={filter.options || []}
                                    placeholder={
                                        filter.placeholder || "Select..."
                                    }
                                    className="px-4 py-2.5"
                                    placeholderDisabled={false}
                                />
                            </div>
                        );
                    }

                    if (filter.type === "input") {
                        return (
                            <div key={filter.name} className="w-full lg:w-52">
                                <Input
                                    type={filter.inputType || "text"}
                                    value={filterValues[filter.name] || ""}
                                    onChange={(e) =>
                                        handleFilterValueChange(
                                            filter.name,
                                            e.target.value,
                                        )
                                    }
                                    placeholder={filter.placeholder}
                                    className="px-4 py-2.5 border-gray-300 focus:border-blue-500"
                                />
                            </div>
                        );
                    }

                    return null;
                })}

                {hasActiveFilters && (
                    <Button
                        variant="secondary"
                        onClick={handleClear}
                        className="flex items-center gap-2 whitespace-nowrap"
                    >
                        <X size={18} />
                        <span>Clear</span>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default FilterBar;
