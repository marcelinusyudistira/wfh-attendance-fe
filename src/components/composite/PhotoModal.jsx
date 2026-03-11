function PhotoModal({ photo, onClose, type = "checkin" }) {
    if (!photo) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
            onClick={handleBackdropClick}
        >
            <img
                src={`http://localhost:3000/uploads/attendance/${type}/${photo}`}
                alt="attendance"
                className="max-h-[80vh] rounded-lg"
            />
        </div>
    );
}

export default PhotoModal;
