from fastapi import APIRouter, HTTPException, Depends
from ..database import get_db
from ..models import PageContentUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/pages", tags=["Pages"])


@router.get("/{slug}")
async def get_page(slug: str):
    db = get_db()
    doc = await db.pages.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail=f"Page '{slug}' not found")
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@router.get("/")
async def list_pages(_=Depends(get_current_admin)):
    db = get_db()
    pages = []
    async for doc in db.pages.find():
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        pages.append(doc)
    return {"pages": pages}


@router.put("/{slug}")
async def update_page(slug: str, body: PageContentUpdate, _=Depends(get_current_admin)):
    from datetime import datetime, timezone
    db = get_db()
    result = await db.pages.update_one(
        {"slug": slug},
        {"$set": {"content": body.content, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    doc = await db.pages.find_one({"slug": slug})
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc
