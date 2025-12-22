# 单一事件结算流程 – 可执行 Checklist

本清单用于验证 MacroPredict 平台从宏观事件创建到用户下注、自动结算及资金到账的完整逻辑链路。

---

## 阶段 1：环境与前置准备 (Environment & Pre-requisites)
- [ ] **数据库状态**：确保 PostgreSQL 已启动，且 `assets`, `macro_event_types`, `markets`, `bets`, `wallets` 表已正确初始化。
- [ ] **Redis 服务**：确认 Redis 运行正常（用于 Celery Broker 和价格缓存）。
- [ ] **Worker 运行**：后台 Celery Worker 已启动并监听 `process_settlement` 队列。
- [ ] **测试用户**：创建一个具有初始余额（如 1000 USDT）的测试用户。

---

## 阶段 2：管理端设置 (Administrative Setup)
- [ ] **创建资产**：在 `assets` 表中存在至少一个目标资产（如 `BTC/USDT` 或 `GOLD`）。
- [ ] **创建事件类型**：在 `macro_event_types` 表中定义一个宏观事件类型（如 `US_CPI_YOY`）。
- [ ] **发布宏观事件**：
    - 在 `macro_events_history` 中创建一个即将发生的事件。
    - 设置 `publish_time` (T0) 为当前时间之后的某个时间点。
- [ ] **初始化预测市场**：
    - 在 `markets` 表中创建一个关联该事件和资产的市场。
    - 状态设为 `OPEN`。
    - 设置 `close_time` (T-1h) 和 `settle_time` (T+30m)。

---

## 阶段 3：用户交互 (User Interaction)
- [ ] **查询市场**：通过 `GET /markets` 接口确认市场可见且状态为 `OPEN`。
- [ ] **提交下注**：
    - 调用 `POST /bets` 提交一笔下注（如 100 USDT, 方向 `UP`）。
- [ ] **扣款验证**：
    - 检查 `wallets` 表，确认余额已即时扣除 (1000 -> 900)。
    - 检查 `wallet_transactions` 表，确认存在 `BET_PLACEMENT` 类型的记录。
- [ ] **下注持久化**：确认 `bets` 表中生成了状态为 `PENDING` 的记录。

---

## 阶段 4：生命周期流转 (Lifecycle Execution)
- [ ] **停止下注 (Market Closing)**：
    - 模拟到达 `close_time`，市场状态更新为 `CLOSED`。
    - 尝试调用 `POST /bets`，应返回 400 错误（市场已关闭）。
- [ ] **基准价格捕获 (T0 Snapshot)**：
    - 模拟到达 `publish_time` (T0)。
    - 系统捕获当前资产价格并存入 `markets.base_price`（或 `price_snapshots` 表）。
- [ ] **实际数据录入**：
    - 在 `macro_events_history.actual_value` 中填入公布的宏观数据。

---

## 阶段 5：自动结算与到账 (Settlement & Payout)
- [ ] **触发结算任务**：
    - 模拟到达 `settle_time` (T0 + 30m)。
    - 捕获结算价格 (T30 Price)。
    - 手动或自动通过 Celery 触发 `process_settlement(market_id, settlement_price)`。
- [ ] **逻辑处理验证**：
    - **胜负判定**：根据 `settlement_price` vs `base_price` 判断 `UP` 或 `DOWN` 获胜。
    - **状态更新**：`markets.status` 变为 `SETTLED`，`bets.status` 变为 `WON` 或 `LOST`。
- [ ] **奖金发放**：
    - 若 `WON`，确认用户余额增加（本金 + 收益，按赔率计算）。
    - 检查 `wallet_transactions` 表，确认存在 `PAYOUT` 类型的记录。

---

## 阶段 6：审计与闭环验证 (Audit & Verification)
- [ ] **钱包对账**：`wallet.balance` 必须等于 `初始余额 - 输掉的投注 + 赢得的奖金`。
- [ ] **结算日志**：检查 `settlement_logs` (若有) 记录了关键价格点和结算时间。
- [ ] **前端同步**：在前端页面刷新，确认下注历史状态已更新为“已结算”。
