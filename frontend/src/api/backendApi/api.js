import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.API_URL || "http://localhost:8000/",
    withCredentials: true,
});

instance.interceptors.response.use(
    function (response) {
        return response.data ? response.data : response;
    },
    function (error) {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                console.log("Unauthorized error:", data);
            } else {
                console.log("An error occurred:", data);
            }
        } else if (error.request) {
            console.log("No response received from server:", error.request);
        } else {
            console.log("Error in request:", error.message);
        }

        return {
            data: error.response ? error.response.data : null,
            status: error.response ? error.response.status : null,
            headers: error.response ? error.response.headers : null,
        };
    }
);

export default instance;
