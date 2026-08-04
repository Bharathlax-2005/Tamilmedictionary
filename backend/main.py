from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from .database import connect_db, close_db
from .config import settings
from .routers import auth, dictionary, pages, blog, services, stats, contact, shop, admin, team, collections, clients
from .excel_service import excel_dictionary


BASE_DIR = Path(__file__).resolve().parents[0]
UPLOADS_DIR = BASE_DIR / settings.UPLOADS_DIR
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    try:
        excel_dictionary.load_if_needed()
    except Exception as e:
        print(f"Warning: Could not pre-load XLSX dictionary on startup: {e}")
    yield
    await close_db()



app = FastAPI(
    title="TamilMeDictionary API",
    description="Backend API for the TamilMeDictionary portal",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth)
app.include_router(dictionary)
app.include_router(pages)
app.include_router(blog)
app.include_router(services)
app.include_router(stats)
app.include_router(contact)
app.include_router(shop)
app.include_router(admin)
app.include_router(team)
app.include_router(collections)
app.include_router(clients)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "TamilMeDictionary API"}
