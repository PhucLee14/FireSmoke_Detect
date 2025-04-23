from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.detectRoutes import router as fire_detection_router
from app.routes.authRoutes import router as auth_router
from app.routes.userRoutes import router as user_router
from app.db.connectToMongoDB import connect_to_mongo
from contextlib import asynccontextmanager
# Khởi tạo ứng dụng với Lifespan

app = FastAPI()

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký router
app.include_router(fire_detection_router)
app.include_router(auth_router)
app.include_router(user_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)