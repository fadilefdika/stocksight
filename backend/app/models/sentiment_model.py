from pydantic import BaseModel
from datetime import date

class SentimentModel(BaseModel):
    symbol: str
    date: date
    source: str
    headline: str
    sentiment_score: float
    sentiment_label: str
