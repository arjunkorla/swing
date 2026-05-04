/**
 * FYERS API Service
 *
 * Real API Documentation: https://myapi.fyers.in/docs/
 * Base URL: https://api.fyers.in/api/v3/
 * WebSocket: wss://socket.fyers.in/wss/
 *
 * To use REAL FYERS API:
 * 1. Register at https://myapi.fyers.in and create an app
 * 2. Replace FYERS_APP_ID and FYERS_SECRET_KEY below
 * 3. Complete OAuth2 flow to get access_token
 * 4. Uncomment the real API calls below
 *
 * ⚠️ IMPORTANT: Never expose credentials in frontend code in production.
 * Use a backend proxy (e.g. FastAPI) to handle API calls securely.
 */

// Replace these with your actual FYERS credentials
export const FYERS_APP_ID = 'YOUR_FYERS_APP_ID';
export const FYERS_SECRET_KEY = 'YOUR_FYERS_SECRET_KEY';
const FYERS_BASE_URL = 'https://api.fyers.in/api/v3';

const simulateDelay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FyersQuote {
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  chp: number;
  ch: number;
  spread: number;
  ask: number;
  bid: number;
  fyToken: string;
}

export interface FyersOHLCV {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FyersOrder {
  symbol: string;
  qty: number;
  type: 1 | 2; // 1 = BUY, 2 = SELL
  orderType: 1 | 2 | 3 | 4; // 1=Limit, 2=Market, 3=SL, 4=SL-M
  limitPrice?: number;
  stopPrice?: number;
  productType: 'CNC' | 'INTRADAY' | 'MARGIN' | 'MTF';
  validity: 'DAY' | 'IOC';
  disclosedQty?: number;
  offlineOrder?: boolean;
}

export interface FyersHolding {
  fyToken: string;
  symbol: string;
  segment: number;
  id: string;
  isin: string;
  qty: number;
  remainingQty: number;
  collateralQty: number;
  t1Qty: number;
  costPrice: number;
  marketVal: number;
  buyAvgPrice: number;
  currentPrice: number;
  pl: number;
}

// ─── API Functions ─────────────────────────────────────────────────────────

/**
 * Step 1: Generate FYERS Auth URL for OAuth login
 * Real: https://api.fyers.in/api/v3/generate-authcode
 */
export const getAuthUrl = (): string => {
  // Real implementation:
  // return `https://api.fyers.in/api/v3/generate-authcode?client_id=${FYERS_APP_ID}&redirect_uri=YOUR_REDIRECT_URI&response_type=code&state=sample`;
  return `#fyers-oauth-placeholder?app_id=${FYERS_APP_ID}`;
};

/**
 * Step 2: Generate access token using auth code
 * Real API: POST /generate-token
 */
export const generateToken = async (authCode: string): Promise<{ access_token: string; refresh_token: string }> => {
  await simulateDelay(800);

  // Real implementation:
  // const response = await fetch(`${FYERS_BASE_URL}/generate-token`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     grant_type: 'authorization_code',
  //     appIdHash: btoa(`${FYERS_APP_ID}:${FYERS_SECRET_KEY}`),
  //     code: authCode,
  //   }),
  // });
  // return response.json();

  return {
    access_token: `mock_access_token_${Date.now()}`,
    refresh_token: `mock_refresh_token_${Date.now()}`,
  };
};

/**
 * Get real-time quotes for multiple symbols
 * Real API: GET /quotes?symbols=NSE:RELIANCE-EQ,NSE:TCS-EQ
 */
export const getQuotes = async (symbols: string[], accessToken?: string): Promise<FyersQuote[]> => {
  await simulateDelay(400);

  // Real implementation:
  // const response = await fetch(`${FYERS_BASE_URL}/quotes?symbols=${symbols.join(',')}`, {
  //   headers: { 'Authorization': `${FYERS_APP_ID}:${accessToken}` }
  // });
  // const data = await response.json();
  // return data.d;

  return symbols.map(symbol => {
    const base = 500 + Math.random() * 3000;
    const chp = (Math.random() - 0.4) * 4;
    return {
      symbol,
      ltp: Math.round(base * 100) / 100,
      open: Math.round((base * 0.995) * 100) / 100,
      high: Math.round((base * 1.015) * 100) / 100,
      low: Math.round((base * 0.985) * 100) / 100,
      close: Math.round((base * 0.998) * 100) / 100,
      volume: Math.floor(Math.random() * 10000000 + 1000000),
      chp,
      ch: Math.round(base * chp / 100 * 100) / 100,
      spread: Math.round(Math.random() * 2 * 100) / 100,
      ask: Math.round((base * 1.001) * 100) / 100,
      bid: Math.round((base * 0.999) * 100) / 100,
      fyToken: `NSE:${symbol.split(':')[1] || symbol}-EQ`,
    };
  });
};

/**
 * Get historical OHLCV data
 * Real API: GET /history?symbol=NSE:RELIANCE-EQ&resolution=D&date_format=1&range_from=...&range_to=...
 */
export const getHistory = async (
  symbol: string,
  resolution: 'D' | '60' | '15' | '5' | '1' = 'D',
  days = 60,
  accessToken?: string
): Promise<FyersOHLCV[]> => {
  await simulateDelay(500);

  // Real implementation:
  // const rangeFrom = Math.floor(Date.now() / 1000) - days * 86400;
  // const rangeTo = Math.floor(Date.now() / 1000);
  // const response = await fetch(
  //   `${FYERS_BASE_URL}/history?symbol=${symbol}&resolution=${resolution}&date_format=1&range_from=${rangeFrom}&range_to=${rangeTo}`,
  //   { headers: { 'Authorization': `${FYERS_APP_ID}:${accessToken}` } }
  // );
  // const data = await response.json();
  // return data.candles.map(([t, o, h, l, c, v]) => ({ timestamp: t, open: o, high: h, low: l, close: c, volume: v }));

  const data: FyersOHLCV[] = [];
  let price = 2500;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const change = (Math.random() - 0.48) * 80;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 40;
    const low = Math.min(open, close) - Math.random() * 40;
    price = close;
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: Math.floor(date.getTime() / 1000),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 8000000 + 2000000),
    });
  }
  return data;
};

