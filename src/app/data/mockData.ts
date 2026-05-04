// Mock data for AI Swing Trading Platform
// Real data would come from FYERS API: https://api.fyers.in/api/v3/

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  high52w: number;
  low52w: number;
  marketCap: string;
  sector: string;
  rsi: number;
  momentumScore: number;
  aiConfidence: number;
  volumeBreakout: number;
  sectorStrength: number;
  suggestedEntry: number;
  suggestedExit: number;
  avgZone: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  dma50: number;
  dma200: number;
  atr: number;
  deliveryPercent: number;
  breakoutPattern: string;
  sparkData: number[];
  aiExplanation: string;
}

export const stocks: Stock[] = [
  {
    id: 'RELIANCE', symbol: 'NSE:RELIANCE', name: 'Reliance Industries', exchange: 'NSE',
    price: 2847.50, change: 42.30, changePercent: 1.51, volume: 8234567, avgVolume: 5123456,
    high52w: 3217.90, low52w: 2180.00, marketCap: '19.2L Cr', sector: 'Energy',
    rsi: 62.4, momentumScore: 78, aiConfidence: 82, volumeBreakout: 1.61, sectorStrength: 72,
    suggestedEntry: 2820, suggestedExit: 3050, avgZone: 2750, riskLevel: 'Medium',
    dma50: 2710, dma200: 2580, atr: 48.2, deliveryPercent: 58.4, breakoutPattern: 'Cup & Handle',
    sparkData: [2720, 2745, 2712, 2780, 2810, 2795, 2830, 2847],
    aiExplanation: 'Reliance showing strong momentum with 1.6x volume breakout above 50-DMA. Jio and retail segments showing strong Q3 guidance. Banking sector tailwinds.',
  },
  {
    id: 'TCS', symbol: 'NSE:TCS', name: 'Tata Consultancy Services', exchange: 'NSE',
    price: 3456.75, change: -28.50, changePercent: -0.82, volume: 3456789, avgVolume: 2890123,
    high52w: 4592.25, low52w: 3199.30, marketCap: '12.5L Cr', sector: 'IT',
    rsi: 44.8, momentumScore: 52, aiConfidence: 64, volumeBreakout: 1.20, sectorStrength: 55,
    suggestedEntry: 3380, suggestedExit: 3750, avgZone: 3300, riskLevel: 'Low',
    dma50: 3520, dma200: 3650, atr: 62.4, deliveryPercent: 72.1, breakoutPattern: 'Dip Recovery',
    sparkData: [3600, 3580, 3520, 3490, 3470, 3480, 3460, 3457],
    aiExplanation: 'TCS in accumulation zone near 52-week demand zone. IT sector rotation expected. Strong delivery-based buying at current levels.',
  },
  {
    id: 'HDFCBANK', symbol: 'NSE:HDFCBANK', name: 'HDFC Bank', exchange: 'NSE',
    price: 1678.90, change: 23.45, changePercent: 1.42, volume: 12345678, avgVolume: 8901234,
    high52w: 1880.00, low52w: 1363.55, marketCap: '12.8L Cr', sector: 'Banking',
    rsi: 58.2, momentumScore: 71, aiConfidence: 79, volumeBreakout: 1.39, sectorStrength: 82,
    suggestedEntry: 1650, suggestedExit: 1850, avgZone: 1580, riskLevel: 'Low',
    dma50: 1625, dma200: 1545, atr: 28.6, deliveryPercent: 68.3, breakoutPattern: 'Ascending Triangle',
    sparkData: [1580, 1612, 1598, 1635, 1648, 1661, 1670, 1679],
    aiExplanation: 'HDFC Bank breaking out of 3-month consolidation with strong banking sector momentum. RBI rate cut expectations driving banking sector rally.',
  },
  {
    id: 'TATAMOTORS', symbol: 'NSE:TATAMOTORS', name: 'Tata Motors', exchange: 'NSE',
    price: 756.30, change: 18.70, changePercent: 2.54, volume: 19876543, avgVolume: 9234567,
    high52w: 1063.45, low52w: 623.20, marketCap: '2.8L Cr', sector: 'Auto',
    rsi: 67.8, momentumScore: 85, aiConfidence: 88, volumeBreakout: 2.15, sectorStrength: 78,
    suggestedEntry: 735, suggestedExit: 850, avgZone: 700, riskLevel: 'High',
    dma50: 712, dma200: 698, atr: 22.4, deliveryPercent: 45.2, breakoutPattern: 'Bull Flag',
    sparkData: [695, 710, 703, 725, 738, 742, 750, 756],
    aiExplanation: 'Tata Motors showing 2.1x volume breakout with strong JLR recovery momentum. EV push and India auto demand cycle favoring bullish setup.',
  },
  {
    id: 'INFOSYS', symbol: 'NSE:INFY', name: 'Infosys', exchange: 'NSE',
    price: 1534.60, change: -12.40, changePercent: -0.80, volume: 4567890, avgVolume: 3456789,
    high52w: 1903.70, low52w: 1358.35, marketCap: '6.4L Cr', sector: 'IT',
    rsi: 42.3, momentumScore: 48, aiConfidence: 58, volumeBreakout: 1.32, sectorStrength: 55,
    suggestedEntry: 1490, suggestedExit: 1720, avgZone: 1450, riskLevel: 'Medium',
    dma50: 1580, dma200: 1640, atr: 35.8, deliveryPercent: 65.4, breakoutPattern: 'Base Formation',
    sparkData: [1590, 1572, 1548, 1560, 1542, 1538, 1540, 1535],
    aiExplanation: 'Infosys approaching strong support zone. IT sector near bottom of rotation cycle. Defensive positioning with gradual accumulation recommended.',
  },
  {
    id: 'BAJFINANCE', symbol: 'NSE:BAJFINANCE', name: 'Bajaj Finance', exchange: 'NSE',
    price: 7234.50, change: 145.80, changePercent: 2.06, volume: 2345678, avgVolume: 1678901,
    high52w: 8190.00, low52w: 6187.80, marketCap: '4.4L Cr', sector: 'Banking',
    rsi: 65.1, momentumScore: 80, aiConfidence: 85, volumeBreakout: 1.40, sectorStrength: 82,
    suggestedEntry: 7100, suggestedExit: 7900, avgZone: 6900, riskLevel: 'Medium',
    dma50: 6980, dma200: 6750, atr: 145.6, deliveryPercent: 62.8, breakoutPattern: 'Breakout Retest',
    sparkData: [6950, 7020, 6980, 7080, 7120, 7180, 7210, 7235],
    aiExplanation: 'Bajaj Finance breaking out of 4-month base with improving NBFC sector sentiment. AUM growth and NIM expansion driving re-rating.',
  },
  {
    id: 'SUNPHARMA', symbol: 'NSE:SUNPHARMA', name: 'Sun Pharmaceutical', exchange: 'NSE',
    price: 1645.20, change: 31.60, changePercent: 1.96, volume: 3678901, avgVolume: 2345678,
    high52w: 1960.35, low52w: 1390.80, marketCap: '3.9L Cr', sector: 'Pharma',
    rsi: 61.4, momentumScore: 74, aiConfidence: 77, volumeBreakout: 1.57, sectorStrength: 68,
    suggestedEntry: 1610, suggestedExit: 1820, avgZone: 1550, riskLevel: 'Low',
    dma50: 1590, dma200: 1520, atr: 38.2, deliveryPercent: 70.6, breakoutPattern: 'Continuation',
    sparkData: [1580, 1590, 1605, 1598, 1615, 1628, 1638, 1645],
    aiExplanation: 'Sun Pharma in strong uptrend with specialty pharma tailwinds. US generics pipeline and India branded formulations driving growth.',
  },
  {
    id: 'ADANIENT', symbol: 'NSE:ADANIENT', name: 'Adani Enterprises', exchange: 'NSE',
    price: 2456.80, change: -45.20, changePercent: -1.81, volume: 5678901, avgVolume: 4567890,
    high52w: 3743.90, low52w: 2015.60, marketCap: '2.8L Cr', sector: 'Energy',
    rsi: 38.5, momentumScore: 42, aiConfidence: 48, volumeBreakout: 1.24, sectorStrength: 72,
    suggestedEntry: 2350, suggestedExit: 2750, avgZone: 2200, riskLevel: 'High',
    dma50: 2580, dma200: 2640, atr: 68.4, deliveryPercent: 38.5, breakoutPattern: 'Dip Buy',
    sparkData: [2620, 2590, 2540, 2510, 2480, 2490, 2460, 2457],
    aiExplanation: 'Adani Enterprises at key support zone after correction. Infrastructure push and airports segment showing strong growth. High risk/reward setup.',
  },
  {
    id: 'MARUTI', symbol: 'NSE:MARUTI', name: 'Maruti Suzuki', exchange: 'NSE',
    price: 12567.30, change: 234.50, changePercent: 1.90, volume: 1234567, avgVolume: 890123,
    high52w: 13680.00, low52w: 10310.20, marketCap: '3.8L Cr', sector: 'Auto',
    rsi: 63.7, momentumScore: 76, aiConfidence: 81, volumeBreakout: 1.39, sectorStrength: 78,
    suggestedEntry: 12300, suggestedExit: 13500, avgZone: 11800, riskLevel: 'Low',
    dma50: 12100, dma200: 11650, atr: 268.4, deliveryPercent: 72.3, breakoutPattern: 'Cup & Handle',
    sparkData: [12100, 12180, 12250, 12200, 12350, 12420, 12510, 12567],
    aiExplanation: 'Maruti breaking out of cup pattern with strong SUV demand. New model launches and rural recovery driving volume growth.',
  },
  {
    id: 'ICICIBANK', symbol: 'NSE:ICICIBANK', name: 'ICICI Bank', exchange: 'NSE',
    price: 1245.60, change: 19.80, changePercent: 1.61, volume: 15678901, avgVolume: 10234567,
    high52w: 1388.85, low52w: 1008.45, marketCap: '8.8L Cr', sector: 'Banking',
    rsi: 60.2, momentumScore: 73, aiConfidence: 80, volumeBreakout: 1.53, sectorStrength: 82,
    suggestedEntry: 1220, suggestedExit: 1380, avgZone: 1160, riskLevel: 'Low',
    dma50: 1198, dma200: 1134, atr: 22.8, deliveryPercent: 65.8, breakoutPattern: 'Ascending Triangle',
    sparkData: [1185, 1198, 1192, 1210, 1220, 1232, 1240, 1246],
    aiExplanation: 'ICICI Bank strong retail franchise with improving ROA. Banking sector leadership with strong credit growth and NPA improvement.',
  },
  {
    id: 'DLF', symbol: 'NSE:DLF', name: 'DLF Limited', exchange: 'NSE',
    price: 892.40, change: 28.60, changePercent: 3.31, volume: 7890123, avgVolume: 4234567,
    high52w: 967.00, low52w: 618.50, marketCap: '2.2L Cr', sector: 'Realty',
    rsi: 71.2, momentumScore: 88, aiConfidence: 84, volumeBreakout: 1.86, sectorStrength: 85,
    suggestedEntry: 860, suggestedExit: 980, avgZone: 820, riskLevel: 'Medium',
    dma50: 840, dma200: 780, atr: 24.8, deliveryPercent: 52.4, breakoutPattern: 'Breakout',
    sparkData: [825, 840, 855, 848, 865, 875, 882, 892],
    aiExplanation: 'DLF leading the Realty sector breakout with strong pre-launch bookings. Camellias Phase 2 launch expected to unlock value. Sector rotation favoring Realty.',
  },
  {
    id: 'WIPRO', symbol: 'NSE:WIPRO', name: 'Wipro Limited', exchange: 'NSE',
    price: 487.50, change: -4.80, changePercent: -0.97, volume: 6789012, avgVolume: 5123456,
    high52w: 598.45, low52w: 396.75, marketCap: '2.5L Cr', sector: 'IT',
    rsi: 40.1, momentumScore: 44, aiConfidence: 52, volumeBreakout: 1.15, sectorStrength: 55,
    suggestedEntry: 465, suggestedExit: 560, avgZone: 440, riskLevel: 'Medium',
    dma50: 510, dma200: 520, atr: 12.4, deliveryPercent: 60.2, breakoutPattern: 'Support Test',
    sparkData: [520, 510, 502, 498, 492, 489, 488, 487],
    aiExplanation: 'Wipro testing long-term support. IT sector headwinds persist but valuation attractive for medium-term accumulation.',
  },
];

