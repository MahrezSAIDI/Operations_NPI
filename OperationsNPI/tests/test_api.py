import pytest
from fastapi.testclient import TestClient
from app.main import app
from app import models
from app.database import get_db, engine


client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    models.Base.metadata.create_all(bind=engine)
    yield  
    models.Base.metadata.drop_all(bind=engine)


def test_calculate_valid_expression():
    response = client.post("/calculate", json={"expression": "3 4 +"})
    assert response.status_code == 200
    assert response.json() == {"expression": "3 4 +", "result": 7}

def test_calculate_invalid_expression():
    response = client.post("/calculate", json={"expression": "3 0 /"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Pas de division par zéro."}

def test_calculate_invalid_operator():
    response = client.post("/calculate", json={"expression": "3 4 @ "})
    assert response.status_code == 400
    assert response.json() == {"detail": "Opérateur non reconnu : @"}

def test_calculate_sin_operation():
    response = client.post("/calculate", json={"expression": "0 sin"})
    assert response.status_code == 200
    assert response.json() == {"expression": "0 sin", "result": 0.0}

# Test the /operations endpoint
def test_read_operations():
    client.post("/calculate", json={"expression": "3 4 +"})  
    response = client.get("/operations")
    assert response.status_code == 200
    assert len(response.json()) > 0 
