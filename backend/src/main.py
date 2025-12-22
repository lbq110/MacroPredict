from fastapi import FastAPI
from src.config.config import settings
# Routers will be imported from modules
from src.modules.auth.router import router as auth_router
from src.modules.assets.router import router as assets_router
from src.modules.bets.router import router as bets_router
from src.modules.wallet.router import router as wallet_router

app = FastAPI(
    title="MacroPredict Market API",
    description="Backend for Macro-event driven prediction market system",
    version="1.0.0",
)

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(assets_router, prefix=f"{settings.API_V1_STR}/assets", tags=["assets"])
app.include_router(bets_router, prefix=f"{settings.API_V1_STR}/bets", tags=["bets"])
app.include_router(wallet_router, prefix=f"{settings.API_V1_STR}/wallets", tags=["wallets"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