export const indices = [
  {
    name: 'NIFTY 50', symbol: 'NSE:NIFTY50-INDEX', value: 23847.65, change: 142.35, changePercent: 0.60,
    high: 23912.40, low: 23698.20, prevClose: 23705.30,
    sparkData: [23650, 23720, 23698, 23755, 23790, 23810, 23840, 23848],
  },
  {
    name: 'SENSEX', symbol: 'BSE:SENSEX', value: 78943.20, change: 478.60, changePercent: 0.61,
    high: 79156.80, low: 78421.30, prevClose: 78464.60,
    sparkData: [78400, 78620, 78540, 78720, 78820, 78880, 78920, 78943],
  },
  {
    name: 'BANK NIFTY', symbol: 'NSE:BANKNIFTY-INDEX', value: 51234.80, change: 456.20, changePercent: 0.90,
    high: 51456.30, low: 50712.40, prevClose: 50778.60,
    sparkData: [50650, 50820, 50780, 50950, 51050, 51120, 51180, 51235],
  },
  {
    name: 'NIFTY IT', symbol: 'NSE:NIFTYIT-INDEX', value: 36789.40, change: -234.80, changePercent: -0.63,
    high: 37120.60, low: 36650.20, prevClose: 37024.20,
    sparkData: [37100, 37020, 36940, 36880, 36820, 36760, 36800, 36789],
  },
];

