"""
Seed script — run once to initialize the database with default content.
Usage: python -m backend.seed
"""
import asyncio
import sys
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from motor.motor_asyncio import AsyncIOMotorClient
from backend.config import settings
from backend.security import hash_password


async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    now = datetime.now(timezone.utc)

    # ── Admin User ─────────────────────────────────────────────────────────
    existing_admin = await db.users.find_one({"username": settings.ADMIN_USERNAME})
    if not existing_admin:
        await db.users.insert_one({
            "username": settings.ADMIN_USERNAME,
            "email": settings.ADMIN_EMAIL,
            "hashed_password": hash_password(settings.ADMIN_PASSWORD),
            "role": "admin",
            "created_at": now,
        })
        print(f"✅ Admin user '{settings.ADMIN_USERNAME}' created")
    else:
        print(f"ℹ️  Admin user '{settings.ADMIN_USERNAME}' already exists")

    # ── Stats ──────────────────────────────────────────────────────────────
    if await db.stats.count_documents({}) == 0:
        await db.stats.insert_many([
            {"label": "Medical Terms Translated", "value": "10K+", "icon": "📚", "order": 1},
            {"label": "Translation Accuracy & Client Satisfaction", "value": "98%", "icon": "🎯", "order": 2},
            {"label": "Medical Institutions Served", "value": "25+", "icon": "🏥", "order": 3},
            {"label": "Years of Excellence", "value": "8+", "icon": "⭐", "order": 4},
        ])
        print("✅ Stats seeded")

    # ── Services ───────────────────────────────────────────────────────────
    if await db.services.count_documents({}) == 0:
        await db.services.insert_many([
            {
                "title": "Medical Translation",
                "description": "Accurate translation of English medical terminology into Tamil with clinical precision.",
                "icon": "🔬",
                "order": 1,
                "created_at": now,
            },
            {
                "title": "Quality Assurance",
                "description": "Every translation undergoes rigorous linguistic verification and quality validation.",
                "icon": "✅",
                "order": 2,
                "created_at": now,
            },
            {
                "title": "Timely Delivery",
                "description": "Reliable and efficient translation services delivered on time, every time.",
                "icon": "⏱️",
                "order": 3,
                "created_at": now,
            },
            {
                "title": "Customized Translation",
                "description": "Specialized translations tailored for different medical disciplines and sub-specialties.",
                "icon": "🎨",
                "order": 4,
                "created_at": now,
            },
            {
                "title": "Professional Expertise",
                "description": "Our team consists of experienced medical translators and certified language experts.",
                "icon": "👨‍⚕️",
                "order": 5,
                "created_at": now,
            },
        ])
        print("✅ Services seeded")

    # ── Pages (CMS Content) ────────────────────────────────────────────────
    pages_data = [
        {
            "slug": "hero",
            "content": {
                "quote_ta": "சொல்லுக சொல்லைப் பிறிதோர்சொல் அச்சொல்லை வெல்லுஞ்சொல் இன்மை அறிந்து.",
                "quote_en": '"Utter not a word without making sure there is no better word to express it."',
                "quote_source": "--- Thiruvalluvar (திருக்குறள் 645)",
                "heading_ta": "உலகின் முதல் தமிழ் மருத்துவச் சொல்லகராதி",
                "heading_en": "The World's First Tamil Medical Dictionary",
                "subtitle": "English → Tamil Medical Glossary",
                "description": "The most comprehensive Tamil Medical Dictionary and Thesaurus designed for students, healthcare professionals, researchers, translators, and medical writers.",
                "popular_searches": ["Anatomy", "Cardiology", "Neurology", "Pharmacology", "Surgery"],
            },
            "updated_at": now,
        },
        {
            "slug": "about",
            "content": {
                "heading": "Medical Dictionary in Tamil",
                "body": "Accurate and comprehensive medical terminology translated into Tamil. Helping students, doctors, translators, researchers, and healthcare professionals communicate complex medical concepts with confidence.",
                "audiences": [
                    "Medical Writers",
                    "Medical Translators",
                    "Doctors",
                    "Medical Students",
                    "Researchers",
                    "Healthcare Professionals",
                    "Academicians",
                ],
            },
            "updated_at": now,
        },
        {
            "slug": "mission",
            "content": {
                "heading": "Our Mission",
                "body": "We are committed to preserving and expanding Tamil medical terminology by delivering accurate, reliable, and standardized medical translations. Our goal is to bridge the communication gap between English medical science and Tamil language.",
            },
            "updated_at": now,
        },
        {
            "slug": "featured-resource",
            "content": {
                "heading": "Medical Glossary Collection",
                "author": "Prof. Dr. Semmal Mustafa",
                "ta_title": "மருத்துவக் கலைச்சொல் களஞ்சியம்",
                "description": "Download the official medical glossary prepared by Prof. Dr. Semmal Mustafa.",
                "download_url": "#",
            },
            "updated_at": now,
        },
        {
            "slug": "specialized-areas",
            "content": {
                "heading": "Our Expertise",
                "areas": [
                    {
                        "title": "Pharmaceuticals",
                        "description": "Translation of pharmaceutical and drug-related terminology.",
                        "icon": "💊",
                    },
                    {
                        "title": "Research & Academia",
                        "description": "Supporting universities, research organizations, and publications.",
                        "icon": "🎓",
                    },
                    {
                        "title": "Healthcare Services",
                        "description": "Medical communication support for hospitals, clinics, and healthcare providers.",
                        "icon": "🏥",
                    },
                ],
            },
            "updated_at": now,
        },
        {
            "slug": "workflow",
            "content": {
                "heading": "Our Process",
                "steps": [
                    {
                        "step": 1,
                        "title": "Glossary Compilation",
                        "description": "Building an extensive collection of validated medical terminology.",
                    },
                    {
                        "step": 2,
                        "title": "Translation",
                        "description": "Professional translation by experienced linguistic experts.",
                    },
                    {
                        "step": 3,
                        "title": "Quality Assurance",
                        "description": "Rigorous proofreading and medical validation.",
                    },
                    {
                        "step": 4,
                        "title": "Client Support",
                        "description": "Continuous assistance and revision support whenever needed.",
                    },
                ],
            },
            "updated_at": now,
        },
    ]
    for page in pages_data:
        await db.pages.update_one({"slug": page["slug"]}, {"$setOnInsert": page}, upsert=True)
    print("✅ Pages (CMS) seeded")

    # ── Sample Medical Terms ───────────────────────────────────────────────
    if await db.terms.count_documents({}) == 0:
        sample_terms = [
            {"en_term": "Anatomy", "ta_term": "உடலமைப்பியல்", "category": "Basic Sciences", "definition": "Study of body structure", "tags": ["basic", "science"], "is_featured": True},
            {"en_term": "Cardiology", "ta_term": "இதயவியல்", "category": "Specialties", "definition": "Branch dealing with heart disorders", "tags": ["specialty", "heart"], "is_featured": True},
            {"en_term": "Neurology", "ta_term": "நரம்பியல்", "category": "Specialties", "definition": "Branch dealing with nervous system disorders", "tags": ["specialty", "neuro"], "is_featured": True},
            {"en_term": "Pharmacology", "ta_term": "மருந்தியல்", "category": "Basic Sciences", "definition": "Study of drug interactions", "tags": ["basic", "drugs"], "is_featured": True},
            {"en_term": "Surgery", "ta_term": "அறுவை சிகிச்சை", "category": "Clinical", "definition": "Medical procedure involving incision", "tags": ["clinical", "procedure"], "is_featured": True},
            {"en_term": "Hypertension", "ta_term": "உயர் இரத்த அழுத்தம்", "category": "Diseases", "definition": "High blood pressure", "tags": ["disease", "cardiovascular"], "is_featured": False},
            {"en_term": "Diabetes Mellitus", "ta_term": "நீரிழிவு நோய்", "category": "Diseases", "definition": "Chronic metabolic disorder", "tags": ["disease", "metabolic"], "is_featured": False},
            {"en_term": "Antibiotic", "ta_term": "நுண்ணுயிர் எதிர்ப்பான்", "category": "Pharmacology", "definition": "Drug that kills or inhibits bacteria", "tags": ["drug", "microbiology"], "is_featured": False},
            {"en_term": "Abdomen", "ta_term": "வயிறு", "category": "Anatomy", "definition": "Body cavity below the chest", "tags": ["anatomy", "region"], "is_featured": False},
            {"en_term": "Fracture", "ta_term": "எலும்பு முறிவு", "category": "Orthopedics", "definition": "Break in a bone", "tags": ["orthopedics", "injury"], "is_featured": False},
            {"en_term": "Infection", "ta_term": "தொற்று நோய்", "category": "Microbiology", "definition": "Invasion by pathogenic microorganisms", "tags": ["microbiology", "disease"], "is_featured": False},
            {"en_term": "Radiology", "ta_term": "கதிரியக்கவியல்", "category": "Diagnostics", "definition": "Medical imaging using radiation", "tags": ["diagnostics", "imaging"], "is_featured": False},
        ]
        for t in sample_terms:
            t["created_at"] = now
            t["updated_at"] = now
        await db.terms.insert_many(sample_terms)
        print(f"✅ {len(sample_terms)} sample medical terms seeded")

    # ── Sample Blog Posts ──────────────────────────────────────────────────
    if await db.blogs.count_documents({}) == 0:
        await db.blogs.insert_many([
            {
                "title": "Why Tamil Medical Terminology Matters",
                "slug": "why-tamil-medical-terminology-matters",
                "excerpt": "Explore the critical importance of having accurate medical terminology in Tamil for better healthcare communication.",
                "content": "Medical terminology serves as the universal language of healthcare. When this language is available in Tamil, it empowers millions of Tamil-speaking patients, students, and professionals...",
                "author": "TamilMeDictionary Team",
                "cover_image": None,
                "tags": ["terminology", "healthcare", "tamil"],
                "is_published": True,
                "published_at": now,
                "created_at": now,
                "updated_at": now,
            },
            {
                "title": "Understanding Medical Glossaries: A Guide for Translators",
                "slug": "understanding-medical-glossaries-guide-translators",
                "excerpt": "A comprehensive guide for medical translators on using standardized glossaries effectively.",
                "content": "Medical translators face unique challenges when working with specialized terminology. This guide explores best practices for using standardized glossaries...",
                "author": "TamilMeDictionary Team",
                "cover_image": None,
                "tags": ["translation", "guide", "glossary"],
                "is_published": True,
                "published_at": now,
                "created_at": now,
                "updated_at": now,
            },
        ])
        print("✅ Sample blog posts seeded")

    # ── Sample Products ────────────────────────────────────────────────────
    if await db.products.count_documents({}) == 0:
        await db.products.insert_many([
            {
                "name": "Tamil Medical Dictionary (Print Edition)",
                "description": "The comprehensive print edition of TamilMeDictionary covering 10,000+ medical terms.",
                "price": 850.00,
                "original_price": 1200.00,
                "image_url": None,
                "category": "Books",
                "is_available": True,
                "order": 1,
                "created_at": now,
            },
            {
                "name": "Medical Glossary PDF — Prof. Dr. Semmal Mustafa",
                "description": "Digital PDF of the official medical glossary by Prof. Dr. Semmal Mustafa.",
                "price": 0.00,
                "original_price": None,
                "image_url": None,
                "category": "Digital",
                "is_available": True,
                "order": 2,
                "created_at": now,
            },
        ])
        print("✅ Sample products seeded")

    # ── Team Members ───────────────────────────────────────────────────────
    if await db.team.count_documents({}) == 0:
        await db.team.insert_many([
            {
                "name": "Don Francis",
                "role": "Founder & CEO",
                "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
                "facebook": "#",
                "twitter": "#",
                "linkedin": "#",
                "order": 1,
                "created_at": now,
                "updated_at": now,
            },
            {
                "name": "Ashley Jones",
                "role": "Tech Lead",
                "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
                "facebook": "#",
                "twitter": "#",
                "linkedin": "#",
                "order": 2,
                "created_at": now,
                "updated_at": now,
            },
            {
                "name": "Tess Brown",
                "role": "Office Manager",
                "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
                "facebook": "#",
                "twitter": "#",
                "linkedin": "#",
                "order": 3,
                "created_at": now,
                "updated_at": now,
            },
            {
                "name": "Lisa Rose",
                "role": "Product Manager",
                "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                "facebook": "#",
                "twitter": "#",
                "linkedin": "#",
                "order": 4,
                "created_at": now,
                "updated_at": now,
            },
            {
                "name": "Kevin Nye",
                "role": "HR Lead",
                "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
                "facebook": "#",
                "twitter": "#",
                "linkedin": "#",
                "order": 5,
                "created_at": now,
                "updated_at": now,
            },
            {
                "name": "Alex Young",
                "role": "Customer Support Lead",
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                "facebook": "#",
                "twitter": "#",
                "linkedin": "#",
                "order": 6,
                "created_at": now,
                "updated_at": now,
            },
        ])
        print("✅ Team members seeded")


    # ── Create Indexes ─────────────────────────────────────────────────────
    await db.terms.create_index([("en_term", "text"), ("ta_term", "text"), ("tags", "text")])
    await db.terms.create_index("en_term")
    await db.blogs.create_index("slug", unique=True)
    await db.pages.create_index("slug", unique=True)
    await db.users.create_index("username", unique=True)
    print("✅ Indexes created")

    client.close()
    print("\n🎉 Database seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed())
