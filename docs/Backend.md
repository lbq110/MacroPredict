# MacroPredict Market – Backend Specification

## 1. 技术栈
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Database**: PostgreSQL (SQLAlchemy + Alembic)
- **Cache**: Redis (Celery Broker + Price Cache)
- **Task Queue**: Celery (Settlement & Data Ingestion)
- **Auth**: JWT (OAuth2 Password Bearer)

---

## 2. 核心模块

### 2.1 市场状态管理 (Market Lifecycle)
每个宏观事件关联一个或多个预测市场。市场状态流转如下：
1. **Upcoming**: 事件已发布但尚未开放下注。
2. **Open**: 开放下注。
3. **Closed**: 到达截止时间（事件 T0 前 1 小时），停止下注。
4. **Settled**: 结算引擎完成盈亏分配。

### 2.2 结算引擎 (Settlement Engine)
**触发逻辑**：事件公布时间 T0 + 30 分钟。

**流程**：
1. 获取实际数据 (Actual Value)。
2. 获取资产在 T0 和 T30 的市场价格。
3. 计算实际涨跌幅 $R = (P_{T30} - P_{T0}) / P_{T0}$。
4. 匹配用户投注的方向/区间。
5. 更新用户钱包余额，产生交易审计日志。

### 2.3 数据同步
- **价格推送**：通过 WebSocket 实现秒级实时价格更新。
- **采集任务**：定时任务从 FRED/Polygon 抓取数据并持久化。

---

## 3. API 核心端点

- `GET /auth/login`: 用户登录。
- `GET /assets`: 资产列表。
- `GET /assets/{assetId}`: 资产详情。
- `GET /calendar`: 宏观日历事件。
- `GET /markets`: 预测市场列表。
- `POST /bets`: 提交下注。
- `GET /bets/history`: 个人下注历史。
- `GET /wallet`: 钱包余额。

---

## 4. 资产分类与数据模型

### 4.1 一级资产分类 (Asset Class Enum)
```python
class AssetCategory(str, Enum):
    CRYPTO = "CRYPTO"
    EQUITY = "EQUITY"
    INDEX = "INDEX"
    FOREX = "FOREX"
    COMMODITY = "COMMODITY"
    RATES = "RATES"
```

### 4.2 资产标准字段 (Asset Model)
| 字段 | 类型 | 描述 |
|------|------|------|
| `asset_id` | String | 唯一标识，格式：`<Class>:<Subclass>:<Symbol>` |
| `asset_class` | Enum | 一级分类 |
| `asset_subclass` | String | 二级分组 (L1, DeFi, CPI 等) |
| `symbol` | String | 标准代码 |
| `symbol_source` | String | 数据源 (TradingView, FRED 等) |
| `quote_currency` | String | 计价货币 (USD/USDT) |
| `price_type` | String | Spot / Index / Yield / Rate / Boolean |
| `decimal_precision` | Integer | 小数精度 |
| `settlement_source` | String | 结算源 (Oracle/API/Manual) |
| `trading_enabled` | Boolean | 是否启用交易 |

### 4.3 命名规范
`<AssetClass>:<Subclass>:<Symbol>`

示例：
- `Crypto:L1:BTC`
- `Index:Equity:SP500`
- `Macro:Inflation:USCPI`
