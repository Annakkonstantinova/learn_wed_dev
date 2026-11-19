from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Category, Service
from schemas import ServiceCreate, ServiceResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salon Services API", version="1.0.0")


@app.post("/services", response_model=ServiceResponse,
          status_code=status.HTTP_201_CREATED, tags=["Services"])
def create_service(service_data: ServiceCreate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(
        Category.id == service_data.category_id
    ).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")

    service = Service(
        category_id=service_data.category_id,
        title=service_data.title,
        desc=service_data.desc,
        duration=service_data.duration,
        price=service_data.price,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@app.get("/services", response_model=list[ServiceResponse], tags=["Services"])
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()
