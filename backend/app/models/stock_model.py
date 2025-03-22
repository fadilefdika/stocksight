from pydantic import BaseModel
from typing import Optional

class StockData(BaseModel):
    company_code: str
    price: float
    timestamp: str

class StockInfo(BaseModel):
    company_code: str
    company_name: Optional[str]
    market: Optional[str]
    current_price: Optional[float]
    timestamp: Optional[str]
