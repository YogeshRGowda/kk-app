from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_admin: bool
    created_at: datetime
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TestBlockBase(BaseModel):
    name: str
    status: str
    score: int
    failures: Optional[str] = None

class TestBlockCreate(TestBlockBase):
    pass

class TestBlockOut(TestBlockBase):
    id: int
    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    name: str
    env: str
    quality_score: int = 0
    coverage_score: int = 0
    execution_score: int = 0
    success_score: int = 0
    description: Optional[str] = None

class ProductCreate(ProductBase):
    test_blocks: Optional[List[TestBlockCreate]] = []

class ProductOut(ProductBase):
    id: int
    test_blocks: List[TestBlockOut] = []
    class Config:
        orm_mode = True

class NotificationBase(BaseModel):
    type: str
    message: str

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class UserProfileOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    designation: Optional[str] = None
    photo_url: Optional[str] = None
    class Config:
        orm_mode = True

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    designation: Optional[str] = None 