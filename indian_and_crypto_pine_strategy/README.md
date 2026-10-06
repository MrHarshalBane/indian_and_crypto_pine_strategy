# 🚀 Advanced Multi-Asset Pine Script v5 Strategy & Indicator
### Built for Indian Stock Market (NSE / BSE) & Global Cryptocurrency Markets

This Pine Script v5 code is a professional-grade, multi-asset quantitative trading strategy and indicator engineered to trade **NSE / BSE Indian equities, Nifty & BankNifty indices, Futures, and 24/7 Cryptocurrency markets**.

---

## 🌟 Key Features

1. **Triple-Confluence Signal Engine**:
   - **Trend Filter**: 200 Exponential Moving Average (EMA) to ensure trades align with macro market momentum.
   - **Volatile Supertrend Core**: Adaptive ATR-based trend tracking to trigger high-probability entries.
   - **RSI Momentum Filter**: Prevents entering overextended positions.
   - **Volume Spike Filter**: Filters out illiquid stock whipsaws and low-volume crypto consolidation.

2. **Market-Specific Configuration Presets**:
   - **NSE / BSE Mode**: Built-in 09:15 to 15:15 IST timing filter + Automatic 15:15 IST Intraday Square-off option to avoid intraday margin penalty / overnight exposure.
   - **Crypto Mode**: 24/7 continuous calculation optimized for Binance, Bybit, CoinSwitch, and WazirX tickers.

3. **Dynamic Risk Management (ATR Based)**:
   - Dynamic Stop Loss (SL) calculated from ATR volatility.
   - Dynamic Take Profit (TP) with customizable Risk-to-Reward (R:R) ratios (e.g., 1:2, 1:3).
   - Dynamic Trailing Stop Loss to lock in gains during trending moves.

4. **Automated Trading Ready (Webhook & Web App Support)**:
   - Fully formatted JSON alert payloads compatible with **Tradetron, AlgoTest, PyKite, NextLevelBot, 3Commas, Binance API bridges**, and custom Python FastAPI/Flask webhooks.

5. **Live HUD Dashboard**:
   - On-screen summary table displaying live Trend Direction, Supertrend Signal, RSI value, ATR Volatility, Backtest Win Rate %, and Total Net Profit.

---

## 📊 Recommended Settings Matrix

| Asset Class | Tickers Examples | Recommended Timeframe | Supertrend Period / Factor | Risk-Reward Ratio | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **NSE Intraday Stocks** | RELIANCE, INFYS, HDFCBANK, TATAMOTORS | 5 min / 15 min | 10 / 3.0 | 1 : 2.0 | Keep Intraday Auto Square-off ON (15:15 IST). |
| **NSE Indices** | NIFTY50, BANKNIFTY, FINNIFTY | 3 min / 5 min | 7 / 2.5 | 1 : 1.5 | Enable Volume Filter & RSI Confirmation. |
| **NSE / BSE Swing** | NIFTY, MIDCPNIFTY, Top 100 Stocks | 1 Hour / 1 Day | 14 / 3.5 | 1 : 2.5 | Set Trading Style to "Swing Trading". |
| **Crypto Intraday** | BTCUSDT, ETHUSDT, SOLUSDT | 15 min / 1 Hour | 10 / 3.0 | 1 : 2.0 | Select "Crypto 24/7" preset mode. |
| **Crypto Swing** | BTCUSDT, ETHUSDT, AVAXUSDT | 4 Hour / 1 Day | 14 / 4.0 | 1 : 3.0 | Turn on Dynamic Trailing Stop. |

---

## 🛠️ Step-by-Step Installation in TradingView

1. Open [TradingView](https://www.tradingview.com/) and open any chart (e.g. `NSE:NIFTY` or `BINANCE:BTCUSDT`).
2. At the bottom panel, click on **Pine Editor**.
3. Clear any existing code in the editor.
4. Copy the complete code from `Indian_Crypto_Pro_Strategy.pine` and paste it into the editor.
5. Click **Save** and name it `Indian & Crypto Pro Strategy`.
6. Click **Add to chart**.
7. Click the **Gear (Settings)** icon on the chart indicator overlay to toggle between **NSE / BSE Stock Market** and **Crypto 24/7** modes.

---

## 🤖 Webhook Automation Integration

### 1. For Indian Markets (Tradetron / AlgoTest / NextLevelBot)
Set up TradingView Alert:
- **Condition**: Select `Multi-Asset Pro Strategy` -> `BUY` / `SELL` or `alertcondition`.
- **Webhook URL**: Enter your Tradetron/AlgoTest bridge endpoint (e.g. `https://api.tradetron.tech/v2/webhook...`).
- **Message**:
  ```json
  {
    "auth_token": "YOUR_ALGO_TOKEN",
    "symbol": "{{ticker}}",
    "action": "BUY",
    "quantity": 25,
    "price": "{{close}}"
  }
  ```

### 2. For Crypto Markets (3Commas / Binance / Bybit)
- **Webhook URL**: `https://3commas.io/trade_signal/os` (or custom endpoint)
- **Message**:
  ```json
  {
    "message_type": "bot",
    "bot_id": "1234567",
    "email_token": "YOUR_3COMMAS_TOKEN",
    "delay": "0"
  }
  ```

---

## 📜 File Location
- **Pine Script Code**: `Indian_Crypto_Pro_Strategy.pine`
- **Documentation**: `README.md`
