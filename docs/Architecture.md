# MacroPredict Architecture

## System Overview
MacroPredict is an event-driven prediction market system. It consists of a real-time price ingestion layer, a macro-event tracking layer, and a transactional betting/settlement engine.

## Modular Components
- **Auth**: JWT-based authentication and user management.
- **Assets**: Management of trackable financial assets (BTC, S&P 500, etc.).
- **Markets**: The core prediction market logic in `backend/src/modules/markets/`.
- **Bets**: Transactional betting system in `backend/src/modules/bets/`.
- **Settlement**: Settlement engine in `backend/src/modules/settlement/`.
- **Data Pipelines**: High-precision ingestion from Polygon and FRED.

## Core Flow
1. **Event Ingestion**: Macro events are ingested with their forecast values.
2. **Market Creation**: Markets are automatically created when an event is identified.
3. **Betting Period**: Users place bets until 1 hour before the event.
4. **Price Anchoring**: T0 and T30 prices are captured and locked.
5. **Settlement**: Results are computed, and wallets are updated.
