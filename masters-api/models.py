from sqlalchemy import Column, Integer, String

from database import Base


class Master(Base):
    """Модель мастера салона красоты."""

    __tablename__ = "masters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
