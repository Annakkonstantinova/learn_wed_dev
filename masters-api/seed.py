"""Заполнение базы демонстрационными мастерами.

Запустите командой: python seed.py
Существующие записи не дублируются, если таблица уже заполнена.
"""
from database import Base, SessionLocal, engine
from models import Master

Base.metadata.create_all(bind=engine)

masters_data = [
    {"name": "Анна", "specialization": "Парикмахер"},
    {"name": "Мария", "specialization": "Визажист"},
    {"name": "Елена", "specialization": "Мастер маникюра"},
]

db = SessionLocal()

try:
    if db.query(Master).count() == 0:
        db.add_all([Master(**item) for item in masters_data])
        db.commit()
        print("Тестовые мастера добавлены в базу данных.")
    else:
        print("Таблица masters уже содержит записи. Заполнение пропущено.")
finally:
    db.close()
