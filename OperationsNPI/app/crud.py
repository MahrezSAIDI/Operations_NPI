from sqlalchemy.orm import Session
from app import models

import math

def calculate_npi(expression: str) -> float:
    result = []
    elements = expression.split()

    for element in elements:
        if element.isdigit():
            result.append(int(element))
        else:
            if element in ("sin", "cos", "sqrt"):
                if len(result) < 1:
                    raise ValueError("Expression invalide : Il faut au moins un chiffre pour les opérations sin, cos ou sqrt.")
                
                chiffre_1 = result.pop()

                if element == "sin":
                    result.append(math.sin(chiffre_1))
                elif element == "cos":
                    result.append(math.cos(chiffre_1))
                elif element == "sqrt":
                    if chiffre_1 < 0:
                        raise ValueError("Pas de racine carrée d'un nombre négatif.")
                    result.append(math.sqrt(chiffre_1))
            else:
                if len(result) < 2:
                    raise ValueError("Expression invalide : Il faut saisir au moins deux chiffres et un opérateur (+, -, *, /, %, ^).")
                
                chiffre_1 = result.pop()
                chiffre_2 = result.pop()

                if element == "+":
                    result.append(chiffre_2 + chiffre_1)
                elif element == "-":
                    result.append(chiffre_2 - chiffre_1)
                elif element == "*":
                    result.append(chiffre_2 * chiffre_1)
                elif element == "/":
                    if chiffre_1 == 0:
                        raise ValueError("Pas de division par zéro.")
                    result.append(chiffre_2 / chiffre_1)
                elif element == "//":
                    if chiffre_1 == 0:
                        raise ValueError("Pas de division par zéro.")
                    result.append(chiffre_2 // chiffre_1)
                elif element == "%":
                    result.append(chiffre_2 % chiffre_1)
                elif element == "^":
                    result.append(chiffre_2 ** chiffre_1)
                else:
                    raise ValueError(f"Opérateur non reconnu : {element}")

    if len(result) != 1:
        raise ValueError("Expression invalide ")

    return result[0]

def create_operation(db: Session, expression: str, result: float):
    db_operation = models.Operation(expression=expression, result=result)
    db.add(db_operation)
    db.commit()
    db.refresh(db_operation)
    return db_operation

def get_operations(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Operation).offset(skip).limit(limit).all()
