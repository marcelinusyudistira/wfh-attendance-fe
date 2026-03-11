import api from "../api/axios";

const login = (data) => {
    return api.post("/auth/login", data);
};

const changePassword = (data) => {
    return api.put("/auth/change-password", data);
};

export default {
    login,
    changePassword,
};
