from logging.config import fileConfig
from sqlalchemy import pool, create_engine
from alembic import context
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.database import Base, DATABASE_URL as ASYNC_DATABASE_URL
from app import models

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

target_metadata = Base.metadata

# Patch: use sync driver for Alembic
if ASYNC_DATABASE_URL.startswith("postgresql+asyncpg"):
    DATABASE_URL = ASYNC_DATABASE_URL.replace("+asyncpg", "+psycopg2")
else:
    DATABASE_URL = ASYNC_DATABASE_URL

def run_migrations_offline():
    url = DATABASE_URL
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"}
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = create_engine(DATABASE_URL, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online() 