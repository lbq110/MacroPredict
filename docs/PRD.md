# MacroPredict Market – 产品需求文档 (PRD)

> Version: MVP v1.0  
> Status: 已结构化  
> Product Type: 宏观事件驱动预测市场  
> Last Update: 2025-12

---

## 1. 产品概述

### 1.1 产品描述
MacroPredict Market 是一个基于宏观经济数据与事件驱动的预测市场。用户可以在重要经济数据公布前，基于历史统计与市场预测，对资产在数据公布后的价格走势进行下注。

---

## 2. 核心规则

### 2.1 下注截止时间
- **下注截止**：数据公布前 **1 小时**。
- **目的**：防止因内幕消息或即时波动导致的不公平竞争。

### 2.2 结算逻辑
- **锚点时间 (T0)**：数据正式公布时间。
- **结算时间 (T30)**：数据公布后 30 分钟。
- **盈亏计算**：基于 T0 到 T30 的资产价格百分比涨跌幅。

---

## 3. 功能需求

### 3.1 首页
- **一级资产分类 (Asset Class)**：
    - **Crypto** (L1/Base, L2/Scaling, DeFi, Meme, Stablecoin)
    - **Equity** (US Tech, China ADR/HK)
    - **Index** (Equity Index, Crypto Index)
    - **Forex** (Major Pairs, EM Pairs)
    - **Commodity** (Energy, Metals)
    - **Rates & Bonds** (Sovereign Yields, Policy Rates)
- 按类别展示资产，显示当前价格、24h 涨跌幅及即将到来的预测市场事件。

### 3.2 资产标准字段 (Asset Schema)
- `asset_id`: 内部唯一 ID
- `asset_class`: 一级分类
- `asset_subclass`: 二级分组 (e.g., L1, DeFi, CPI)
- `symbol`: 标准 symbol
- `symbol_source`: 数据源 (e.g., TradingView, FRED)
- `quote_currency`: 计价货币 (USD/USDT)
- `price_type`: 价格类型 (Spot, Index, Yield, Rate, Boolean)
- `decimal_precision`: 小数精度
- `settlement_source`: 结算源 (Oracle/API/Manual)
- `trading_enabled`: 是否启用
- **命名规范**：`<AssetClass>:<Subclass>:<Symbol>`

### 3.3 资产详情页
- **价格图表**：TradingView 风格的 K 线图。
- **历史场景统计**：
    - **Above Forecast** (实际 > 预测 + 容差)
    - **Near Forecast** (|实际 - 预测| <= 容差)
    - **Below Forecast** (实际 < 预测 - 容差)
- **统计字段**：每个场景下的上涨/下跌概率及平均波动幅度。

### 3.3 财经日历
- 聚合全球核心宏观指标（GDP, CPI, NFP, FOMC 等）。
- 实时更新实际值并联动预测市场状态。

### 3.4 预测下注
- **类型**：涨/跌 (Binary) 或 波动幅度区间 (Range)。
- **结算状态**：Upcoming -> Open -> Closed (截止下注) -> Settled (已结算)。

---

## 4. 技术栈
- **前端**：React + Tailwind + Lightweight Charts
- **后端**：Python (FastAPI) + PostgreSQL + Redis
- **数据**：Polygon.io (价格), FRED/Investing.com (宏观)
