from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from typing import Optional
from datetime import datetime


# Helper class to handle MongoDB ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string")
        return schema


# User model for MongoDB
class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userName: str
    email: EmailStr
    phoneNumber: str
    fullName: str
    password: str
    createdAt: int = int(datetime.timestamp(datetime.now()))
    updatedAt: int = int(datetime.timestamp(datetime.now()))

    class Config:
        populate_by_name = True  # Updated for Pydantic v2
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}