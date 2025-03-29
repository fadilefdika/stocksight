from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

class Stock(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    symbol: str
    company_name: str
    historical_data: List[dict] # Harga saham historis dari API eksternal
