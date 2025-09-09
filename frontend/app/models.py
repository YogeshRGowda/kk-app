from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(80), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
    designation = Column(String(120), nullable=True)
    photo_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    env = Column(String(32), nullable=False)
    quality_score = Column(Integer, default=0)
    coverage_score = Column(Integer, default=0)
    execution_score = Column(Integer, default=0)
    success_score = Column(Integer, default=0)
    description = Column(Text)
    test_blocks = relationship('TestBlock', back_populates='product', cascade='all, delete-orphan')

class TestBlock(Base):
    __tablename__ = 'test_blocks'
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    name = Column(String(120), nullable=False)
    status = Column(String(16), nullable=False)
    score = Column(Integer, default=0)
    failures = Column(Text)  # JSON string or comma-separated
    product = relationship('Product', back_populates='test_blocks')

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(32), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 