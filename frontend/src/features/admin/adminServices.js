import axiosInstance from "../../api/axiosInstance";


const getObjectFromCSV = async(object) => {
    const formData = new FormData();
    formData.append("csv",object.file);
    formData.append("allowDuplicates",object.value);
    console.log(object);

    const response = await axiosInstance.post("admin/convertCsv",formData);
    
    return response.data;
}

const getVoters = async (contract) => {
    const response = await axiosInstance.post("admin/getVoters",{contract});

    return response.data;
}

const getAddressCheck = async (address) => {
    const response = await axiosInstance.post("admin/getAddress",{address});

    return response.data;
}
const getImageUpload = async(image) => {
    const formData = new FormData();
    formData.append("image",image);

    const response = await axiosInstance.post("admin/uploadImage",formData);

    return response.data;
}

const addVoters = async(voters) => {
    const response = await axiosInstance.post("admin/addvoter",voters);

    return response.data;
}

const addAddress = async (details) => {
    const response = await axiosInstance.post("admin/setContract",details);

    return response.data;
}

const sentEmail = async (details,result) => {
    const response = await axiosInstance.post("admin/sendMail",{details,isResult: result});

    return response.data;
}

export const adminServices = {
    getObjectFromCSV,
    getImageUpload,
    addVoters,
    addAddress,
    getVoters,
    sentEmail,
    getAddressCheck
};