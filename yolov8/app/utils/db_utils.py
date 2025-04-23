from app.models.detectionModel import DetectionRecord
from app.db.configurations import detections_collection

async def save_detection_record(record: DetectionRecord):
    await detections_collection.insert_one(record.model_dump())

def save_detection_record_sync(record: DetectionRecord):
    # Chuyển motor → pymongo sync
    # Vì Motor không chạy ổn trong thread
    import pymongo
    from pymongo import MongoClient

    # Kết nối riêng bằng pymongo
    client = MongoClient("mongodb+srv://lhphucth14:ROKapVZRriM06aJx@cluster0.lxjrdat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client["test"]
    collection = db["detections"]

    print("👉 Dữ liệu chuẩn bị lưu:", record.model_dump())

    try:
        result = collection.insert_one(record.model_dump())
        print("✅ Ghi vào MongoDB thành công với ID:", result.inserted_id)
    except Exception as e:
        print("❌ Lỗi ghi MongoDB:", e)
