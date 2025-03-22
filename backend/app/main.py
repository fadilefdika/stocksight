from fastapi import FastAPI
from app.routers import stock
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Include routers
app.include_router(stock.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Stock Prediction API"}
