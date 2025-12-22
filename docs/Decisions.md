# Design Decisions

## 1. Backend Framework: FastAPI
Chosen for its high performance, native async support, and automatic documentation, which is critical for a high-frequency event system.

## 2. Frontend State: TanStack Query + Zustand
TanStack Query effectively manages server state (prices, events, bets) with robust caching, while Zustand provides a lightweight solution for UI states like themes and modals.

## 3. Betting Deadline: 1 Hour Before T0
Implemented to prevent information asymmetry and maintain market integrity, ensuring all bets are based on market expectations rather than imminent news leaks.

## 4. Settlement Buffer: 30 Minutes
Macroeconomic events often induce extreme volatility. A 30-minute buffer allows the market to "digest" the news, providing a more stable anchor for settlement.

## 5. Modular Domain Structure
Adopted to ensure scalability and maintainability as the project grows to include more asset classes and complex betting types.
