import React, { useRef, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import LoadingCircle from "../components/LoadingCircle";

function Home() {
    const inputRef = useRef(null);
    const [file, setFile] = useState(null); // Lưu trữ file được chọn (ảnh hoặc video)
    const [preview, setPreview] = useState(null); // Hiển thị file tải lên
    const [result, setResult] = useState(null); // Hiển thị kết quả (ảnh hoặc video)
    const [fileType, setFileType] = useState(null); // Lưu trữ loại file (image/video)
    const [webcamActive, setWebcamActive] = useState(false); // Trạng thái webcam
    const [loading, setLoading] = useState(false); // Trạng thái loading

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
            setLoading(true);
            const endpoint =
                fileType === "image"
                    ? "http://localhost:8000/detect/" // Endpoint xử lý ảnh
                    : "http://localhost:8000/detect/video/"; // Endpoint xử lý video

            const response = await axios.post(endpoint, formData, {
                responseType: "blob", // Nhận dữ liệu nhị phân
            });

            // Tạo blob từ dữ liệu trả về và hiển thị kết quả
            const blob = new Blob([response.data], {
                type: fileType === "image" ? "image/jpeg" : "video/mp4",
            });
            const resultUrl = URL.createObjectURL(blob);
            setResult(resultUrl);
            setLoading(false);
        } catch (error) {
            console.error(`Error detecting fire in ${fileType}:`, error);
            alert(`An error occurred while processing the ${fileType}.`);
        }
    };

    // Bật webcam và phát hiện từ camera
    const handleWebcamDetection = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/detect/webcam/"
            );
            alert(response.data.message); // Hiển thị thông báo từ backend
        } catch (error) {
            console.error("Error starting webcam detection:", error);
            alert("Failed to start webcam detection.");
        }
    };

    const handleStopWebcamDetection = () => {
        setWebcamActive(false); // Tắt trạng thái webcam
        alert("Webcam detection stopped.");
    };

    return (
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
            {loading ? <p></p> : null}
            <Box
                sx={{
                    width: "100%", // w-1/2
                    display: "flex", // flex
                    justifyContent: "center", // justify-center
                    alignItems: "center", // items-center
                    minHeight: "2rem", // min-h-48 (48 * 0.25rem = 12rem)
                    margin: "1rem 0", // mt-4 (4 * 0.25rem = 1rem)
                    gap: "1rem",
                }}
            >
                <Box
                    sx={{
                        display: "flex", // flex
                        justifyContent: "center", // justify-center
                        alignItems: "center", // items-center
                        borderSpacing: "8px", // border-spacing-8
                        borderColor: "rgb(148 163 184)", // border-slate-400
                        borderWidth: "2px", // border-2
                        borderRadius: "0.5rem", // rounded-2xl (2xl = 1rem)
                        backgroundColor: "#efefef", // bg-purple-50
                        padding: "0.75rem 1.5rem",
                        cursor: "pointer",
                    }}
                    onClick={(e) => {
                        inputRef.current.click();
                    }}
                    role="button"
                >
                    <input
                        type="file"
                        hidden
                        ref={inputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/gif, image/jpeg, video/mp4,video/x-m4v,video/*"
                    />
                    <span
                        style={{
                            paddingLeft: "0.25rem",
                            color: "#000",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Upload media
                    </span>
                </Box>
                <Box
                    onClick={handleWebcamDetection}
                    sx={{
                        display: "flex", // flex
                        justifyContent: "center", // justify-center
                        alignItems: "center", // items-center
                        borderSpacing: "8px", // border-spacing-8
                        borderColor: "rgb(148 163 184)", // border-slate-400
                        borderWidth: "2px", // border-2
                        borderRadius: "0.5rem", // rounded-2xl (2xl = 1rem)
                        backgroundColor: "#efefef", // bg-purple-50
                        padding: "0.75rem 1.5rem",
                        cursor: "pointer",
                    }}
                >
                    <span
                        style={{
                            paddingLeft: "0.25rem",
                            color: "#000",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Detect by Webcam
                    </span>
                </Box>
            </Box>
            <Box>
                {file && (
                    <>
                        <Box
                            width={"100%"}
                            textAlign="center"
                            display={"flex"}
                            justifyContent={"center"}
                        >
                            {fileType === "image" ? (
                                <Box
                                    borderRadius={"8px"}
                                    overflow="hidden"
                                    width="400px"
                                >
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        width="100%"
                                        height="100%"
                                    />
                                </Box>
                            ) : (
                                <video src={preview} width="400" controls />
                            )}
                        </Box>

                        <button
                            onClick={handleUpload}
                            style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                margin: "10px 0",
                            }}
                        >
                            Detect Fire (File)
                        </button>
                    </>
                )}
            </Box>
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
            <Box style={{ margin: "20px" }}>
                {result && (
                    <Box
                        display={"flex"}
                        flexDirection="column"
                        alignItems="center"
                    >
                        <h3>Detection Result:</h3>
                        {fileType === "image" ? (
                            <Box
                                borderRadius={"8px"}
                                overflow="hidden"
                                width="400px"
                            >
                                <img
                                    src={result}
                                    alt="Detection Result"
                                    width="100%"
                                    height="100%"
                                />
                            </Box>
                        ) : (
                            <Box>
                                <video src={result} width="400" controls />
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
            {/* Webcam status */}
            {webcamActive && (
                <Box sx={{ marginTop: "20px", color: "green" }}>
                    <h3>
                        Webcam detection is active. Check the server window for
                        results.
                    </h3>
                </Box>
            )}
        </Box>
    );
}

export default Home;
