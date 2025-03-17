import axios from 'axios';
import AuthService from './services/user.service';
import eventBus from './common/eventBus';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        eventBus.dispatch("showLoading", true);
        const user = AuthService.getCurrentUser();
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(function (response) {
    eventBus.dispatch("showLoading", false);
    eventBus.dispatch("AlertSuccess", true);
    return response;
}, function (error) {
    eventBus.dispatch("showLoading", false);
    eventBus.dispatch("AlertSuccess", false);
    return Promise.reject(error);
});

export default api