from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from ..database import get_db
from ..models import StatCreate, StatUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/stats", tags=["Stats"])


def serialize(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@router.get("/")
async def list_stats():
    db = get_db()
    cursor = db.stats.find().sort("order", 1)
    return {"stats": [serialize(doc) async for doc in cursor]}


@router.post("/", status_code=201)
async def create_stat(stat: StatCreate, _=Depends(get_current_admin)):
    db = get_db()
    doc = stat.model_dump()
    result = await db.stats.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.put("/{stat_id}")
async def update_stat(stat_id: str, stat: StatUpdate, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(stat_id):
        raise HTTPException(400, "Invalid ID")
    update_data = {k: v for k, v in stat.model_dump().items() if v is not None}
    await db.stats.update_one({"_id": ObjectId(stat_id)}, {"$set": update_data})
    doc = await db.stats.find_one({"_id": ObjectId(stat_id)})
    return serialize(doc)


@router.delete("/{stat_id}", status_code=204)
async def delete_stat(stat_id: str, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(stat_id):
        raise HTTPException(400, "Invalid ID")
    result = await db.stats.delete_one({"_id": ObjectId(stat_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Stat not found")
