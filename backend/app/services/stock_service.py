from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from datetime import datetime
from app.models.stock_model import StockData

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client['stocksight']
stocks_collection = db['stocks']

# Function to add a new stock
def add_stock(stock_data):
    stock = StockData(**stock_data)
    stock_dict = stock.model_dump()  # Convert Pydantic model to dictionary
    stocks_collection.insert_one(stock_dict)  # Save to MongoDB
    return str(stock_dict["_id"])


def get_stock(symbol):
    stock_data = stocks_collection.find_one({"symbol": symbol})
    if stock_data:
        stock = StockData(**stock_data)
        return stock
    return None
