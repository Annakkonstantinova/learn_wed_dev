from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Master
from schemas import MasterResponse

# Создаём таблицы при запуске приложения, если их ещё нет.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Salon Masters API",
    description="API для получения информации о мастерах салона красоты.",
    version="1.0.0",
)


@app.get("/", tags=["Главная"])
def root():
    return {
        "message": "Salon Masters API работает",
        "documentation": "/docs",
    }


@app.get("/masters", response_model=list[MasterResponse], tags=["Мастера"])
def get_masters(
    specialization: str | None = Query(
        default=None,
        description="Фильтр по специализации мастера",
    ),
    db: Session = Depends(get_db),
):
    """Возвращает всех мастеров или мастеров указанной специализации."""
    query = db.query(Master)

    if specialization:
        query = query.filter(Master.specialization == specialization)

    return query.order_by(Master.id).all()


@app.get(
    "/masters/{master_id}",
    response_model=MasterResponse,
    tags=["Мастера"],
)
def get_master(master_id: int, db: Session = Depends(get_db)):
    """Возвращает одного мастера по идентификатору."""
    master = db.query(Master).filter(Master.id == master_id).first()

    if master is None:
        raise HTTPException(
            status_code=404,
            detail=f"Мастер с id={master_id} не найден",
        )

    return master
