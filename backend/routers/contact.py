import asyncio
import traceback
from email.message import EmailMessage
import smtplib
import ssl

from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from ..database import get_db
from ..models import ContactCreate
from ..security import get_current_admin
from ..config import settings

router = APIRouter(prefix="/api/contact", tags=["Contact"])


def serialize(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


def send_auto_reply_email(to_email: str, first_name: str, last_name: str):
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASS:
        print('[contact] SMTP settings not configured; skipping auto-reply email')
        return

    full_name = f"{first_name} {last_name}".strip() or "there"
    subject = "Enquiry received — TamilMeDictionary will contact you soon"
    plain_body = (
        f"Hello {full_name},\n\n"
        "Thank you for your enquiry. We have received your message and will contact you soon to understand exactly what you need and make this happen.\n"
        "If you have any additional details you want to share, just reply to this email.\n\n"
        "Thank you,\nTamilMeDictionary Team"
    )
    html_body = f"""
    <html>
      <body style="margin:0;padding:0;background-color:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <div style="max-width:620px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(15, 23, 42, 0.08);">
          <div style="background:linear-gradient(135deg,#0f766e,#2563eb);padding:24px 32px;color:#ffffff;">
            <h2 style="margin:0;font-size:24px;">TamilMeDictionary</h2>
            <p style="margin:8px 0 0;font-size:14px;opacity:0.95;">Thank you for reaching out. We have received your enquiry and will be in touch shortly.</p>
          </div>
          <div style="padding:28px 32px;">
            <p style="margin:0 0 12px;font-size:16px;">Hello {full_name},</p>
            <p style="margin:0 0 16px;line-height:1.6;font-size:15px;">
              Thank you for your enquiry. We have received your message and will contact you soon to understand exactly what you need and make this happen.
            </p>
            <div style="background:#f8fafc;border-left:4px solid #2563eb;padding:14px 16px;border-radius:6px;margin:18px 0;">
              <p style="margin:0;font-size:14px;color:#334155;">
                If you have any additional details you want to share, simply reply to this email and we will be happy to help.
              </p>
            </div>
            <p style="margin:16px 0 0;">
              <a href="http://localhost:5173/" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:bold;">Explore Now</a>
            </p>
            <p style="margin:24px 0 8px;line-height:1.6;font-size:15px;">Thank you,</p>
            <p style="margin:0;font-size:15px;font-weight:bold;color:#0f172a;">TamilMeDictionary Team</p>
            <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-size:12px;color:#64748b;">Follow us</p>
              <p style="margin:0;font-size:14px;">
                <a href="https://www.facebook.com/" style="color:#2563eb;text-decoration:none;margin-right:10px;">Facebook</a>
                <a href="https://www.instagram.com/" style="color:#2563eb;text-decoration:none;margin-right:10px;">Instagram</a>
                <a href="https://x.com/" style="color:#2563eb;text-decoration:none;margin-right:10px;">X</a>
                <a href="https://www.linkedin.com/" style="color:#2563eb;text-decoration:none;">LinkedIn</a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
    """

    message = EmailMessage()
    message["From"] = f"TamilMeDictionary <{settings.SMTP_FROM}>"
    message["Reply-To"] = settings.SMTP_FROM
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(plain_body)
    message.add_alternative(html_body, subtype="html")

    try:
        print(f"[contact] SMTP config: host={settings.SMTP_HOST} port={settings.SMTP_PORT} user={settings.SMTP_USER} from={settings.SMTP_FROM}")
        if settings.SMTP_PORT == 465:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as smtp:
                smtp.login(settings.SMTP_USER, settings.SMTP_PASS)
                smtp.send_message(message)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as smtp:
                smtp.ehlo()
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                smtp.login(settings.SMTP_USER, settings.SMTP_PASS)
                smtp.send_message(message)
        print(f"[contact] Auto-reply sent to {to_email}")
    except Exception as e:
        print(f"[contact] Failed to send auto-reply email: {e}")
        traceback.print_exc()


@router.post("/", status_code=201)
async def submit_contact(contact: ContactCreate):
    db = get_db()
    from datetime import datetime, timezone
    doc = contact.model_dump()
    doc["is_read"] = False
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.contacts.insert_one(doc)
    try:
        await asyncio.to_thread(send_auto_reply_email, contact.email, contact.first_name, contact.last_name)
    except Exception as e:
        print(f"[contact] Auto-reply exception: {e}")
        traceback.print_exc()
    return {
        "message": "Thank you! Your message has been received. We will contact you within 2 days.",
        "id": str(result.inserted_id),
    }


@router.get("/submissions")
async def list_submissions(
    page: int = 1,
    limit: int = 20,
    unread_only: bool = False,
    _=Depends(get_current_admin),
):
    db = get_db()
    query = {"is_read": False} if unread_only else {}
    skip = (page - 1) * limit
    total = await db.contacts.count_documents(query)
    cursor = db.contacts.find(query).skip(skip).limit(limit).sort("created_at", -1)
    submissions = [serialize(doc) async for doc in cursor]
    return {"submissions": submissions, "total": total, "page": page}


@router.patch("/submissions/{submission_id}/read")
async def mark_read(submission_id: str, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(submission_id):
        raise HTTPException(400, "Invalid ID")
    await db.contacts.update_one({"_id": ObjectId(submission_id)}, {"$set": {"is_read": True}})
    return {"message": "Marked as read"}


@router.delete("/submissions/{submission_id}", status_code=204)
async def delete_submission(submission_id: str, _=Depends(get_current_admin)):
    db = get_db()
    if not ObjectId.is_valid(submission_id):
        raise HTTPException(400, "Invalid ID")
    await db.contacts.delete_one({"_id": ObjectId(submission_id)})
