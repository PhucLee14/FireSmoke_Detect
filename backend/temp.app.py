from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
import io
import cv2
import numpy as np
import tempfile
import shutil
from detect import run_detection  
from detect import run_video_detection  

app = FastAPI()

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cho phép frontend truy cập
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức (GET, POST, v.v.)
    allow_headers=["*"],  # Cho phép tất cả các header
)

@app.post("/detect/video/")
async def detect_fire_video(file: UploadFile = File(...)):
    # Tạo một file tạm để lưu video
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        shutil.copyfileobj(file.file, temp_video)
        temp_video_path = temp_video.name  # Lưu đường dẫn video tạm thời

    # Chạy nhận diện trên video
    processed_video_path = run_video_detection(temp_video_path)

    # Trả về video đã xử lý
    return StreamingResponse(open(processed_video_path, "rb"), media_type="video/mp4")

@app.post("/detect/")
async def detect_fire(file: UploadFile = File(...)):
    # Đọc file ảnh từ request
    image = Image.open(file.file)

    # Chạy nhận diện
    processed_image = run_detection(image)

    # Log thông tin
    print("Image processed successfully!")

    # Trả về hình ảnh đã xử lý
    return StreamingResponse(io.BytesIO(processed_image), media_type="image/jpeg")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)