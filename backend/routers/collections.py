from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse
from starlette.concurrency import run_in_threadpool
from bson import ObjectId
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import quote
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from ..database import get_db
from ..models import DocumentMetadata
from ..security import get_current_admin

router = APIRouter(prefix="/api/collections", tags=["Collections"])

ALLOWED_EXTENSIONS = {
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'rtf', 'odt',
    'zip', 'rar', '7z', 'tar', 'gz',
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
    'mp3', 'mp4'
}


def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower().lstrip('.') or 'file'


def format_document(doc: dict) -> dict:
    if not doc:
        return {}
    doc_dict = dict(doc)
    doc_id = str(doc_dict.get('_id', doc_dict.get('id', '')))
    doc_dict['id'] = doc_id
    doc_dict['download_url'] = f"/api/collections/{doc_id}/download"
    doc_dict['file_url'] = f"/api/collections/{doc_id}/view"
    doc_dict.pop('_id', None)
    if 'file_id' in doc_dict and doc_dict['file_id'] is not None:
        doc_dict['file_id'] = str(doc_dict['file_id'])
    return doc_dict


@router.get("", response_model=dict)
@router.get("/", response_model=dict)
async def list_documents():
    db = get_db()
    documents = []
    async for doc in db.collections.find().sort("upload_date", -1):
        documents.append(format_document(doc))
    return {"documents": documents}


@router.get("/{doc_id}/download")
async def download_document(doc_id: str):
    db = get_db()
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    doc = await db.collections.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_id = doc.get("file_id")
    if not file_id:
        raise HTTPException(status_code=404, detail="File data not found in MongoDB")

    if isinstance(file_id, str):
        file_id = ObjectId(file_id)

    fs = AsyncIOMotorGridFSBucket(db, chunk_size_bytes=1024 * 1024)
    try:
        grid_out = await fs.open_download_stream(file_id)
    except Exception:
        raise HTTPException(status_code=404, detail="File binary not found in MongoDB GridFS")

    async def file_stream():
        while chunk := await grid_out.readchunk():
            yield chunk

    filename = doc.get("original_filename", "document")
    ascii_filename = filename.encode('ascii', 'ignore').decode('ascii').strip()
    if not ascii_filename or ascii_filename.startswith('.'):
        ext = get_file_extension(filename)
        ascii_filename = f"document.{ext}"
    encoded_filename = quote(filename)

    return StreamingResponse(
        file_stream(),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{ascii_filename}"; filename*=UTF-8\'\'{encoded_filename}'
        }
    )


@router.get("/{doc_id}/view")
async def view_document(doc_id: str):
    db = get_db()
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    doc = await db.collections.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_id = doc.get("file_id")
    if not file_id:
        raise HTTPException(status_code=404, detail="File data not found in MongoDB")

    if isinstance(file_id, str):
        file_id = ObjectId(file_id)

    fs = AsyncIOMotorGridFSBucket(db, chunk_size_bytes=1024 * 1024)
    try:
        grid_out = await fs.open_download_stream(file_id)
    except Exception:
        raise HTTPException(status_code=404, detail="File binary not found in MongoDB GridFS")

    async def file_stream():
        while chunk := await grid_out.readchunk():
            yield chunk

    filename = doc.get("original_filename", "document")
    ext = get_file_extension(filename)
    ascii_filename = filename.encode('ascii', 'ignore').decode('ascii').strip()
    if not ascii_filename or ascii_filename.startswith('.'):
        ascii_filename = f"document.{ext}"
    encoded_filename = quote(filename)

    media_types = {
        'pdf': 'application/pdf',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'txt': 'text/plain; charset=utf-8',
        'svg': 'image/svg+xml',
    }
    media_type = media_types.get(ext, "application/octet-stream")

    return StreamingResponse(
        file_stream(),
        media_type=media_type,
        headers={
            "Content-Disposition": f'inline; filename="{ascii_filename}"; filename*=UTF-8\'\'{encoded_filename}'
        }
    )



@router.get("/{doc_id}")
async def get_document(doc_id: str):
    db = get_db()
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")
    doc = await db.collections.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return format_document(doc)


@router.post("", response_model=DocumentMetadata)
@router.post("/", response_model=DocumentMetadata)
async def create_document(
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form("General"),
    file: UploadFile = File(...),
    _=Depends(get_current_admin),
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="Document file is required")

    extension = get_file_extension(file.filename)
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format (.{extension}). Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    db = get_db()
    fs = AsyncIOMotorGridFSBucket(db, chunk_size_bytes=1024 * 1024)

    try:
        grid_in = fs.open_upload_stream(
            file.filename,
            chunk_size_bytes=1024 * 1024,
            metadata={"content_type": file.content_type}
        )
        file_size = 0
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            await grid_in.write(chunk)
            file_size += len(chunk)
            
        await grid_in.close()
        file_id = grid_in._id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GridFS MongoDB upload failed: {str(e)}")

    upload_date = datetime.now(timezone.utc)
    stored_filename = f"{file_id}.{extension}"

    document = {
        "title": title,
        "description": description,
        "category": category or "General",
        "original_filename": file.filename,
        "stored_filename": stored_filename,
        "file_id": file_id,
        "file_type": extension,
        "file_size": file_size,
        "upload_date": upload_date,
        "updated_at": upload_date,
    }

    result = await db.collections.insert_one(document)
    document["_id"] = result.inserted_id
    return format_document(document)


@router.put("/{doc_id}", response_model=DocumentMetadata)
async def update_document(
    doc_id: str,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    _=Depends(get_current_admin),
):
    db = get_db()
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    existing = await db.collections.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Document not found")

    update_data = {}
    if title is not None:
        update_data["title"] = title
    if description is not None:
        update_data["description"] = description
    if category is not None:
        update_data["category"] = category

    if file is not None and file.filename:
        extension = get_file_extension(file.filename)
        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format (.{extension}). Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )

        fs = AsyncIOMotorGridFSBucket(db, chunk_size_bytes=1024 * 1024)
        try:
            grid_in = fs.open_upload_stream(
                file.filename,
                chunk_size_bytes=1024 * 1024,
                metadata={"content_type": file.content_type}
            )

            file_size = 0
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                await grid_in.write(chunk)
                file_size += len(chunk)

            await grid_in.close()
            new_file_id = grid_in._id
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"GridFS MongoDB update failed: {str(e)}")

        # Delete old file from GridFS if present
        if existing.get("file_id"):
            old_file_id = existing["file_id"]
            if isinstance(old_file_id, str):
                old_file_id = ObjectId(old_file_id)
            try:
                await fs.delete(old_file_id)
            except Exception:
                pass

        stored_filename = f"{new_file_id}.{extension}"
        update_data.update({
            "original_filename": file.filename,
            "stored_filename": stored_filename,
            "file_id": new_file_id,
            "file_type": extension,
            "file_size": file_size,
        })

    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await db.collections.update_one({"_id": oid}, {"$set": update_data})

    doc = await db.collections.find_one({"_id": oid})
    return format_document(doc)


@router.delete("/{doc_id}")
async def delete_document(doc_id: str, _=Depends(get_current_admin)):
    db = get_db()
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    doc = await db.collections.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if doc.get("file_id"):
        file_id = doc["file_id"]
        if isinstance(file_id, str):
            file_id = ObjectId(file_id)
        fs = AsyncIOMotorGridFSBucket(db)
        try:
            await fs.delete(file_id)
        except Exception:
            pass

    await db.collections.delete_one({"_id": oid})
    return JSONResponse({"success": True})
