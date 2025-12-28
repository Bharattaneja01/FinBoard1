# 📊 Customizable Finance Dashboard

A customizable finance dashboard that allows users to build their own real-time monitoring system using multiple financial APIs. Users can create widgets such as cards, tables, and charts, configure data fields dynamically, and visualize market data for stocks and cryptocurrencies.

---

## 🔗 Live Deployment

Frontend deployed on Vercel:  
👉 **https://fin-board1.vercel.app/**

---

<kbd>
<img src="https://github.com/Bharattaneja01/FinBoard1/blob/228192e1edd9d1e5c483fe53289c9df4824fa822/screenshots/dashboard.png" />
</kbd>
<br />
<br />
<kbd>
<img src="https://github.com/Bharattaneja01/FinBoard1/blob/228192e1edd9d1e5c483fe53289c9df4824fa822/screenshots/edit-widget.png" />
</kbd>

---

## ✨ Features & Design

### 🧩 Widget Management

- Add, update, refresh, and delete widgets
- Supported widget types:
  - 📌 Finance Cards (single or multiple metrics)
  - 📋 Tables (market data, lists)
  - 📈 Charts (line-based price history)
- Drag-and-drop widget rearrangement
- Widget configuration panel with live updates
- Last updated timestamp & manual refresh support

---

### 🔌 API Integration

The dashboard integrates with multiple financial data providers:

- **CoinGecko** – crypto prices, markets, charts
- **Alpha Vantage** – stock quotes and time-series data
- **Finnhub** – stock market data
- **IndianAPI** – Indian market data

All external API calls are routed through a secure server-side API layer to protect API keys and handle rate limits gracefully.

---

### 🔄 Handling Different API Data Formats (Key Challenge)

Each API returns data in **different formats**, including:
- Deeply nested objects
- Arrays and time-series data
- Keys with spaces and numeric prefixes (e.g., `05. price`)
- Provider-specific response schemas

To address this, the project implements:
- **Key normalization** (spaces, dots, numeric prefixes removed)
- **Structural normalization** to unify objects, arrays, and time-series data
- A common data model for:
  - Field selection
  - Cards, tables, and charts rendering

While API response formats vary significantly, the application handles these variations **to the fullest practical extent**, ensuring consistent and predictable widget behavior across providers.

---

### 🎨 User Interface & Experience

- Fully responsive dashboard layout
- Interactive JSON field explorer
- Search and collapse functionality for large API responses
- Per-field data formatting options:
  - Number
  - Currency
  - Percentage
- Graceful loading, error, and empty-state handling

---

## 🛠 Tech Stack

### Frontend
- **Next.js** (App Router)
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Recharts** for data visualization

### Backend
- Server-side API routes (Next.js)
- Secure environment variable handling
- API request caching & error handling

### Deployment
- **Vercel**

---

## 🧪 Sample APIs (For Testing)

### 🟢 CoinGecko – Single Crypto Price Card
```text
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true
