from fastapi import APIRouter, Request
from app.models.predict_request import PredictRequest
from app.services.stock_service import fetch_stock_data
import os

router = APIRouter(prefix="/stock", tags=["Stock"])

@router.get("/{symbol}")
async def get_stock(symbol: str, request: Request):
    redis = request.app.state.redis
    model = request.app.state.stock_model
    return await fetch_stock_data(symbol, redis, model, request)
