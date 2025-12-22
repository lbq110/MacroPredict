import asyncio
import logging
from sqlalchemy import select
from src.common.database.database import engine, SessionLocal
from src.modules.assets.models import Asset, AssetCategory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def update_prices():
    async with SessionLocal() as db:
        try:
            # Current approximate prices as of late 2025
            updates = {
                # Symbol: Price
                "BTC": 88084.01,
                "ETH": 2975.37,
                "SP500": 6834.50,
                "GOLD": 4354.50,
                "SILVER": 67.14,
                "US10Y": 4.14,
                # Add some others if they exist in potential seed data
                "USCPI": 3.4, # YoY inflation assumption
                "USUNEMP": 4.2 # Unemployment assumption
            }

            result = await db.execute(select(Asset))
            assets = result.scalars().all()
            
            updated_count = 0
            for asset in assets:
                # Flexible matching: try direct symbol match or if symbol is part of the key
                price = updates.get(asset.symbol)
                
                # Special cases for mapping if symbols differ
                if not price:
                    if "BTC" in asset.symbol: price = updates["BTC"]
                    elif "ETH" in asset.symbol: price = updates["ETH"]
                    elif "SPX" in asset.symbol: price = updates["SP500"]
                    elif "XAU" in asset.symbol: price = updates["GOLD"]
                    elif "XAG" in asset.symbol: price = updates["SILVER"]
                
                if price is not None:
                    logger.info(f"Updating {asset.symbol} from {asset.current_price} to {price}")
                    asset.current_price = price
                    updated_count += 1
            
            if updated_count > 0:
                await db.commit()
                logger.info(f"Successfully updated {updated_count} assets.")
            else:
                logger.warning("No matching assets found to update.")

        except Exception as e:
            await db.rollback()
            logger.error(f"Failed to update prices: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(update_prices())
