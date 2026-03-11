import api from "../api/axios";

const getRoles = (params = {}) => {
    return api.get("/roles", {
        params,
    });
};

export default {
    getRoles,
};
