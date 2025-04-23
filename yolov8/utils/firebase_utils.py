import uuid
from firebase_config import bucket  
def upload_image_to_firebase(local_path: str) -> str:
    blob_name = f"detected/{uuid.uuid4()}.jpg"
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(local_path)
    blob.make_public()
    return blob.public_url
