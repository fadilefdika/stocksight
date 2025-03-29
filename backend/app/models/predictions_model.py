from pydantic import BaseModel
from datetime import date

class PredictionModel(BaseModel):
    symbol: str
    date: date
    predicted_close: float
    confidence: float
    prediction_type: str
