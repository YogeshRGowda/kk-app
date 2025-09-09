import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from . import models, database, schemas
import shutil
import asyncio
from passlib.context import CryptContext
import openai
from pydantic import BaseModel
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PHOTO_DIR = os.path.join(os.path.dirname(__file__), 'static', 'photos')
os.makedirs(PHOTO_DIR, exist_ok=True)
app.mount("/static/photos", StaticFiles(directory=PHOTO_DIR), name="photos")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

openai.api_key = os.getenv("OPENAI_API_KEY")  # Set your OpenAI API key as an environment variable

class AnalyzeRequest(BaseModel):
    text: str

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Startup: Create tables and default user ---
@app.on_event("startup")
async def startup():
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    # Create default user if none exists
    async with database.SessionLocal() as session:
        result = await session.execute(select(models.User).limit(1))
        user = result.scalars().first()
        if not user:
            default_user = models.User(
                username="admin",
                email="admin@example.com",
                hashed_password=pwd_context.hash("admin123"),
                designation="Admin",
                photo_url=None
            )
            session.add(default_user)
            await session.commit()
        # Add demo products if none exist
        result = await session.execute(select(models.Product).limit(1))
        product = result.scalars().first()
        if not product:
            demo1 = models.Product(
                name="Product A",
                env="Dev",
                quality_score=75,
                coverage_score=70,
                execution_score=70,
                success_score=87,
                description="Demo product A",
            )
            session.add(demo1)
            await session.commit()
            tb1 = models.TestBlock(product_id=demo1.id, name="UI/UX", status="fail", score=60, failures="Button not clickable,Layout broken")
            tb2 = models.TestBlock(product_id=demo1.id, name="API", status="pass", score=90, failures="")
            session.add_all([tb1, tb2])
            demo2 = models.Product(
                name="Product B",
                env="Production",
                quality_score=91,
                coverage_score=80,
                execution_score=85,
                success_score=90,
                description="Demo product B",
            )
            session.add(demo2)
            await session.commit()
            tb3 = models.TestBlock(product_id=demo2.id, name="UI/UX", status="pass", score=95, failures="")
            tb4 = models.TestBlock(product_id=demo2.id, name="API", status="pass", score=92, failures="")
            session.add_all([tb3, tb4])
            await session.commit()

# --- User/Profile Endpoints ---
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

# --- Product Endpoints ---
@app.get("/api/products", response_model=list[schemas.ProductOut])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Product).options(selectinload(models.Product.test_blocks)))
    products = result.scalars().all()
    return products

@app.post("/api/products", response_model=schemas.ProductOut)
async def add_product(product: schemas.ProductCreate, db: AsyncSession = Depends(get_db)):
    db_product = models.Product(
        name=product.name,
        env=product.env,
        quality_score=product.quality_score,
        coverage_score=product.coverage_score,
        execution_score=product.execution_score,
        success_score=product.success_score,
        description=product.description,
    )
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    # Add test blocks
    for tb in product.test_blocks or []:
        db_tb = models.TestBlock(
            product_id=db_product.id,
            name=tb.name,
            status=tb.status,
            score=tb.score,
            failures=tb.failures,
        )
        db.add(db_tb)
    await db.commit()
    await db.refresh(db_product)
    return db_product

@app.get("/api/products/{product_id}", response_model=schemas.ProductOut)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Product).options(selectinload(models.Product.test_blocks)).where(models.Product.id == product_id)
    )
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/analyze")
async def analyze_report(req: AnalyzeRequest):
    prompt = (
        "You are a QA assistant. Analyze the following report text and extract all test types, their scores, and statuses. "
        "Return a JSON array like this: "
        '[{"type": "Manual Testing", "score": 80, "status": "pass"}, {"type": "API Automation Testing", "score": 60, "status": "fail"}].\n\n'
        "Report:\n"
        f"{req.text}\n\n"
        "Extracted JSON:"
    )
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # or "gpt-4" if you have access
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.0,
    )
    content = response.choices[0].message['content']
    match = re.search(r'\[.*\]', content, re.DOTALL)
    if match:
        try:
            import json
            data = json.loads(match.group(0))
            return {"test_blocks": data}
        except Exception:
            pass
    return {"test_blocks": [], "raw": content}

@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"} 