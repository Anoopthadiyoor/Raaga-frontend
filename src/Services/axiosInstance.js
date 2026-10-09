import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://raaga-server.onrender.com ",
    timeout: 30000,
});

axiosInstance.interceptors.response.use(
    (response) => {
        console.log("Response received");
        return response;
    },
    (error) => {

        if (error.response) {

            const status = error.response.status;

            if (status === 401) {
                console.log("Unauthorized access, redirect to login page");
            }
            else if (status === 404) {
                console.log("API not found");
            }
            else if (status === 500) {
                console.log("Something went wrong");
            }

        }
        else if (error.request) {
            console.log("No response from the server");
        }
        else {
            console.log("Error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;