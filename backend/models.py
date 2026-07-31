from datetime import datetime, timezone
from typing import Optional, List, Any
from pydantic import BaseModel, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, field=None):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.no_info_plain_validator_function(
            cls.validate,
            serialization=core_schema.to_string_ser_schema(),
        )


def now_utc():
    return datetime.now(timezone.utc)


# ─── User ───────────────────────────────────────────────────────────────────

class AdminUser(BaseModel):
    username: str
    email: str
    hashed_password: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=now_utc)


class AdminUserOut(BaseModel):
    id: str
    username: str
    email: str
    role: str


# ─── Medical Term ────────────────────────────────────────────────────────────

class MedicalTerm(BaseModel):
    en_term: str
    ta_term: str
    category: str = "General"
    definition: Optional[str] = None
    ta_definition: Optional[str] = None
    tags: List[str] = []
    is_featured: bool = False
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class MedicalTermCreate(BaseModel):
    en_term: str
    ta_term: str
    category: str = "General"
    definition: Optional[str] = None
    ta_definition: Optional[str] = None
    tags: List[str] = []
    is_featured: bool = False


class MedicalTermUpdate(BaseModel):
    en_term: Optional[str] = None
    ta_term: Optional[str] = None
    category: Optional[str] = None
    definition: Optional[str] = None
    ta_definition: Optional[str] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None


# ─── Page Content (CMS) ─────────────────────────────────────────────────────

class PageContent(BaseModel):
    slug: str
    content: Any
    updated_at: datetime = Field(default_factory=now_utc)


class PageContentUpdate(BaseModel):
    content: Any

class DocumentMetadata(BaseModel):
    id: str
    title: str
    description: str
    category: str
    original_filename: str
    stored_filename: str
    file_type: str
    file_size: int
    upload_date: datetime
    updated_at: datetime
    download_url: str
    file_url: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True

# ─── Blog ────────────────────────────────────────────────────────────────────

class BlogPost(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    author: str = "TamilMeDictionary Team"
    cover_image: Optional[str] = None
    tags: List[str] = []
    is_published: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    author: str = "TamilMeDictionary Team"
    cover_image: Optional[str] = None
    tags: List[str] = []
    is_published: bool = False


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None


# ─── Service ─────────────────────────────────────────────────────────────────

class Service(BaseModel):
    title: str
    description: str
    icon: str = "🔬"
    order: int = 0
    created_at: datetime = Field(default_factory=now_utc)


class ServiceCreate(BaseModel):
    title: str
    description: str
    icon: str = "🔬"
    order: int = 0


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None


# ─── Stat ────────────────────────────────────────────────────────────────────

class Stat(BaseModel):
    label: str
    value: str
    icon: str = "📊"
    order: int = 0


class StatCreate(BaseModel):
    label: str
    value: str
    icon: str = "📊"
    order: int = 0


class StatUpdate(BaseModel):
    label: Optional[str] = None
    value: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None


# ─── Contact ─────────────────────────────────────────────────────────────────

class ContactSubmission(BaseModel):
    first_name: str
    last_name: str
    email: str
    company: Optional[str] = None
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=now_utc)


class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    company: Optional[str] = None
    message: str


# ─── Product (Shop) ──────────────────────────────────────────────────────────

class Product(BaseModel):
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    image_url: Optional[str] = None
    category: str = "Books"
    is_available: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=now_utc)


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    image_url: Optional[str] = None
    category: str = "Books"
    is_available: bool = True
    order: int = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_available: Optional[bool] = None
    order: Optional[int] = None


# ─── Team Member ────────────────────────────────────────────────────────────

class TeamMember(BaseModel):
    name: str
    role: str
    image: Optional[str] = None
    facebook: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class TeamMemberCreate(BaseModel):
    name: str
    role: str
    image: Optional[str] = None
    facebook: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    order: int = 0


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    image: Optional[str] = None
    facebook: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    order: Optional[int] = None


# ─── User Authentication & Registration ─────────────────────────────────────

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str


class UserLoginRequest(BaseModel):
    email: str
    password: str
    is_admin: bool = False

