from motor.motor_asyncio import AsyncIOMotorClient
import certifi

# MongoDB URI
uri = "mongodb+srv://lhphucth14:ROKapVZRriM06aJx@cluster0.lxjrdat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Kết nối đến MongoDB
client = AsyncIOMotorClient(uri, tlsCAFile=certifi.where())

# Chọn database và collection
db = client["test"] 
users_collection = db["users"]  
detections_collection = db["detections"]
