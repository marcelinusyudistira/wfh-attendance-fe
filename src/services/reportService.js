import api from "../api/axios";

const getAttendanceReport = (params = {}) => {
    return api.get("/reports/attendance", {
        params,
    });
};

const getDashboardReport = (params = {}) => {
    return api.get("/reports/dashboard", {
        params,
    });
};

export default {
    getAttendanceReport,
    getDashboardReport,
};
