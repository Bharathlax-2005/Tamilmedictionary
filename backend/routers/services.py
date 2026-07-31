from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from ..database import get_db
from ..models import ServiceCreate, ServiceUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/services", tags=["Services"])


def serialize(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@router.get("/")
async def list_services():
    db = get_db()
    cursor = db.services.find().sort("order", 1)
    return {"services": [serialize(doc) async for doc in cursor]}


@router.post("/", status_code=201)
async def create_service(service: ServiceCreate, _=Depends(get_current_admin)):
    db = get_db()
    from datetime import datetime, timezone
    doc = service.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.services.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.put("/{service_id}")
async def update_service(service_id: str, service: ServiceUpdate, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(service_id):
        raise HTTPException(400, "Invalid ID")
    update_data = {k: v for k, v in service.model_dump().items() if v is not None}
    await db.services.update_one({"_id": ObjectId(service_id)}, {"$set": update_data})
    doc = await db.services.find_one({"_id": ObjectId(service_id)})
    return serialize(doc)


@router.delete("/{service_id}", status_code=204)
async def delete_service(service_id: str, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(service_id):
        raise HTTPException(400, "Invalid ID")
    result = await db.services.delete_one({"_id": ObjectId(service_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Service not found")
