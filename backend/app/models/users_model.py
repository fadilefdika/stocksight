from pydantic import BaseModel
from datetime import datetime

class UserModel(BaseModel):
    email: str
    password_hash: str
    subscription_level: str
    api_key: str
    created_at: datetime
    subscription_expires: datetime
