from datetime import datetime, timedelta
from jose import jwt
from fastapi.responses import JSONResponse

SECRET_KEY = "5cTVA/L+hFrglonQyZiaKx31Llr0PNdDD/Z18MxS9w0=" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

# Generate JWT token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Set token as an HTTP-only cookie
def set_cookie(response: JSONResponse, token: str):
    response.set_cookie(
        key="jwt",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,  # 30 days in seconds
        samesite="strict",
        secure=True,  # Set to True in production
    )