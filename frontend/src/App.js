import { useState } from "react";
import axios from "axios";

const FireDetection = () => {
    const [image, setImage] = useState(null); // Lưu trữ file ảnh được chọn
    const [preview, setPreview] = useState(null); // Hiển thị ảnh tải lên
    const [result, setResult] = useState(null); // Hiển thị ảnh kết quả

    // Xử lý khi người dùng chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Tạo URL để hiển thị ảnh tải lên
        }
    };

    // Gửi ảnh lên server để xử lý
    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await axios.post(
                "http://localhost:8000/detect/", // Endpoint của server
                formData,
                {
                    responseType: "arraybuffer", // Đảm bảo nhận dữ liệu nhị phân từ server
                }
            );

            // Tạo blob từ dữ liệu trả về và hiển thị ảnh kết quả
            const blob = new Blob([response.data], { type: "image/jpeg" });
            setResult(URL.createObjectURL(blob));
        } catch (error) {
            console.error("Error detecting fire:", error);
            alert("An error occurred while detecting fire.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Fire Detection</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div style={{ margin: "20px" }}>
                {preview && (
                    <div>
                        <h3>Uploaded Image:</h3>
                        <img src={preview} alt="Uploaded" width="300" />
                    </div>
                )}
            </div>
            <button
                onClick={handleUpload}
                style={{ padding: "10px 20px", fontSize: "16px" }}
            >
                Detect Fire
            </button>
            <div style={{ margin: "20px" }}>
                {result && (
                    <div>
                        <h3>Detection Result:</h3>
                        <img src={result} alt="Detection Result" width="400" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FireDetection;