export const sectorData = [
  { name: 'Banking', change: 1.42, strength: 82, momentum: 'Strong', topStock: 'HDFCBANK', stocks: 18, color: '#10b981' },
  { name: 'IT', change: -0.72, strength: 45, momentum: 'Weak', topStock: 'TCS', stocks: 12, color: '#ef4444' },
  { name: 'Pharma', change: 1.18, strength: 68, momentum: 'Moderate', topStock: 'SUNPHARMA', stocks: 22, color: '#10b981' },
  { name: 'FMCG', change: 0.34, strength: 58, momentum: 'Neutral', topStock: 'HINDUNILVR', stocks: 15, color: '#f59e0b' },
  { name: 'Auto', change: 1.85, strength: 78, momentum: 'Strong', topStock: 'TATAMOTORS', stocks: 14, color: '#10b981' },
  { name: 'Realty', change: 2.34, strength: 85, momentum: 'Very Strong', topStock: 'DLF', stocks: 8, color: '#10b981' },
  { name: 'PSU', change: 0.92, strength: 62, momentum: 'Moderate', topStock: 'COALINDIA', stocks: 20, color: '#f59e0b' },
  { name: 'Energy', change: 0.68, strength: 72, momentum: 'Moderate', topStock: 'RELIANCE', stocks: 10, color: '#f59e0b' },
  { name: 'Metal', change: -1.24, strength: 38, momentum: 'Weak', topStock: 'TATASTEEL', stocks: 16, color: '#ef4444' },
  { name: 'Infra', change: 1.56, strength: 75, momentum: 'Strong', topStock: 'L&T', stocks: 12, color: '#10b981' },
];

