from fastapi import APIRouter, Request
from app.models.predict_request import PredictRequest
from app.services.stock_service import fetch_stock_data, get_stock_history_data
import os
from fastapi import HTTPException

router = APIRouter(prefix="/api/stocks", tags=["Stock"])

@router.get("/{symbol}")
async def get_stock_history(symbol: str, period: str = "90d", interval: str = "1d"):
    # Tidak pakai await karena fungsi ini synchronous
    if not symbol.isalpha():
        raise HTTPException(status_code=400, detail="Invalid stock symbol")
    data = await get_stock_history_data(symbol, period, interval) 
    return data


@router.get("/predict/{symbol}")
async def get_stock(symbol: str, request: Request):
    redis = request.app.state.redis
    model = request.app.state.stock_model
    return await fetch_stock_data(symbol, redis, model, request)

