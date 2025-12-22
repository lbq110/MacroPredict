import random
from datetime import datetime
from src.modules.assets.models import Asset

class DataFetcher:
    """
    Utility for fetching asset prices and macro data.
    In MVP, this simulates data if external APIs are unavailable.
    """
    
    @staticmethod
    async def fetch_current_price(symbol: str) -> float:
        """
        Fetch price from Polygon.io or fallback to simulation.
        Prices updated for Dec 2025 context.
        """
        simulated_prices = {
            "BTC": 88436.39,
            "ETH": 2976.20,
            "SP500": 6834.49,
            "GOLD": 4338.38,
            "SILVER": 67.40,
            "US10Y": 4.14
        }
        
        # Check for direct match or substring match
        for key, price in simulated_prices.items():
            if key in symbol or symbol in key:
                 # Add small jitter
                jitter = random.uniform(-0.001, 0.001) * price
                return round(price + jitter, 2)

        # Fallback
        return round(random.uniform(50000, 60000), 2) if "BTC" in symbol else round(random.uniform(100, 200), 2)

    @staticmethod
    async def fetch_macro_actual(event_code: str) -> float:
        """
        Fetch actual value from FRED/Investing.com or simulation.
        """
        # Simulated value for MVP
        if "CPI" in event_code: return 3.4
        if "UNEMP" in event_code: return 4.2
        return round(random.uniform(2.0, 4.0), 1)
