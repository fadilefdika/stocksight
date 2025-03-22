import yfinance as yf
from datetime import datetime
from app.utils.database import stocks_collection
from app.models.stock_model import StockModel

def get_stock_data(symbol: str):
    stock = yf.Ticker(symbol)
    stock_info = stock.history(period="1d")
    if stock_info.empty:
        return None
    latest_data = stock_info.iloc[-1]
    stock_data = {
        "symbol": symbol,
        "name": stock.info.get("longName", ""),
        "price": latest_data["Close"],
        "timestamp": datetime.now()
    }
    # Simpan ke MongoDB
    result = stocks_collection.insert_one(stock_data)
    print(f"Data inserted with id: {result.inserted_id}")  # Debugging
    return stock_data

def predict_stock_price(symbol: str):
    # Implementasikan model prediksi di sini
    # Contoh sederhana: prediksi harga naik 1%
    stock = yf.Ticker(symbol)
    current_price = stock.history(period="1d").iloc[-1]["Close"]
    predicted_price = current_price * 1.01
    return predicted_price

# Testing
if __name__ == "__main__":
    symbol = "AAPL"  # Contoh simbol saham
    data = get_stock_data(symbol)
    if data:
        print("Stock data saved to MongoDB:")
        print(data)
    else:
        print("Failed to fetch stock data.")