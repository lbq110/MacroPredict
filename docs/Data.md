# MacroPredict Market – Data Specification

## 1. 核心实体 (Data Entities)

### 1.1 资产表 (Assets)
| 字段 | 类型 | 描述 |
|------|------|------|
| `asset_id` | String | 唯一标识，格式：`<AssetClass>:<Subclass>:<Symbol>` |
| `asset_class` | Enum | 一级分类 (Crypto, Equity, Index, Forex, Commodity, Rates) |
| `asset_subclass` | String | 二级分组 (L1, DeFi, US Tech 等) |
| `symbol` | String | 标准代码 (BTC, SPX 等) |
| `symbol_source` | String | 数据源 (TradingView, Binance, FRED 等) |
| `quote_currency` | String | 计价货币 (USD/USDT) |
| `price_type` | String | 价格类型 (Spot, Index, Yield, Rate) |
| `decimal_precision` | Integer | 小数精度 |
| `settlement_source` | String | 结算源 (Oracle/API/Manual) |
| `trading_enabled` | Boolean | 是否启用交易 |

### 1.2 价格数据表 (Price Ticks)
| 字段 | 类型 | 描述 |
|------|------|------|
| `asset_id` | String | 资产标识 |
| `source` | String | 数据源 (binance, polygon 等) |
| `price` | Decimal(24,8) | 价格 |
| `volume_24h` | Decimal(24,8) | 24小时交易量 |
| `timestamp` | Timestamp | 数据时间 |
| `is_canonical` | Boolean | 是否用于结算 |

### 1.3 价格快照 (Price Snapshots)
| 字段 | 类型 | 描述 |
|------|------|------|
| `asset_id` | String | 资产标识 |
| `snapshot_type` | Enum | T0 或 T30 |
| `market_id` | Integer | 关联市场 |
| `price` | Decimal(24,8) | 快照价格 |
| `source` | String | 数据源 |
| `timestamp` | Timestamp | 快照时间 |
| `tolerance_sec` | Integer | 容差秒数 (默认 ±5s) |

### 1.4 宏观事件发布 (Macro Releases)
| 字段 | 类型 | 描述 |
|------|------|------|
| `event_type_id` | Integer | 事件类型 |
| `official_time` | Timestamp | 官方发布时间 |
| `actual_time` | Timestamp | 实际获取时间 |
| `forecast_value` | Decimal | 预测值 |
| `actual_value` | Decimal | 实际值 |
| `previous_value` | Decimal | 前值 |
| `revision_of` | Integer | 修正引用 (支持重组) |
| `is_final` | Boolean | 是否最终值 |

### 1.5 数据源注册表 (Data Sources)
| 字段 | 类型 | 描述 |
|------|------|------|
| `asset_id` | String | 资产标识 |
| `source_name` | String | 数据源名称 |
| `priority` | Integer | 优先级 (1=最高) |
| `update_interval` | Integer | 更新间隔 (秒) |
| `is_active` | Boolean | 是否启用 |

---

## 2. 数据源映射

### 2.1 按资产类别
| Asset Class | Primary | Secondary | Tertiary |
|-------------|---------|-----------|----------|
| Crypto | Binance | TradingView | CoinGecko |
| Equity | Polygon | Yahoo Finance | TradingView |
| Index | TradingView | Polygon | CME |
| Forex | OANDA | TradingView | ECB/Fed |
| Commodity | CME | TradingView | Reuters |
| Rates | FRED | TradingView | Treasury |

### 2.2 更新频率
| Asset Class | 正常模式 | 预事件 (T-1H) | 结算窗口 |
|-------------|----------|---------------|----------|
| Crypto | 5s | 1s | 100ms |
| Equity | 15s | 5s | 1s |
| Index | 15s | 5s | 1s |
| Forex | 10s | 2s | 500ms |
| Commodity | 30s | 10s | 1s |
| Rates | 60s | 30s | 5s |

---

## 3. 核心计算 (Calculations)

### 3.1 波动率 (Return)
$R = (P_{T30} - P_{T0}) / P_{T0}$

### 3.2 场景判定 (Scenario Classification)
定义容差 $\epsilon$：
- **Above Forecast**: $Actual > Forecast + \epsilon$
- **Near Forecast**: $|Actual - Forecast| \le \epsilon$
- **Below Forecast**: $Actual < Forecast - \epsilon$

---

## 4. 数据质量 & 降级策略

### 4.1 新鲜度阈值
- Crypto: 30s
- Forex: 45s
- Equity/Index: 60s
- Commodity: 120s
- Rates: 300s

### 4.2 降级流程
1. Redis 缓存 → 2. 主数据源 → 3. 备数据源 → 4. 历史最后值 + 告警

### 4.3 数据质量
- **清洗**: 剔除 $R > 5\sigma$ 的异常离群值
- **补全**: 若 T0 或 T30 的价格数据缺失，标记为 `INVALID`
