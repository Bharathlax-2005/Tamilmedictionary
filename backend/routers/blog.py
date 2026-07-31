from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from bson import ObjectId
from datetime import datetime, timezone
from ..database import get_db
from ..models import BlogPostCreate, BlogPostUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/blog", tags=["Blog"])


def serialize_blog(doc) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@router.get("/posts")
async def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    tag: Optional[str] = None,
    published_only: bool = True,
):
    db = get_db()
    skip = (page - 1) * limit
    query = {}
    if published_only:
        query["is_published"] = True
    if tag:
        query["tags"] = tag
    total = await db.blogs.count_documents(query)
    cursor = db.blogs.find(query).skip(skip).limit(limit).sort("published_at", -1)
    posts = [serialize_blog(doc) async for doc in cursor]
    return {"posts": posts, "total": total, "page": page, "pages": (total + limit - 1) // limit}


@router.get("/posts/{slug}")
async def get_post(slug: str):
    db = get_db()
    doc = await db.blogs.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return serialize_blog(doc)


@router.post("/posts", status_code=201)
async def create_post(post: BlogPostCreate, _=Depends(get_current_admin)):
    db = get_db()
    existing = await db.blogs.find_one({"slug": post.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    doc = post.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    if doc["is_published"] and not doc.get("published_at"):
        doc["published_at"] = datetime.now(timezone.utc)
    result = await db.blogs.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.put("/posts/{post_id}")
async def update_post(post_id: str, post: BlogPostUpdate, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    update_data = {k: v for k, v in post.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    if update_data.get("is_published"):
        update_data.setdefault("published_at", datetime.now(timezone.utc))
    await db.blogs.update_one({"_id": ObjectId(post_id)}, {"$set": update_data})
    doc = await db.blogs.find_one({"_id": ObjectId(post_id)})
    return serialize_blog(doc)


@router.delete("/posts/{post_id}", status_code=204)
async def delete_post(post_id: str, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.blogs.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
