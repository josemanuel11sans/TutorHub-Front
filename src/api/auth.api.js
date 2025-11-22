import api from "./base.api";

export { api };

export const login = ({email, password}) => {
    return api.post("/auth/login", { email, password });
};

export const register = async (userData) => {
    return await api.post("/auth/register", userData);
}