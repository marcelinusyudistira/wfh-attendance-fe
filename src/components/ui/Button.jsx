function Button({
    children,
    variant = "primary",
    className = "",
    unstyled = false,
    ...props
}) {
    const base = unstyled
        ? ""
        : "px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 hover:bg-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600",
        success: "bg-green-600 text-white hover:bg-green-700",
        muted: "bg-gray-500 text-white hover:bg-gray-600",
    };

    const variantClass = unstyled ? "" : variants[variant] || variants.primary;

    return (
        <button className={`${base} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
}

export default Button;
