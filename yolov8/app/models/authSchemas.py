from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Schema for creating a new user
class UserCreate(BaseModel):
    userName: str
    email: EmailStr
    phoneNumber: str
    fullName: str
    password: str


# Schema for user login
class UserLogin(BaseModel):
    userName: str
    password: str


# Schema for returning user information (response)
class UserResponse(BaseModel):
    id: str
    userName: str
    email: EmailStr
    phoneNumber: str
    fullName: str
    createdAt: int
    updatedAt: int

    class Config:
        populate_by_name = True  # Updated for Pydantic v2