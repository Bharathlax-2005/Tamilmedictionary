from fastapi import APIRouter, Depends
from ..database import get_db
from ..security import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/dashboard/stats")
async def dashboard_stats(_=Depends(get_current_admin)):
    db = get_db()
    terms_count = await db.terms.count_documents({})
    blogs_count = await db.blogs.count_documents({})
    contacts_count = await db.contacts.count_documents({})
    unread_contacts = await db.contacts.count_documents({"is_read": False})
    products_count = await db.products.count_documents({})
    clients_count = await db.clients.count_documents({})
    return {
        "terms": terms_count,
        "blogs": blogs_count,
        "contacts": contacts_count,
        "unread_contacts": unread_contacts,
        "products": products_count,
        "clients": clients_count,
    }

