import { useState } from "react";
import axios from "axios";

const FireDetection = () => {
    const [video, setVideo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            setVideo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!video) {
            alert("Please select a video first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", video);

        try {
            const response = await axios.post(
                "http://localhost:8000/detect/video/",
                formData,
                {
                    responseType: "blob", // Nhận dữ liệu video
                }
            );

            const blob = new Blob([response.data], { type: "video/mp4" });
            setResult(URL.createObjectURL(blob));
        } catch (error) {
            console.error("Error detecting fire in video:", error);
            alert("An error occurred while processing the video.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Fire Detection (Video)</h1>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <div style={{ margin: "20px" }}>
                {preview && (
                    <div>
                        <h3>Uploaded Video:</h3>
                        <video src={preview} width="400" controls />
                    </div>
                )}
            </div>
            <button
                onClick={handleUpload}
                style={{ padding: "10px 20px", fontSize: "16px" }}
            >
                Detect Fire in Video
            </button>
            <div style={{ margin: "20px" }}>
                {result && (
                    <div>
                        <h3>Detection Result:</h3>
                        <video src={result} width="400" controls />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FireDetection;
