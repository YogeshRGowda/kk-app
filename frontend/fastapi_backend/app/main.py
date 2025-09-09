from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, database, schemas
import os, shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files for profile photos
PHOTO_DIR = os.path.join(os.path.dirname(__file__), '..', 'static', 'photos')
os.makedirs(PHOTO_DIR, exist_ok=True)
app.mount("/static/photos", StaticFiles(directory=PHOTO_DIR), name="photos")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock current user (replace with real auth in production)
async def get_current_user(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).limit(1))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/profile", response_model=schemas.UserProfileOut)
async def get_profile(user: models.User = Depends(get_current_user)):
    return user

@app.put("/api/profile", response_model=schemas.UserProfileOut)
async def update_profile(update: schemas.UserProfileUpdate, db: AsyncSession = Depends(get_db), user: models.User = Depends(get_current_user)):
    for field, value in update.dict(exclude_unset=True).items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user

@app.post("/api/profile/photo", response_model=schemas.UserProfileOut)
async def upload_photo(file: UploadFile = File(...), db: AsyncSession = Depends(get_db), user: models.User = Depends(get_current_user)):
    ext = os.path.splitext(file.filename)[1]
    filename = f"user_{user.id}{ext}"
    file_path = os.path.join(PHOTO_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    user.photo_url = f"/static/photos/{filename}"
    await db.commit()
    await db.refresh(user)
    return user

@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"} 