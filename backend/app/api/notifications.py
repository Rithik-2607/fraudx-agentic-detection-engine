from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.notification import Notification

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(db: Session = Depends(get_db)):
    notifs = db.query(Notification).order_by(Notification.created_at.desc()).all()
    result = []
    for notif in notifs:
        # Check mapping for links
        link = "/countermeasures"
        if "RING-018" in notif.message or "NOTIF-001" in notif.notification_id:
            link = "/fraud-rings/RING-018"
        elif "RING-019" in notif.message or "NOTIF-004" in notif.notification_id:
            link = "/fraud-rings/RING-019"
        elif "U1042" in notif.message or "NOTIF-002" in notif.notification_id:
            link = "/investigations/INV-1024"
            
        result.append({
            "id": notif.notification_id,
            "title": notif.title,
            "description": notif.message,
            "severity": notif.severity.lower(),
            "time": notif.created_at.isoformat(),
            "read": notif.read,
            "link": link
        })
    return result

@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter_by(notification_id=notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notif.read = True
    db.commit()
    return {"status": "SUCCESS"}
