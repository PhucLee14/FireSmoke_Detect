import cv2
from ultralytics import YOLO
import subprocess
import tempfile

# Tải mô hình YOLOv8
model = YOLO("best.pt")  # Thay "best.pt" bằng đường dẫn đến mô hình YOLOv8 của bạn

def convert_to_h264(input_file, output_file):
    """
    Chuyển đổi video sang codec H.264 bằng FFmpeg.
    """
    try:
        command = [
            "ffmpeg",
            "-y",  # Ghi đè nếu file đã tồn tại
            "-i", input_file,  # File đầu vào
            "-c:v", "libx264",  # Codec video H.264
            "-preset", "fast",  # Tốc độ xử lý
            "-c:a", "aac",  # Codec âm thanh
            "-strict", "experimental",  # Cho phép các tính năng thử nghiệm
            output_file  # File đầu ra
        ]
        subprocess.run(command, check=True)
        print(f"📌 Video đã được chuyển sang H.264: {output_file}")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Lỗi khi chuyển đổi video sang H.264: {e}")

def detect_image(image_path):
    """
    Phát hiện đối tượng trên ảnh.
    """
    results = model(image_path)  # Chạy nhận diện

    # Vẽ bounding box với màu mặc định
    processed_image = results[0].plot()  # Trả về ảnh đã được vẽ bounding box

    # Chuyển đổi từ RGB sang BGR để hiển thị đúng màu
    processed_image_bgr = cv2.cvtColor(processed_image, cv2.COLOR_RGB2BGR)
    return processed_image_bgr

def detect_video(video_path, output_path="output.mp4"):
    """
    Phát hiện đối tượng trên video và chuyển đổi sang H.264.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Không thể mở video.")
        return

    # Lấy thông tin video
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Tạo file tạm để lưu video đầu ra
    temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".avi")
    fourcc = cv2.VideoWriter_fourcc(*"XVID")
    out = cv2.VideoWriter(temp_output.name, fourcc, fps, (width, height))

    # Xử lý từng khung hình
    for result in model.predict(source=video_path, stream=True):
        frame = result.orig_img  # Lấy khung hình gốc
        annotated_frame = result.plot()  # Vẽ bounding box lên khung hình
        out.write(annotated_frame)  # Ghi khung hình đã xử lý vào video

    cap.release()
    out.release()
    print(f"📌 Video tạm thời đã được lưu tại: {temp_output.name}")

    # Chuyển đổi video sang H.264
    final_output = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4").name
    convert_to_h264(temp_output.name, final_output)

    return final_output

def detect_webcam(frame_skip=1):
    """
    Phát hiện đối tượng trực tiếp từ webcam.
    """
    cap = cv2.VideoCapture(0)  # Mở webcam (0 là ID của webcam mặc định)
    if not cap.isOpened():
        print("Không thể mở webcam.")
        return

    print("Webcam đã được mở. Nhấn 'q' để thoát.")
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Không thể đọc khung hình từ webcam.")
            break

        # Bỏ qua một số khung hình nếu cần
        if frame_count % frame_skip == 0:
            # Chạy nhận diện
            results = model.predict(source=frame)  # Chạy mô hình YOLOv8
            annotated_frame = results[0].plot()  # Vẽ bounding box lên khung hình
            cv2.imshow("Webcam Detection", annotated_frame)  # Hiển thị khung hình

        frame_count += 1

        # Nhấn 'q' để thoát
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Đã thoát khỏi chế độ webcam.")
            break

    cap.release()
    cv2.destroyAllWindows()

# Ví dụ sử dụng
if __name__ == "__main__":
    # Phát hiện trên ảnh
    detect_image("path/to/image.jpg")

    # Phát hiện trên video
    detect_video("path/to/video.mp4")

    # Phát hiện từ webcam
    detect_webcam()