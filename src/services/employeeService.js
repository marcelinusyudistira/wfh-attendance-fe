import api from "../api/axios";

const getEmployees = (params = {}) => {
    return api.get("/employees", {
        params,
    });
};

const createEmployee = (data) => {
    return api.post("/employees", data);
};

const updateEmployee = (data, id) => {
    return api.put(`/employees/${id}`, data);
};

const deleteEmployee = async (id) => {
    throw new Error("deleteEmployee endpoint is not integrated yet");
};

export default {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};
