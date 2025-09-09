from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import sys

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql+asyncpg://KK:Yogeshr@1.@localhost/KK')

Base = declarative_base()

# Only create the async engine/session if not running under Alembic
if 'alembic' not in sys.modules:
    engine = create_async_engine(DATABASE_URL, echo=True)
    SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False) 