from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from ..database import get_db
from ..models import ProductCreate, ProductUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/shop", tags=["Shop"])


def serialize(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@router.get("/products")
async def list_products(category: str = None):
    db = get_db()
    query = {}
    if category:
        query["category"] = category
    query["is_available"] = True
    cursor = db.products.find(query).sort("order", 1)
    return {"products": [serialize(doc) async for doc in cursor]}


@router.post("/products", status_code=201)
async def create_product(product: ProductCreate, _=Depends(get_current_admin)):
    db = get_db()
    from datetime import datetime, timezone
    doc = product.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.products.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.put("/products/{product_id}")
async def update_product(product_id: str, product: ProductUpdate, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(product_id):
        raise HTTPException(400, "Invalid ID")
    update_data = {k: v for k, v in product.model_dump().items() if v is not None}
    await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
    doc = await db.products.find_one({"_id": ObjectId(product_id)})
    return serialize(doc)


@router.delete("/products/{product_id}", status_code=204)
async def delete_product(product_id: str, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(product_id):
        raise HTTPException(400, "Invalid ID")
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Product not found")
