from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Stock Prediction API"}

def test_get_stock_not_found():
    response = client.get("/stock/UNKNOWN")
    assert response.status_code == 404
    assert response.json() == {"detail": "Stock data not found"}

def test_add_stock_data():
    stock_data = {
        "company_code": "AAPL",
        "price": 150.0,
        "timestamp": "2025-03-22T12:00:00Z"
    }
    response = client.post("/stock/", json=stock_data)
    assert response.status_code == 200
    assert response.json() == {"message": "Stock data added successfully"}
