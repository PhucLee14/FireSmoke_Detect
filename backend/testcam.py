import pathlib
pathlib.PosixPath = pathlib.WindowsPath  # Thay thế PosixPath bằng WindowsPath

import cv2
import torch
from pathlib import Path

# Tải mô hình YOLOv5
model = torch.hub.load(
    "ultralytics/yolov5", 
    "custom", 
    path="best.pt",  # Đường dẫn đến mô hình đã huấn luyện
    force_reload=True
)

def test_camera_with_model(frame_skip=2):
    """
    Kiểm tra camera với mô hình YOLOv5.
    frame_skip: Số khung hình bỏ qua giữa các lần xử lý.
    """
    cap = cv2.VideoCapture(0)  # Mở webcam (0 là webcam mặc định)
    if not cap.isOpened():
        print("Không thể mở webcam.")
        return

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Không thể đọc khung hình từ webcam.")
            break

        # Bỏ qua khung hình nếu không cần xử lý
        if frame_count % frame_skip != 0:
            frame_count += 1
            continue

        # Chuyển sang RGB để đồng bộ với mô hình
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = model(frame_rgb)  # Chạy nhận diện
        results.render()

        # Chuyển lại BGR để hiển thị
        frame_bgr = cv2.cvtColor(results.ims[0], cv2.COLOR_RGB2BGR)

        # Hiển thị khung hình đã xử lý
        cv2.imshow("Camera Detection", frame_bgr)

        # Thoát nếu nhấn phím 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        frame_count += 1

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    test_camera_with_model(frame_skip=2)