export const portfolioHoldings = [
  {
    symbol: 'RELIANCE', name: 'Reliance Industries', qty: 50, avgPrice: 2645.00, currentPrice: 2847.50,
    investedValue: 132250, currentValue: 142375, pnl: 10125, pnlPercent: 7.66,
    dayChange: 2115, dayChangePercent: 1.51, sector: 'Energy',
  },
  {
    symbol: 'HDFCBANK', name: 'HDFC Bank', qty: 75, avgPrice: 1560.00, currentPrice: 1678.90,
    investedValue: 117000, currentValue: 125917.50, pnl: 8917.50, pnlPercent: 7.62,
    dayChange: 1758.75, dayChangePercent: 1.42, sector: 'Banking',
  },
  {
    symbol: 'TATAMOTORS', name: 'Tata Motors', qty: 200, avgPrice: 720.00, currentPrice: 756.30,
    investedValue: 144000, currentValue: 151260, pnl: 7260, pnlPercent: 5.04,
    dayChange: 3740, dayChangePercent: 2.54, sector: 'Auto',
  },
  {
    symbol: 'TCS', name: 'Tata Consultancy Services', qty: 30, avgPrice: 3680.00, currentPrice: 3456.75,
    investedValue: 110400, currentValue: 103702.50, pnl: -6697.50, pnlPercent: -6.07,
    dayChange: -855, dayChangePercent: -0.82, sector: 'IT',
  },
  {
    symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', qty: 60, avgPrice: 1480.00, currentPrice: 1645.20,
    investedValue: 88800, currentValue: 98712, pnl: 9912, pnlPercent: 11.16,
    dayChange: 1896, dayChangePercent: 1.96, sector: 'Pharma',
  },
];

