import api from "../api/axios";

const getDepartments = (params = {}) => {
    return api.get("/departments", {
        params,
    });
};

export default {
    getDepartments,
};
