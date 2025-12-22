# MacroPredict Market – Frontend Specification

## 1. 核心目标
提供一个极速、专业且信息密集的金融级交互界面。降低宏观经济数据对用户的认知负荷。

---

## 2. 技术栈
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **Charts**: 
  - `Lightweight Charts` (资产 K 线)
  - `Chart.js` (宏观预测 vs 实际 Bar/Line 图)
- **State**: `TanStack Query` (Server State), `Zustand` (Client State)
- **Realtime**: WebSocket (Socket.io or native)

---

## 3. 关键交互

### 3.1 实时价格与状态
- 订阅 WebSocket 事件：
  - `price_update`: 更新资产卡片及详情页 K 线。
  - `market_status_change`: 当市场状态切换为 `Closed` 时，置灰下注按钮。
  - `event_published`: 财经日历即时填入实际值。

### 3.2 下注 UI (Betting Console)
- **Binary Mode**: 经典的 Yes/No (涨/跌) 选择。
- **Range Mode** (未来版本支持): 
  - 滑动条或预设区间选择（如 "0.1% - 0.5%", "> 0.5%"）。
  - 显示各区间的隐含概率（实时更新）。

---

## 4. 样式规范
- **Theme**: 支持深色/浅色模式，金融风格调色盘（Emerald Green / Rose Red）。
- **密度**: 信息紧凑，参考 TradingView 侧边栏及 Bloomberg 终端。

---

## 5. 性能指标
- **LCP**: < 1.2s
- **图表渲染**: 支持 WebGL 加速的图表库，在大数据量下保持丝滑旋转/缩放。

---

## 6. 资产分类 UI

### 6.1 一级分类标签栏
首页展示以下资产分类筛选器：
- `All` | `Crypto` | `Equity` | `Index` | `Forex` | `Commodity` | `Rates & Bonds`

### 6.2 二级分组 (Subclass)
每个一级分类下支持二级分组展示：
| 一级分类 | 二级分组 |
|----------|----------|
| Crypto | L1, L2, DeFi, Meme, Stablecoin |
| Equity | US Tech, China ADR/HK |
| Index | Equity Index, Crypto Index |
| Forex | Major Pairs, EM Pairs |
| Commodity | Energy, Metals |
| Rates & Bonds | Sovereign Yields, Policy Rates |

### 6.3 资产卡片数据结构
```typescript
interface Asset {
    id: number;
    asset_id: string;        // 格式: Crypto:L1:BTC
    asset_class: string;
    asset_subclass: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    nextEvent?: string;
    eventTime?: string;
}
```