export const mtfPositions = [
  {
    symbol: 'BAJFINANCE', name: 'Bajaj Finance', qty: 10, avgPrice: 7050.00, currentPrice: 7234.50,
    leverage: '4x', margin: 17625, exposure: 70500, pnl: 1845, pnlPercent: 2.62,
    daysHeld: 5, marginCallAt: 6800,
  },
  {
    symbol: 'ICICIBANK', name: 'ICICI Bank', qty: 50, avgPrice: 1210.00, currentPrice: 1245.60,
    leverage: '5x', margin: 12100, exposure: 60500, pnl: 1780, pnlPercent: 2.94,
    daysHeld: 3, marginCallAt: 1150,
  },
];

export const alertsData = [
  { id: 1, type: 'Volume Breakout', symbol: 'TATAMOTORS', message: 'Volume breakout detected: 2.1x above 20-day average', time: '2 min ago', priority: 'high', triggered: true },
  { id: 2, type: 'Price Breakout', symbol: 'HDFCBANK', message: 'Price broke above 52-week high resistance at ₹1,670', time: '15 min ago', priority: 'high', triggered: true },
  { id: 3, type: 'RSI Reversal', symbol: 'TCS', message: 'RSI oversold reversal signal at 38 level', time: '1 hr ago', priority: 'medium', triggered: true },
  { id: 4, type: 'Target Reached', symbol: 'SUNPHARMA', message: 'First target ₹1,640 reached. Consider partial booking.', time: '2 hr ago', priority: 'medium', triggered: true },
  { id: 5, type: 'AI Confidence', symbol: 'BAJFINANCE', message: 'AI confidence increased from 72% to 85% - upgraded to Strong Buy', time: '3 hr ago', priority: 'low', triggered: false },
  { id: 6, type: 'Sector Shift', symbol: 'DLF', message: 'Realty sector showing sector rotation inflows', time: '4 hr ago', priority: 'medium', triggered: false },
];

export const swingOpportunities = [
  {
    id: 1, symbol: 'HDFCBANK', name: 'HDFC Bank', type: 'Breakout', expectedMove: '+12.5%',
    probability: 82, holdDays: '10-15 days', entry: 1650, target: 1855, stoploss: 1595, riskReward: '3.2x',
    sector: 'Banking', aiExplanation: 'Breaking out of 3-month base with strong banking sector tailwinds. RBI rate cut cycle expected to boost banking NIM.',
    tags: ['Breakout', 'High Volume', 'Sector Leader'],
  },
  {
    id: 2, symbol: 'TATAMOTORS', name: 'Tata Motors', type: 'Momentum', expectedMove: '+12.4%',
    probability: 88, holdDays: '7-10 days', entry: 735, target: 826, stoploss: 708, riskReward: '3.4x',
    sector: 'Auto', aiExplanation: 'Strong bull flag pattern with JLR recovery momentum. EV segment contributing 15% of revenue. Institutional buying detected.',
    tags: ['Bull Flag', 'Volume Surge', 'EV Play'],
  },
  {
    id: 3, symbol: 'SUNPHARMA', name: 'Sun Pharma', type: 'Dip Recovery', expectedMove: '+10.6%',
    probability: 77, holdDays: '15-20 days', entry: 1610, target: 1782, stoploss: 1562, riskReward: '3.6x',
    sector: 'Pharma', aiExplanation: 'Healthy dip to support after strong run. Specialty pharma pipeline strong. US FDA clearances expected in Q4.',
    tags: ['Dip Buy', 'Defensive', 'US Pipeline'],
  },
  {
    id: 4, symbol: 'DLF', name: 'DLF Limited', type: 'Sector Rotation', expectedMove: '+15.2%',
    probability: 74, holdDays: '20-30 days', entry: 845, target: 974, stoploss: 812, riskReward: '3.9x',
    sector: 'Realty', aiExplanation: 'Realty sector leading the market with strong pre-launch bookings. DLF Camellias phase 2 launch upcoming.',
    tags: ['Sector Leader', 'Strong Pre-Sales', 'Luxury RE'],
  },
  {
    id: 5, symbol: 'BAJFINANCE', name: 'Bajaj Finance', type: 'Breakout Retest', expectedMove: '+9.2%',
    probability: 85, holdDays: '8-12 days', entry: 7100, target: 7753, stoploss: 6880, riskReward: '3.0x',
    sector: 'Banking', aiExplanation: 'Classic breakout-retest setup after the ₹7,000 breakout. Strong AUM growth and improving credit quality justify re-rating.',
    tags: ['Retest', 'High Confidence', 'NBFC'],
  },
  {
    id: 6, symbol: 'MARUTI', name: 'Maruti Suzuki', type: 'Cup & Handle', expectedMove: '+7.5%',
    probability: 81, holdDays: '10-15 days', entry: 12300, target: 13223, stoploss: 11980, riskReward: '2.9x',
    sector: 'Auto', aiExplanation: 'Textbook cup & handle formation nearing completion. Strong festive season demand and new model pipeline.',
    tags: ['Classic Pattern', 'Auto Cycle', 'Premium'],
  },
];

