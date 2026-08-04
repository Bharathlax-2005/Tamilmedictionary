import uuid
from pathlib import Path
from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from typing import List
from bson import ObjectId
from datetime import datetime, timezone
from ..database import get_db
from ..models import ClientCreate, ClientUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/clients", tags=["Clients"])

BASE_DIR = Path(__file__).resolve().parents[1]
CLIENTS_UPLOADS_DIR = BASE_DIR / "uploads" / "clients"
CLIENTS_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


def serialize_client(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "category": doc.get("category", "Healthcare Partner"),
        "location": doc.get("location"),
        "logo_text": doc.get("logo_text"),
        "logo_url": doc.get("logo_url"),
        "website": doc.get("website"),
        "order": doc.get("order", 0),
        "created_at": doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else doc.get("created_at"),
        "updated_at": doc.get("updated_at").isoformat() if isinstance(doc.get("updated_at"), datetime) else doc.get("updated_at"),
    }


@router.post("/upload-logo")
async def upload_client_logo(
    file: UploadFile = File(...),
    current_user=Depends(get_current_admin)
):
    ext = Path(file.filename).suffix.lower()
    allowed_exts = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format '{ext}'. Allowed: {', '.join(allowed_exts)}"
        )

    raw_contents = await file.read()
    unique_filename = f"client_{uuid.uuid4().hex[:12]}{ext}"
    dest_path = CLIENTS_UPLOADS_DIR / unique_filename
    dest_path.write_bytes(raw_contents)

    file_url = f"/uploads/clients/{unique_filename}"
    return {
        "url": file_url,
        "filename": unique_filename,
        "size": len(raw_contents)
    }


@router.get("", response_model=List[dict])
async def get_clients():
    db = get_db()
    cursor = db.clients.find().sort("order", 1)
    clients = await cursor.to_list(length=200)
    return [serialize_client(c) for c in clients]


@router.get("/", response_model=List[dict])
async def get_clients_slash():
    db = get_db()
    cursor = db.clients.find().sort("order", 1)
    clients = await cursor.to_list(length=200)
    return [serialize_client(c) for c in clients]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_client(body: ClientCreate, current_user=Depends(get_current_admin)):
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = body.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.clients.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_client(doc)


@router.put("/{client_id}")
async def update_client(client_id: str, body: ClientUpdate, current_user=Depends(get_current_admin)):
    if not ObjectId.is_valid(client_id):
        raise HTTPException(status_code=400, detail="Invalid client ID")
    db = get_db()
    update_data = {k: v for k, v in body.model_dump(exclude_unset=True).items()}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await db.clients.find_one_and_update(
        {"_id": ObjectId(client_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Client not found")
    return serialize_client(result)


@router.delete("/{client_id}")
async def delete_client(client_id: str, current_user=Depends(get_current_admin)):
    if not ObjectId.is_valid(client_id):
        raise HTTPException(status_code=400, detail="Invalid client ID")
    db = get_db()
    result = await db.clients.delete_one({"_id": ObjectId(client_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"status": "success", "message": "Client deleted successfully"}


@router.post("/reorder")
async def reorder_clients(order_list: List[dict], current_user=Depends(get_current_admin)):
    db = get_db()
    for item in order_list:
        if "id" in item and "order" in item and ObjectId.is_valid(item["id"]):
            await db.clients.update_one(
                {"_id": ObjectId(item["id"])},
                {"$set": {"order": int(item["order"]), "updated_at": datetime.now(timezone.utc)}}
            )
    return {"status": "success", "message": "Reordered successfully"}
