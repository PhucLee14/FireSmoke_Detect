from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

class BoundingBox(BaseModel):
    class_name: str  # hoặc int nếu bạn lưu bằng class_id
    confidence: float
    bbox: List[int]  # [x1, y1, x2, y2]

class DetectionRecord(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    source: str = "webcam"
    image_url: str
    detections: List[BoundingBox]
    user_id: Optional[str] = None
