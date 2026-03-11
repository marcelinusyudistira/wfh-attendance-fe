function Input({ label, error, className = "", ...props }) {
    const isRequired = Boolean(props.required);

    return (
        <div className="w-full">
            {label && (
                <label className="text-sm text-gray-600 block mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <input
                className={`w-full border rounded-lg px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${error ? "border-red-500" : "border-gray-300"}
        ${className}`}
                {...props}
            />

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default Input;
