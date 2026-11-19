from database import Base, SessionLocal, engine
from models import Category

Base.metadata.create_all(bind=engine)
initial_categories = [
    Category(id=1, title="Парикмахерские услуги"),
    Category(id=2, title="Уход за ногтями"),
    Category(id=3, title="Наращивание и оформление ресниц"),
]
with SessionLocal() as db:
    for item in initial_categories:
        if db.query(Category).filter(Category.id == item.id).first() is None:
            db.add(item)
    db.commit()
print("Категории добавлены/проверены. Категория id=3 доступна.")
