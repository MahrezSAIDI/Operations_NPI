from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Operation(Base):
    __tablename__ = "operations"

    id = Column(Integer, primary_key=True, index=True)
    expression = Column(String(255), index=True)
    result = Column(Float)
