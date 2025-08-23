from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "deadliner_ai"

class Database:
    client: AsyncIOMotorClient = None
    database = None

# MongoDB connection
db = Database()

async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.database = db.client[DATABASE_NAME]
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")

def get_database():
    """Get database instance"""
    return db.database

# Collections
def get_assignments_collection():
    return db.database.assignments

def get_tasks_collection():
    return db.database.tasks

def get_users_collection():
    return db.database.users

def get_timer_sessions_collection():
    return db.database.timer_sessions

def get_wallets_collection():
    return db.database.wallets