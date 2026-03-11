import api from "../api/axios";

async function normalizePhoto(photo) {
    if (!photo) return null;
    if (typeof photo === "string") return photo;
    return null;
}

function normalizeCoord(value) {
    if (value === null || value === undefined || value === "") return null;
    return String(value);
}

function appendIfPresent(formData, key, value) {
    const normalized = normalizeCoord(value);
    if (normalized) formData.append(key, normalized);
}

function isBlobLike(value) {
    return typeof Blob !== "undefined" && value instanceof Blob;
}

async function buildRequestBody({ photo, latitude, longitude }) {
    if (isBlobLike(photo)) {
        const formData = new FormData();
        const filename =
            typeof File !== "undefined" && photo instanceof File
                ? photo.name
                : "attendance.jpg";

        formData.append("photo", photo, filename);
        appendIfPresent(formData, "latitude", latitude);
        appendIfPresent(formData, "longitude", longitude);
        return formData;
    }

    const normalizedPhoto = await normalizePhoto(photo);
    return {
        ...(normalizedPhoto ? { photo: normalizedPhoto } : {}),
        ...(normalizeCoord(latitude)
            ? { latitude: normalizeCoord(latitude) }
            : {}),
        ...(normalizeCoord(longitude)
            ? { longitude: normalizeCoord(longitude) }
            : {}),
    };
}

const checkin = async ({ photo, latitude, longitude }) => {
    const body = await buildRequestBody({ photo, latitude, longitude });
    return api.post("/attendance/checkin", body);
};

const checkout = async ({ photo, latitude, longitude }) => {
    const body = await buildRequestBody({ photo, latitude, longitude });
    return api.post("/attendance/checkout", body);
};

const createAttendance = (data) => {
    if (data instanceof FormData) {
        const photo = data.get("photo");
        const latitude = data.get("latitude");
        const longitude = data.get("longitude");
        return checkin({ photo, latitude, longitude });
    }
    return checkin({
        photo: data?.photo,
        latitude: data?.latitude,
        longitude: data?.longitude,
    });
};

const getAttendanceHistory = () => api.get("/attendance");
const getAllAttendance = () => api.get("/attendance/all");

export default {
    checkin,
    checkout,
    createAttendance,
    getAttendanceHistory,
    getAllAttendance,
};
