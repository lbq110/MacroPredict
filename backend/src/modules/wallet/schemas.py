from pydantic import BaseModel

class Wallet(BaseModel):
    balance: float

    class Config:
        from_attributes = True
