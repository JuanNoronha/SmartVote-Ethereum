import axiosInstance from "../../api/axiosInstance";



const register = async (userData) => {
    const response = await axiosInstance.post('admin/register',userData);
    console.log(response.data);

    if(response.data) {
        localStorage.setItem('token',JSON.stringify(response.data));
    }

    return response.data;
}

const getUserDetails = async (type) => {
    const response = await axiosInstance.get(`${type}/getInfo`);

   return response.data;
}

const login = async (userData,type) => {
    console.log(userData);
    const response = await axiosInstance.post(`${type}/login`,userData);

    if(response.data) {
        localStorage.setItem('token',JSON.stringify(response.data));
    }

    return response.data;
}

const logout = async () => {
    const response = await axiosInstance.get(`logout`)
    localStorage.removeItem('token');
    return response.data;
}

const authServices = {
    register,
    login,
    logout,
    getUserDetails
}

export default authServices;