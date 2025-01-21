import { logout, refreshToken } from "../features/auth/authSlice";
import axiosInstance from "./axiosInstance";

const setup = (store) => {
    axiosInstance.interceptors.request.use(
        config => {
            const token = JSON.parse(localStorage.getItem('token'))?.accessToken;
            if(token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    const { dispatch } = store;
    axiosInstance.interceptors.response.use(
        response => response,
        async (err) => {
            const originalConfig = err.config;
            

            if(err.response?.status === 401  && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const response = await axiosInstance.get('verify');
                    const token = response.data.accessToken;

                    if (token) {
                        // Update the token in the application state
                        dispatch(refreshToken(token));
        
                        // Update the token in the axios instance default headers
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
                        // Retry the original request with the new token
                        return axiosInstance(originalConfig);
                    } else {
                        // If no token is returned, dispatch logout
                        dispatch(logout());
                        return Promise.reject(new Error('No token returned'));
                    }

                } catch(_err) {
                    dispatch(logout());
                    Promise.reject(_err);
                }
            }

            return Promise.reject(err);
        }
    )


}

export default setup;