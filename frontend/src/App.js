import { useState } from "react";
import axios from "axios";

const FireDetection = () => {
    const [file, setFile] = useState(null); // Lưu trữ file được chọn (ảnh hoặc video)
    const [preview, setPreview] = useState(null); // Hiển thị file tải lên
    const [result, setResult] = useState(null); // Hiển thị kết quả (ảnh hoặc video)
    const [fileType, setFileType] = useState(null); // Lưu trữ loại file (image/video)
    const [webcamActive, setWebcamActive] = useState(false); // Trạng thái webcam

    // Xử lý khi người dùng chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file)); // Tạo URL để hiển thị file tải lên

            // Xác định loại file (image hoặc video)
            if (file.type.startsWith("image/")) {
                setFileType("image");
            } else if (file.type.startsWith("video/")) {
                setFileType("video");
            } else {
                alert("Please upload an image or video file.");
                setFile(null);
                setPreview(null);
                setFileType(null);
            }
        }
    };

    // Gửi file lên server để xử lý
    const handleUpload = async () => {
        if (!file) {
            alert("Please select an image or video first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const endpoint =
                fileType === "image"
                    ? "http://localhost:8000/detect/" // Endpoint xử lý ảnh
                    : "http://localhost:8000/detect/video/"; // Endpoint xử lý video

            const response = await axios.post(endpoint, formData, {
                responseType: fileType === "image" ? "arraybuffer" : "blob", // Nhận dữ liệu nhị phân
            });

            // Tạo blob từ dữ liệu trả về và hiển thị kết quả
            const blob = new Blob([response.data], {
                type: fileType === "image" ? "image/jpeg" : "video/mp4",
            });
            setResult(URL.createObjectURL(blob));
        } catch (error) {
            console.error(`Error detecting fire in ${fileType}:`, error);
            alert(`An error occurred while processing the ${fileType}.`);
        }
    };

    // Bật webcam và phát hiện từ camera
    const handleWebcamDetection = async () => {
        try {
            setWebcamActive(true); // Kích hoạt trạng thái webcam
            const response = await axios.get(
                "http://localhost:8000/detect/webcam/"
            );
            alert(response.data.message); // Hiển thị thông báo từ server
        } catch (error) {
            console.error("Error starting webcam detection:", error);
            alert("An error occurred while starting webcam detection.");
        }
    };

    const handleStopWebcamDetection = () => {
        setWebcamActive(false); // Tắt trạng thái webcam
        alert("Webcam detection stopped.");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Fire Detection</h1>

            {/* Upload file */}
            <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
            />
            <div style={{ margin: "20px" }}>
                {preview && (
                    <div>
                        <h3>Uploaded File:</h3>
                        {fileType === "image" ? (
                            <img src={preview} alt="Uploaded" width="300" />
                        ) : (
                            <video src={preview} width="400" controls />
                        )}
                    </div>
                )}
            </div>
            <button
                onClick={handleUpload}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    marginRight: "10px",
                }}
            >
                Detect Fire (File)
            </button>

            {/* Webcam detection */}
            <button
                onClick={handleWebcamDetection}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    marginRight: "10px",
                }}
            >
                Detect Fire (Webcam)
            </button>
            {webcamActive && (
                <button
                    onClick={handleStopWebcamDetection}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "red",
                        color: "white",
                    }}
                >
                    Stop Webcam Detection
                </button>
            )}

            {/* Hiển thị kết quả */}
            <div style={{ margin: "20px" }}>
                {result && (
                    <div>
                        <h3>Detection Result:</h3>
                        {fileType === "image" ? (
                            <img
                                src={result}
                                alt="Detection Result"
                                width="400"
                            />
                        ) : (
                            <video src={result} width="400" controls />
                        )}
                    </div>
                )}
            </div>

            {/* Webcam status */}
            {webcamActive && (
                <div style={{ marginTop: "20px", color: "green" }}>
                    <h3>
                        Webcam detection is active. Check the server window for
                        results.
                    </h3>
                </div>
            )}
        </div>
    );
};

export default FireDetection;
