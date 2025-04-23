from fastapi import APIRouter, File, UploadFile, Request, HTTPException
from fastapi.responses import StreamingResponse
from threading import Thread
from detect import detect_image, detect_video, detect_webcam
from PIL import Image
from app.models.detectionModel import DetectionRecord, BoundingBox
from app.db.configurations import detections_collection, users_collection
from app.utils.generateToken import decode_jwt_token
from bson import ObjectId
from datetime import datetime
import io
import tempfile
import shutil
from typing import List

# Tạo router
router = APIRouter()

def serialize_doc(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    if "timestamp" in doc and isinstance(doc["timestamp"], datetime):
        doc["timestamp"] = doc["timestamp"].isoformat()

    # Nếu có nested detections
    for d in doc.get("detections", []):
        if isinstance(d.get("_id"), ObjectId):
            d["_id"] = str(d["_id"])
    return doc

@router.get("/detect/webcam/")
async def detect_fire_webcam(request: Request):
    """
    API để phát hiện từ webcam trực tiếp.
    """
    try:
        token = request.cookies.get("jwt")
        
        user_id = decode_jwt_token(token)

        if not user_id:
            return {"error": "Unauthorized: Missing or invalid token"}

        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {"error": "User not found"}

        # chạy detect_webcam (sync) trong thread và truyền user_id
        thread = Thread(target=detect_webcam, kwargs={"frame_skip": 2, "user_id": user_id})
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

@router.get("/detections/", response_model=List[DetectionRecord])
async def get_all_detections():
    """
    Lấy tất cả bản ghi phát hiện từ MongoDB.
    """
    docs = await detections_collection.find().to_list(length=None)
    return docs

@router.get("/detections/filter/by-username/{username}")
async def filter_by_username(username: str):
    user = await users_collection.find_one({"userName": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = str(user["_id"])
    detections = await detections_collection.find({"user_id": user_id}).to_list(None)

    # Chuyển _id từ ObjectId -> str để tránh lỗi JSON
    for det in detections:
        det["_id"] = str(det["_id"])
        for d in det.get("detections", []):
            d["_id"] = str(d["_id"]) if isinstance(d.get("_id"), ObjectId) else d.get("_id")

    return detections


@router.get("/detections/filter/by-date/{date}")
async def filter_by_date(date: str):
    try:
        start = datetime.strptime(date, "%Y-%m-%d")
        end = datetime(start.year, start.month, start.day, 23, 59, 59, 999999)

        detections = await detections_collection.find({
            "timestamp": {"$gte": start, "$lte": end}
        }).to_list(None)

        return [serialize_doc(d) for d in detections]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")


@router.get("/detections/filter/by-type/{class_name}")
async def filter_by_class_name(class_name: str):
    detections = await detections_collection.find({
        "detections.class_name": class_name
    }).to_list(None)

    for det in detections:
        det["_id"] = str(det["_id"])

    return detections