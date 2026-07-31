import re
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from bson import ObjectId
from datetime import datetime, timezone
from ..database import get_db
from ..models import MedicalTermCreate, MedicalTermUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/dictionary", tags=["Dictionary"])


def serialize_term(doc) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@router.get("/search")

async def search_terms(
    q: str = Query("", min_length=0),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    db = get_db()
    skip = (page - 1) * limit
    q_clean = q.strip()
    
    if not q_clean:
        total = await db.terms.count_documents({})
        cursor = db.terms.find().skip(skip).limit(limit).sort("en_term", 1)
        terms = [serialize_term(doc) async for doc in cursor]
        return {
            "results": terms,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit if total > 0 else 1,
        }

    pattern = re.escape(q_clean)
    query = {
        "$or": [
            {"en_term": {"$regex": pattern, "$options": "i"}},
            {"ta_term": {"$regex": pattern, "$options": "i"}},
            {"definition": {"$regex": pattern, "$options": "i"}},
            {"ta_definition": {"$regex": pattern, "$options": "i"}},
            {"tags": {"$regex": pattern, "$options": "i"}},
            {"category": {"$regex": pattern, "$options": "i"}},
        ]
    }
    total = await db.terms.count_documents(query)
    cursor = db.terms.find(query).skip(skip).limit(limit).sort("en_term", 1)
    terms = [serialize_term(doc) async for doc in cursor]
    return {
        "results": terms,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if total > 0 else 1,
    }



@router.get("/terms")
async def list_terms(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    featured: Optional[bool] = None,
):
    db = get_db()
    skip = (page - 1) * limit
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["is_featured"] = featured
    total = await db.terms.count_documents(query)
    cursor = db.terms.find(query).skip(skip).limit(limit).sort("en_term", 1)
    terms = [serialize_term(doc) async for doc in cursor]
    return {
        "results": terms,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


@router.get("/terms/{term_id}")
async def get_term(term_id: str):
    db = get_db()
    if not ObjectId.is_valid(term_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    doc = await db.terms.find_one({"_id": ObjectId(term_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Term not found")
    return serialize_term(doc)


@router.get("/categories")
async def get_categories():
    db = get_db()
    categories = await db.terms.distinct("category")
    return {"categories": sorted(categories)}


@router.post("/terms", status_code=201)
async def create_term(
    term: MedicalTermCreate,
    _=Depends(get_current_admin),
):
    db = get_db()
    doc = term.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    result = await db.terms.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.put("/terms/{term_id}")
async def update_term(
    term_id: str,
    term: MedicalTermUpdate,
    _=Depends(get_current_admin),
):
    db = get_db()
    if not ObjectId.is_valid(term_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    update_data = {k: v for k, v in term.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await db.terms.update_one(
        {"_id": ObjectId(term_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Term not found")
    doc = await db.terms.find_one({"_id": ObjectId(term_id)})
    return serialize_term(doc)


@router.delete("/terms/{term_id}", status_code=204)
async def delete_term(term_id: str, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(term_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.terms.delete_one({"_id": ObjectId(term_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Term not found")
