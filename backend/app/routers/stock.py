from fastapi import APIRouter, HTTPException
from app.db import database
from app.models.stock_model import StockData, StockInfo

router = APIRouter(
    prefix="/stock",
    tags=["Stock"],
)

@router.get("/{company_code}")
async def get_stock_data(company_code: str):
    stock_collection = database.get_collection("stocks")
    stock_data = stock_collection.find_one({"company_code": company_code})

    if not stock_data:
        raise HTTPException(status_code=404, detail="Stock data not found")
    
    return stock_data

@router.post("/")
async def add_stock_data(stock_data: StockData):
    stock_collection = database.get_collection("stocks")
    stock_collection.insert_one(stock_data.dict())

    return {"message": "Stock data added successfully"}
