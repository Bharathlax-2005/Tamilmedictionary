from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from datetime import datetime, timezone
from ..database import get_db
from ..models import TeamMember, TeamMemberCreate, TeamMemberUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/team", tags=["Team Members"])


def serialize_member(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "role": doc.get("role", ""),
        "image": doc.get("image"),
        "facebook": doc.get("facebook"),
        "twitter": doc.get("twitter"),
        "linkedin": doc.get("linkedin"),
        "order": doc.get("order", 0),
        "created_at": doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else doc.get("created_at"),
        "updated_at": doc.get("updated_at").isoformat() if isinstance(doc.get("updated_at"), datetime) else doc.get("updated_at"),
    }


@router.get("", response_model=List[dict])
async def get_team_members():
    db = get_db()
    cursor = db.team.find().sort("order", 1)
    members = await cursor.to_list(length=200)
    return [serialize_member(m) for m in members]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_team_member(body: TeamMemberCreate, current_user=Depends(get_current_admin)):
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = body.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.team.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_member(doc)


@router.put("/{member_id}")
async def update_team_member(member_id: str, body: TeamMemberUpdate, current_user=Depends(get_current_admin)):
    if not ObjectId.is_valid(member_id):
        raise HTTPException(status_code=400, detail="Invalid team member ID")
    db = get_db()
    update_data = {k: v for k, v in body.model_dump(exclude_unset=True).items()}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await db.team.find_one_and_update(
        {"_id": ObjectId(member_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Team member not found")
    return serialize_member(result)


@router.delete("/{member_id}")
async def delete_team_member(member_id: str, current_user=Depends(get_current_admin)):
    if not ObjectId.is_valid(member_id):
        raise HTTPException(status_code=400, detail="Invalid team member ID")
    db = get_db()
    result = await db.team.delete_one({"_id": ObjectId(member_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"status": "success", "message": "Team member deleted"}


@router.post("/reorder")
async def reorder_team_members(order_list: List[dict], current_user=Depends(get_current_admin)):
    db = get_db()
    for item in order_list:
        if "id" in item and "order" in item and ObjectId.is_valid(item["id"]):
            await db.team.update_one(
                {"_id": ObjectId(item["id"])},
                {"$set": {"order": int(item["order"]), "updated_at": datetime.now(timezone.utc)}}
            )
    return {"status": "success", "message": "Reordered successfully"}
