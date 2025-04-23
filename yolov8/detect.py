import cv2
from ultralytics import YOLO
import subprocess
import tempfile
import os
from datetime import datetime
from app.models.detectionModel import DetectionRecord, BoundingBox
from firebase_config import upload_to_firebase, send_push_notification
from app.utils.db_utils import save_detection_record_sync
import asyncio
from uuid import uuid4

# Tải mô hình YOLOv8
model = YOLO("best.pt")


def convert_to_h264(input_file, output_file):
    try:
        command = [
            "ffmpeg", "-y", "-i", input_file,
            "-c:v", "libx264", "-preset", "fast",
            "-c:a", "aac", "-strict", "experimental",
            output_file
        ]
        subprocess.run(command, check=True)
        print(f"📌 Video đã được chuyển sang H.264: {output_file}")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Lỗi khi chuyển đổi video sang H.264: {e}")


def detect_image(image_path):
    results = model(image_path)
    processed_image = results[0].plot()
    processed_image_bgr = cv2.cvtColor(processed_image, cv2.COLOR_RGB2BGR)
    return processed_image_bgr


def detect_video(video_path, output_path="output.mp4"):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Không thể mở video.")
        return

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".avi")
    fourcc = cv2.VideoWriter_fourcc(*"XVID")
    out = cv2.VideoWriter(temp_output.name, fourcc, fps, (width, height))

    for result in model.predict(source=video_path, stream=True):
        frame = result.orig_img
        annotated_frame = result.plot()
        out.write(annotated_frame)

    cap.release()
    out.release()
    print(f"📌 Video tạm thời đã được lưu tại: {temp_output.name}")

    final_output = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4").name
    convert_to_h264(temp_output.name, final_output)
    return final_output


def detect_webcam(frame_skip=1, user_id=None):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Không thể mở webcam.")
        return

    print("Webcam đã được mở. Nhấn 'q' để thoát.")
    frame_count = 0
    os.makedirs("temp_frames", exist_ok=True)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Không thể đọc khung hình từ webcam.")
            break

        if frame_count % frame_skip == 0:
            results = model.predict(source=frame)
            annotated_frame = results[0].plot()

            # Lưu ảnh tạm
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            local_path = f"temp_frames/frame_{timestamp}.jpg"
            cv2.imwrite(local_path, annotated_frame)

            # Upload lên Firebase
            remote_path = f"detected/{uuid4()}.jpg"
            image_url = upload_to_firebase(local_path, remote_path)

            # Lấy bbox từ kết quả
            detections = []
            for box in results[0].boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                cls_id = int(box.cls[0].item())
                class_name = model.names[cls_id]

                detections.append(BoundingBox(
                    class_name=class_name,
                    confidence=conf,
                    bbox=[int(x1), int(y1), int(x2), int(y2)]
                ))

            if detections:
                record = DetectionRecord(
                    source="Camera",
                    image_url=image_url,
                    detections=detections,
                    user_id=user_id
                )
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                save_detection_record_sync(record)
                loop.close()
                token = "dUT9_PAZSZqcEHLM-EcDzy:APA91bH-aX0XusUWtG8y-10K9ExMK5dPdwYX8comGebnqHPtlMjVpFXw9PzE8YPsD1oTOI7k2umlE_oGJNk7rvHbXc9Q5EgAgJLODzU9gLinocSev_tvyxU"

                send_push_notification(
                    token,
                    title="🚨 Cảnh báo cháy!",
                    body="Có cháy tại nhà bạn!"
                )

            cv2.imshow("Webcam Detection", annotated_frame)

        frame_count += 1
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Đã thoát khỏi chế độ webcam.")
            break

    cap.release()
    cv2.destroyAllWindows()
