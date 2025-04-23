from app.db.configurations import users_collection
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/api/user/{user_id}")
async def get_user_by_id(user_id: str):
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
            user.pop("password", None)  # Xoá password nếu có
            return JSONResponse(content={"user": user})
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")