/**
 * Place an order
 * Real API: POST /orders/sync
 */
export const placeOrder = async (order: FyersOrder, accessToken?: string): Promise<{ status: string; orderId: string; message: string }> => {
  await simulateDelay(900);

  // Real implementation:
  // const response = await fetch(`${FYERS_BASE_URL}/orders/sync`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `${FYERS_APP_ID}:${accessToken}`,
  //   },
  //   body: JSON.stringify(order),
  // });
  // return response.json();

  return {
    status: 'success',
    orderId: `ORD${Date.now()}`,
    message: `Order placed: ${order.qty} qty of ${order.symbol} at ${order.orderType === 2 ? 'Market' : `₹${order.limitPrice}`}`,
  };
};

/**
 * Get portfolio holdings (CNC positions)
 * Real API: GET /holdings
 */
export const getHoldings = async (accessToken?: string): Promise<FyersHolding[]> => {
  await simulateDelay(400);
  // Real: fetch(`${FYERS_BASE_URL}/holdings`, { headers: { 'Authorization': `${FYERS_APP_ID}:${accessToken}` } })
  return [];
};

/**
 * Get current positions (Intraday / MTF)
 * Real API: GET /positions
 */
export const getPositions = async (accessToken?: string) => {
  await simulateDelay(400);
  // Real: fetch(`${FYERS_BASE_URL}/positions`, { headers: { 'Authorization': `${FYERS_APP_ID}:${accessToken}` } })
  return { netPositions: [], overallPositions: [] };
};

/**
 * Get funds & margin details
 * Real API: GET /funds
 */
export const getFunds = async (accessToken?: string) => {
  await simulateDelay(300);
  return {
    availableBalance: 125430.50,
    usedMargin: 29725.00,
    totalBalance: 155155.50,
    mtfUsed: 42750.00,
  };
};

/**
 * Initialize WebSocket for live market data feed
 * Real: wss://socket.fyers.in/wss/
 */
export const initWebSocket = (
  symbols: string[],
  onData: (data: { symbol: string; ltp: number; chp: number; volume: number }) => void,
  accessToken?: string
): (() => void) => {
  // Real WebSocket implementation:
  // const ws = new WebSocket(`wss://socket.fyers.in/wss/?access_token=${FYERS_APP_ID}:${accessToken}`);
  // ws.onopen = () => ws.send(JSON.stringify({ T: 'SUB_L2', SLIST: symbols, SUB_T: 1 }));
  // ws.onmessage = (event) => onData(JSON.parse(event.data));
  // return () => ws.close();

  // Mock WebSocket with interval
  const priceMap: Record<string, number> = {};
  symbols.forEach(s => { priceMap[s] = 500 + Math.random() * 3000; });

  const interval = setInterval(() => {
    symbols.forEach(symbol => {
      const delta = (Math.random() - 0.49) * 5;
      priceMap[symbol] = (priceMap[symbol] || 1000) + delta;
      onData({
        symbol,
        ltp: Math.round(priceMap[symbol] * 100) / 100,
        chp: Math.round(delta / priceMap[symbol] * 100 * 100) / 100,
        volume: Math.floor(Math.random() * 50000),
      });
    });
  }, 3000);

  return () => clearInterval(interval);
};

/**
 * Search stocks by query
 * Real API: GET /symbol_master (or search endpoint)
 */
export const searchStocks = async (query: string): Promise<{ symbol: string; name: string; exchange: string }[]> => {
  await simulateDelay(200);
  const allStocks = [
    { symbol: 'NSE:RELIANCE-EQ', name: 'Reliance Industries', exchange: 'NSE' },
    { symbol: 'NSE:TCS-EQ', name: 'Tata Consultancy Services', exchange: 'NSE' },
    { symbol: 'NSE:HDFCBANK-EQ', name: 'HDFC Bank', exchange: 'NSE' },
    { symbol: 'NSE:TATAMOTORS-EQ', name: 'Tata Motors', exchange: 'NSE' },
    { symbol: 'NSE:INFY-EQ', name: 'Infosys', exchange: 'NSE' },
    { symbol: 'NSE:BAJFINANCE-EQ', name: 'Bajaj Finance', exchange: 'NSE' },
    { symbol: 'NSE:SUNPHARMA-EQ', name: 'Sun Pharmaceutical', exchange: 'NSE' },
    { symbol: 'NSE:DLF-EQ', name: 'DLF Limited', exchange: 'NSE' },
    { symbol: 'NSE:MARUTI-EQ', name: 'Maruti Suzuki', exchange: 'NSE' },
    { symbol: 'NSE:ICICIBANK-EQ', name: 'ICICI Bank', exchange: 'NSE' },
  ];
  const q = query.toLowerCase();
  return allStocks.filter(s => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q));
};
