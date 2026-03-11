import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

function getDisplayValue(value) {
    if (value === null || value === undefined || value === "") return "-";

    if (typeof value === "object") {
        return (
            value.department_name ||
            value.name ||
            value.label ||
            value.title ||
            value.id ||
            "-"
        );
    }

    if (typeof value === "boolean") return value ? "Yes" : "No";

    return value;
}

function Table({
    columns,
    data = [],
    loading = false,
    pagination = false,
    pageSize: initialPageSize = 10,
    currentPage: controlledCurrentPage,
    onPageChange,
    totalItems,
    className = "",
}) {
    const [internalPage, setInternalPage] = useState(1);
    const [pageSize] = useState(initialPageSize);

    const isPageControlled = typeof controlledCurrentPage === "number";
    const currentPage = isPageControlled ? controlledCurrentPage : internalPage;

    const isControlled = onPageChange !== undefined;
    const totalPages = isControlled
        ? Math.ceil(totalItems / pageSize)
        : Math.ceil(data.length / pageSize);

    const paginatedData = isControlled
        ? data
        : data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page) => {
        if (!isPageControlled) {
            setInternalPage(page);
        }
        if (onPageChange) {
            onPageChange(page, pageSize);
        }
    };

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(
        currentPage * pageSize,
        isControlled ? totalItems : data.length,
    );
    const totalCount = isControlled ? totalItems : data.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-gray-500">Loading data...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No data available</p>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="text-left p-3 font-semibold text-gray-700"
                                >
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {(pagination ? paginatedData : data).map(
                            (row, index) => (
                                <tr
                                    key={row.id || index}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="p-3 text-gray-700"
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : getDisplayValue(
                                                      row?.[col.key],
                                                  )}
                                        </td>
                                    ))}
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {startItem} to {endItem} of {totalCount} entries
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            unstyled
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </Button>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, idx) => {
                                const page = idx + 1;
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 &&
                                        page <= currentPage + 1)
                                ) {
                                    return (
                                        <Button
                                            key={page}
                                            type="button"
                                            unstyled
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                page === currentPage
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {page}
                                        </Button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return (
                                        <span
                                            key={page}
                                            className="px-2 text-gray-400"
                                        >
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <Button
                            type="button"
                            unstyled
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Table;
