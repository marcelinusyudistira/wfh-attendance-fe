import Input from "./Input";

function DatePicker({
    label,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = "",
    ...props
}) {
    return (
        <Input
            type="date"
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
            {...props}
        />
    );
}

export default DatePicker;
