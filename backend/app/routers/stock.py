from fastapi import APIRouter, HTTPException
import os
import requests
import logging

router = APIRouter(
    prefix="/stock",
    tags=["Stock"],
)

# Konfigurasi logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/{symbol}")
async def get_stock_data(symbol: str):
    api_key = os.getenv("ALPHA_VANTAGE_API_KEY")

    # Handle jika API Key belum diset
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key is missing. Set ALPHA_VANTAGE_API_KEY in environment variables.")

    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise error jika status bukan 200
        stock_data = response.json()

        # Periksa apakah ada error dari Alpha Vantage
        if "Error Message" in stock_data:
            raise HTTPException(status_code=404, detail=f"Stock data for {symbol} not found")

        # Ambil data yang diperlukan dari API
        time_series = stock_data.get("Time Series (Daily)", {})
        if not time_series:
            raise HTTPException(status_code=404, detail="No time series data available")

        # Ambil data harga terbaru
        latest_date = sorted(time_series.keys())[-1]
        latest_data = time_series[latest_date]

        return {
            "symbol": symbol,
            "date": latest_date,
            "open": latest_data["1. open"],
            "high": latest_data["2. high"],
            "low": latest_data["3. low"],
            "close": latest_data["4. close"],
            "volume": latest_data["5. volume"],
        }

    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch stock data")
