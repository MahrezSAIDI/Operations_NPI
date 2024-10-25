from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app import models, crud, database
from app.database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

class ExpressionRequest(BaseModel):
    expression: str  

#pour eviter Not Allowed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adresse de ton front-end React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/calculate")
async def calculate(expression_request: ExpressionRequest, db: Session = Depends(get_db)):
    try:
        result = crud.calculate_npi(expression_request.expression) 
        operation = crud.create_operation(db, expression=expression_request.expression, result=result)
        return {"expression": expression_request.expression, "result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")

@app.get("/operations")
async def read_operations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    operations = crud.get_operations(db, skip=skip, limit=limit)
    return operations
