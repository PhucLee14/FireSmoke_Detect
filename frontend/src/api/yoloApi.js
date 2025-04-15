import axios from "axios";

const API_URL = "http://localhost:3000/api/yolov8";

export const detectObjects = async (type, file = null) => {
    const formData = new FormData();
    if (file) {
        formData.append("file", file);
    }

    const response = await axios.post(`${API_URL}/${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};
