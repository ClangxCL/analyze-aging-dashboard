import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import EventBanner, EventScheduleSlide, EventDocument
from ..config import settings

router = APIRouter(prefix="/content", tags=["Content"])

@router.get("/banners")
def get_banners(db: Session = Depends(get_db)):
    banners = db.query(EventBanner).filter(EventBanner.is_active == True).order_by(EventBanner.display_order.asc()).all()
    result = []
    for b in banners:
        result.append({
            "id": b.id,
            "title": b.title,
            "image_url": b.image_url,
            "dimensions": b.dimensions,
            "display_order": b.display_order
        })
    return {"banners": result}

@router.get("/schedules")
def get_schedules(db: Session = Depends(get_db)):
    slides = db.query(EventScheduleSlide).filter(EventScheduleSlide.is_active == True).order_by(EventScheduleSlide.page_number.asc()).all()
    result = []
    for s in slides:
        result.append({
            "id": s.id,
            "title": s.title,
            "image_url": s.image_url,
            "page_number": s.page_number
        })
    return {"schedules": result}

@router.get("/documents")
def get_documents(category: str = None, db: Session = Depends(get_db)):
    q = db.query(EventDocument).filter(EventDocument.is_active == True)
    if category:
        q = q.filter(EventDocument.category == category)
    docs = q.order_by(EventDocument.upload_date.desc()).all()
    
    result = []
    for d in docs:
        size_kb = round(d.file_size_bytes / 1024, 1) if d.file_size_bytes else 0
        size_str = f"{size_kb} KB" if size_kb < 1024 else f"{round(size_kb / 1024, 2)} MB"
        result.append({
            "id": d.id,
            "category": d.category,
            "title": d.title,
            "description": d.description,
            "file_name": d.file_name,
            "download_url": f"/api/content/documents/{d.id}/download",
            "file_size": size_str,
            "upload_date": d.upload_date.strftime("%d/%m/%Y")
        })
    return {"documents": result}

@router.get("/documents/{doc_id}/download")
def download_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(EventDocument).filter(EventDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    file_path = os.path.join(settings.DOCS_DIR, doc.file_path)
    if not os.path.exists(file_path):
        # Check if it's an absolute path
        if os.path.exists(doc.file_path):
            file_path = doc.file_path
        else:
            raise HTTPException(status_code=404, detail="Physical file not found on server")
            
    return FileResponse(
        path=file_path,
        filename=doc.file_name,
        media_type="application/octet-stream"
    )
