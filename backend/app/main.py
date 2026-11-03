import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .routers import aging
from .seed_aging_data import seed_database

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ระบบสารสนเทศและแดชบอร์ดเฝ้าระวังสุขภาพผู้สูงอายุไทย 9 ด้าน (MOPH HDC) พร้อมระบบวิศวกรรมข้อมูลแบบวงปิด (Loop Engineering)",
    version=settings.VERSION
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup hook to initialize & seed database
@app.on_event("startup")
def on_startup():
    try:
        seed_database()
    except Exception as e:
        print(f"Aging seed notice: {e}")

# Include Routers (both /api/aging and /api for convenience)
app.include_router(aging.router, prefix=settings.API_PREFIX)
app.include_router(aging.router, prefix="")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

# Frontend paths
FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"

@app.get("/")
def serve_index():
    index_file = FRONTEND_DIR / "index.html"
    return FileResponse(str(index_file))

@app.get("/aging")
def serve_aging():
    index_file = FRONTEND_DIR / "index.html"
    return FileResponse(str(index_file))

# Mount Frontend static files
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
