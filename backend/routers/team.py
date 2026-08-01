import uuid
from pathlib import Path
from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from typing import List
from bson import ObjectId
from datetime import datetime, timezone
from ..database import get_db
from ..models import TeamMember, TeamMemberCreate, TeamMemberUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/api/team", tags=["Team Members"])

BASE_DIR = Path(__file__).resolve().parents[1]
TEAM_UPLOADS_DIR = BASE_DIR / "uploads" / "team"
TEAM_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


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


import io
from PIL import Image, ImageOps


def process_and_crop_team_photo(image_bytes: bytes, target_width=500, target_height=600) -> bytes:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        try:
            img = ImageOps.exif_transpose(img)
        except Exception:
            pass

        has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
        if has_alpha:
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        resampling = getattr(Image, 'Resampling', Image).LANCZOS
        img_fit = ImageOps.fit(
            img,
            (target_width, target_height),
            method=resampling,
            centering=(0.5, 0.3)
        )

        output = io.BytesIO()
        if has_alpha:
            img_fit.save(output, format="PNG", optimize=True)
        else:
            img_fit.save(output, format="JPEG", quality=90, optimize=True)
        return output.getvalue()
    except Exception:
        return image_bytes


@router.post("/upload-photo")
async def upload_team_photo(
    file: UploadFile = File(...),
    current_user=Depends(get_current_admin)
):
    ext = Path(file.filename).suffix.lower()
    allowed_exts = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format '{ext}'. Allowed: {', '.join(allowed_exts)}"
        )

    raw_contents = await file.read()
    
    # Process & smart crop photo if PNG/JPG/WEBP
    if ext in [".png", ".jpg", ".jpeg", ".webp"]:
        processed_contents = process_and_crop_team_photo(raw_contents)
        saved_ext = ".png" if ext == ".png" else ".jpg"
    else:
        processed_contents = raw_contents
        saved_ext = ext

    unique_filename = f"team_{uuid.uuid4().hex[:12]}{saved_ext}"
    dest_path = TEAM_UPLOADS_DIR / unique_filename
    dest_path.write_bytes(processed_contents)

    file_url = f"/uploads/team/{unique_filename}"
    return {
        "url": file_url,
        "filename": unique_filename,
        "size": len(processed_contents)
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
