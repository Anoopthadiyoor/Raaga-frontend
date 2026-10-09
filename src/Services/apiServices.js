import axiosInstance from "./axiosInstance";
const apiServices = async (httpMethod, url, reqBody) => {

    const reqConfig = {
        method: httpMethod,
        url: url,
        data: reqBody
    };

    return axiosInstance(reqConfig);
};

export default apiServices;