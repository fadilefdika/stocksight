from fastapi import FastAPI
from routers import stock
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Bisa disesuaikan dengan frontend Anda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stock.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Stock Prediction API"}
