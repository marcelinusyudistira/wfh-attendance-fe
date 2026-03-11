function Select({
    label,
    options = [],
    value,
    onChange,
    placeholder = "Select an option",
    placeholderDisabled,
    error,
    required = false,
    disabled = false,
    className = "",
    ...props
}) {
    const isPlaceholderDisabled =
        typeof placeholderDisabled === "boolean"
            ? placeholderDisabled
            : required;

    return (
        <div className="w-full">
            {label && (
                <label className="text-sm text-gray-600 block mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full border rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${error ? "border-red-500" : "border-gray-300"}
                    ${className}`}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled={isPlaceholderDisabled}>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default Select;
