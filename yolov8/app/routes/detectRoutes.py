from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse
from threading import Thread
from detect import detect_image, detect_video, detect_webcam
from PIL import Image
import io
import tempfile
import shutil

# Tạo router
router = APIRouter()

@router.get("/detect/webcam/")
async def detect_fire_webcam():
    """
    API để phát hiện từ webcam trực tiếp.
    """
    try:
        # Chạy detect_webcam trong một luồng riêng
        thread = Thread(target=detect_webcam, kwargs={"frame_skip": 2})
        thread.start()
        return {"message": "Webcam detection started. Press 'q' to quit."}
    except Exception as e:
        return {"error": str(e)}

@router.post("/detect/video/")
async def detect_fire_video(file: UploadFile = File(...)):
    # Tạo một file tạm để lưu video
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        shutil.copyfileobj(file.file, temp_video)
        temp_video_path = temp_video.name  # Lưu đường dẫn video tạm thời

    # Chạy nhận diện trên video
    processed_video_path = detect_video(temp_video_path)

    # Trả về video đã xử lý
    return StreamingResponse(open(processed_video_path, "rb"), media_type="video/mp4")

@router.post("/detect/")
async def detect_fire(file: UploadFile = File(...)):
    # Xử lý file ảnh
    image = Image.open(file.file)
    processed_image_np = detect_image(image)  # Nhận mảng NumPy từ detect_image

    # Chuyển đổi mảng NumPy thành ảnh PIL
    processed_image = Image.fromarray(processed_image_np)

    # Trả về ảnh đã xử lý
    buffer = io.BytesIO()
    processed_image.save(buffer, format="JPEG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/jpeg")