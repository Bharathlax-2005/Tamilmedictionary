from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    uri = settings.MONGODB_URI or "mongodb://localhost:27017"
    db_name = settings.MONGODB_DB_NAME or "tamilmedictionary"
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    # Create indexes
    await db.terms.create_index([("en_term", "text"), ("ta_term", "text"), ("tags", "text")])
    await db.terms.create_index("en_term")
    await db.blogs.create_index("slug", unique=True)
    await db.pages.create_index("slug", unique=True)
    await db.users.create_index("username", unique=True)
    print(f"✅ Connected to MongoDB: {db_name}")


async def close_db():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


def get_db():
    return db
