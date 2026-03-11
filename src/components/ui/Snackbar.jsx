import { useEffect } from "react";

function Snackbar({ open, message, onClose, duration = 3000 }) {
    useEffect(() => {
        if (!open) return;
        const id = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => clearTimeout(id);
    }, [open, duration, onClose]);

    if (!open) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-[90vw]">
                <span className="text-sm leading-5 break-words">{message}</span>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-white/80 hover:text-white text-sm"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default Snackbar;
