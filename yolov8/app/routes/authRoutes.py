from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from datetime import timedelta
from app.models.authModel import User as UserModel
from app.models.authSchemas import UserCreate, UserResponse, UserLogin
from app.db.configurations import users_collection
from app.utils.generateToken import create_access_token, set_cookie

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Register a new user
@router.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Kiểm tra xem email đã tồn tại chưa
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Kiểm tra xem username đã tồn tại chưa
    existing_username = await users_collection.find_one({"userName": user.userName})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Hash mật khẩu
    hashed_password = pwd_context.hash(user.password)

    # Tạo người dùng mới
    new_user = UserModel(
        userName=user.userName,
        email=user.email,
        phoneNumber=user.phoneNumber,
        fullName=user.fullName,
        password=hashed_password,  # Lưu mật khẩu đã mã hóa vào trường "password"
    )
    result = await users_collection.insert_one(new_user.dict(by_alias=True))

    # Chuyển đổi ObjectId thành chuỗi
    new_user_dict = new_user.model_dump()
    new_user_dict["_id"] = str(result.inserted_id)

    # Loại bỏ password khỏi phản hồi
    if "password" in new_user_dict:
        del new_user_dict["password"]

    # Đảm bảo tất cả các trường không JSON-serializable được chuyển đổi
    for key, value in new_user_dict.items():
        if isinstance(value, ObjectId):
            new_user_dict[key] = str(value)

    # Tạo token và đặt cookie
    token = create_access_token(data={"user_id": str(result.inserted_id)})
    response = JSONResponse(content={"message": "User registered successfully", "user": new_user_dict})
    set_cookie(response, token)

    return response


# Login user
from bson import ObjectId

@router.post("/api/auth/login")
async def login(user: UserLogin):
    # Tìm người dùng trong MongoDB
    db_user = await users_collection.find_one({"userName": user.userName})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Kiểm tra mật khẩu
    if not pwd_context.verify(user.password, db_user["password"]):  # Sửa hashed_password thành password
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Chuyển đổi ObjectId thành chuỗi
    db_user["_id"] = str(db_user["_id"])

    # Trả về thông tin người dùng
    return {"message": "Login successful", "user": db_user}


# Logout user
@router.post("/api/auth/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie("jwt")
    return response