const decodeBase64UrlToJsonString = (base64Url) => {
    if (!base64Url || typeof base64Url !== "string") return null;

    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);

    try {
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        if (typeof TextDecoder !== "undefined") {
            return new TextDecoder().decode(bytes);
        }
        return binary;
    } catch {
        return null;
    }
};

export const decodeJwtPayload = (token) => {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const jsonString = decodeBase64UrlToJsonString(parts[1]);
    if (!jsonString) return null;

    try {
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
};

const normalizeRole = (role) => {
    if (!role) return null;
    if (Array.isArray(role)) {
        const first = role.find(Boolean);
        return first ? String(first).toLowerCase() : null;
    }
    return String(role).toLowerCase();
};

export const userFromJwt = (token, fallback = {}) => {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    const role =
        normalizeRole(payload.role) ||
        normalizeRole(payload.roles) ||
        (payload.is_admin ? "admin" : null);

    return {
        id:
            payload.sub ||
            payload.user_id ||
            payload.userId ||
            payload.id ||
            null,
        employee_id: payload.employee_id || payload.employeeId || null,
        employee_code: payload.employee_code || payload.employeeCode || null,
        email: payload.email || fallback.email || null,
        name:
            payload.name ||
            payload.full_name ||
            payload.fullName ||
            payload.username ||
            fallback.name ||
            fallback.email ||
            null,
        role: role || fallback.role || "employee",
    };
};
