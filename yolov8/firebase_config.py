import firebase_admin
from firebase_admin import credentials, storage, messaging

# Khởi tạo Firebase App (chỉ chạy 1 lần duy nhất trong chương trình)
cred = credentials.Certificate("firebase_key.json") 
web = firebase_admin.initialize_app(cred, {
    'storageBucket': 'btl-finalterm.appspot.com'
}, name='web')

cred_notice = credentials.Certificate("firebase_notice.json")

notice = firebase_admin.initialize_app(cred_notice, name='notice')

bucket_web = storage.bucket(app = web)
# bucket_notice = storage.bucket(app = notice)

def upload_to_firebase(local_path, remote_path):
    blob = bucket_web.blob(remote_path)
    blob.upload_from_filename(local_path)
    blob.make_public()
    return blob.public_url

def send_push_notification(token, title, body):
    # Tạo message
    message = messaging.Message(
        token=token,
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        android=messaging.AndroidConfig(
            notification=messaging.AndroidNotification(
                sound="default",
            )
        ),
        apns=messaging.APNSConfig(
            payload=messaging.APNSPayload(
                aps=messaging.Aps(
                    sound="default",
                )
            )
        ),
    )
#truyen o dau
    # duma bu' liem xon xot
    try:
        response = messaging.send(message, app=notice)
        print("✅ Đã gửi thành công:", response)
    except Exception as e:
        print("❌ Gửi thất bại:", e)