export const journalEntries = [
  {
    id: 1, date: '2026-05-02', symbol: 'RELIANCE', type: 'BUY', qty: 20, entry: 2780, exit: null, pnl: null,
    status: 'Open', emotion: 'Confident', setup: 'Cup & Handle Breakout',
    notes: 'Entered on breakout of ₹2,750 resistance with volume confirmation.',
    aiInsight: 'Entry timing was good. Consider trailing stop at ₹2,790. Pattern target: ₹3,050.',
    rating: null,
  },
  {
    id: 2, date: '2026-04-28', symbol: 'WIPRO', type: 'BUY', qty: 100, entry: 485, exit: 498, pnl: 1300,
    status: 'Closed', emotion: 'Anxious', setup: 'Support Bounce',
    notes: 'Exited early due to market volatility. Could have held more.',
    aiInsight: 'Pattern target was ₹520. Early exit cost ₹2,200 in potential profit. Manage emotions better.',
    rating: 3,
  },
  {
    id: 3, date: '2026-04-25', symbol: 'TATASTEEL', type: 'BUY', qty: 200, entry: 158, exit: 152, pnl: -1200,
    status: 'Closed', emotion: 'FOMO', setup: 'Breakout Chase',
    notes: 'Chased the breakout. Stoploss hit immediately after entry.',
    aiInsight: 'Entry was 2.8% above ideal entry point. FOMO trade - should have waited for retest.',
    rating: 1,
  },
  {
    id: 4, date: '2026-04-20', symbol: 'HDFCBANK', type: 'BUY', qty: 40, entry: 1608, exit: 1672, pnl: 2560,
    status: 'Closed', emotion: 'Disciplined', setup: 'Ascending Triangle',
    notes: 'Followed the plan perfectly. Entered at support, exited at target.',
    aiInsight: 'Excellent execution. Waited for confirmation, proper position sizing, and stuck to plan.',
    rating: 5,
  },
];

export const backtestResults = {
  strategy: 'Momentum Breakout', period: 'Jan 2024 - Apr 2026', capital: 500000, finalValue: 842000,
  totalReturn: 68.4, cagr: 31.2, winRate: 64.5, maxDrawdown: -18.4, profitFactor: 2.34,
  totalTrades: 186, winningTrades: 120, losingTrades: 66, avgWin: 8.4, avgLoss: -3.2, sharpeRatio: 1.84,
  equityCurve: [
    { month: 'Jan 24', value: 500000 }, { month: 'Mar 24', value: 548000 }, { month: 'May 24', value: 582000 },
    { month: 'Jul 24', value: 561000 }, { month: 'Sep 24', value: 625000 }, { month: 'Nov 24', value: 680000 },
    { month: 'Jan 25', value: 648000 }, { month: 'Mar 25', value: 712000 }, { month: 'May 25', value: 768000 },
    { month: 'Jul 25', value: 742000 }, { month: 'Sep 25', value: 800000 }, { month: 'Nov 25', value: 826000 },
    { month: 'Jan 26', value: 814000 }, { month: 'Mar 26', value: 842000 },
  ],
};

export const marketBreadth = {
  advances: 1456, declines: 892, unchanged: 156, totalStocks: 2504,
  advanceDeclineRatio: 1.63, newHighs: 124, newLows: 38, aboveDma50: 62.4, aboveDma200: 54.8,
};

export const aiSuggestions = [
  'Analyze HDFC Bank for swing trade',
  'Show top momentum stocks today',
  'What is my portfolio risk exposure?',
  'Explain RSI divergence in TCS',
  'Best sector to invest this week?',
  'How to set stop-loss for Reliance?',
];
