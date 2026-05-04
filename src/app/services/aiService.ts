/**
 * AI Analysis Service (OpenAI GPT-4 Integration)
 *
 * Real API Documentation: https://platform.openai.com/docs/api-reference
 *
 * To use REAL OpenAI API:
 * 1. Get API key from https://platform.openai.com/api-keys
 * 2. Replace OPENAI_API_KEY below
 * 3. Uncomment the real API calls
 *
 * ⚠️ SECURITY: Never expose OpenAI API keys in production frontend code.
 * Always route through a backend proxy (FastAPI/Express) for secure calls.
 */

// Replace with your actual OpenAI API key (use via backend in production)
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

// System prompt for the AI trading assistant
const SYSTEM_PROMPT = `You are SwingAI, an expert AI swing trading assistant for Indian stock markets (NSE/BSE).
You specialize in:
- Technical analysis (candlestick patterns, indicators, support/resistance)
- FYERS API data interpretation and momentum strategies
- Risk management and position sizing for retail traders
- Sector rotation analysis and NSE/BSE market dynamics

Always provide:
- Specific entry/exit price levels in INR (₹)
- Stop-loss recommendations (max 5% risk)
- Probability scores (0-100%)
- Risk/Reward ratios
- Confidence percentages
- Holding duration for swing trades (1-30 days)

Keep responses concise, actionable, and trader-friendly.`;

// Pre-built mock responses for demo mode
const MOCK_RESPONSES: Record<string, string> = {
  hdfc: '**HDFC Bank Analysis (AI Score: 79%)** 📈\n\nHDFC Bank is forming a classic ascending triangle on the daily chart. Three touches of resistance at ₹1,680 with higher lows confirms the pattern.\n\n**Setup:**\n• Entry: ₹1,650–1,665 (current level)\n• Target 1: ₹1,780 (+7.5%)\n• Target 2: ₹1,850 (+11.8%)\n• Stoploss: ₹1,610 (-2.4%)\n• Risk/Reward: **3.2x**\n\n**Catalysts:** RBI rate cut expectations, strong credit growth, NPA improvement to 1.2%.\n\n**Holding period:** 10–15 days. AI Confidence: **79%**',

  reliance: '**Reliance Industries Analysis (AI Score: 82%)** 🚀\n\nReliance is forming a cup-and-handle pattern with the cup base at ₹2,710 and handle currently developing. Volume profile shows strong institutional accumulation.\n\n**Setup:**\n• Entry: ₹2,820–2,850\n• Target 1: ₹3,050 (+7.1%)\n• Target 2: ₹3,200 (+12.7%)\n• Stoploss: ₹2,735 (-3.0%)\n• Risk/Reward: **2.9x**\n\n**Catalysts:** Jio 5G subscriber growth, retail segment expansion, O2C margin improvement.\n\nAI Confidence: **82%** | Volume breakout: 1.6x',

  tcs: '**TCS Analysis (AI Score: 64%)** 📊\n\nTCS is in oversold territory (RSI: 44.8) after a correction from ₹4,592. The stock is approaching a strong demand zone at ₹3,380–3,420.\n\n**Accumulation Strategy:**\n• Buy 50% at ₹3,380\n• Add 50% on close above ₹3,500\n• Target: ₹3,750 (+10.9%)\n• Stoploss: ₹3,290 (-3.8%)\n\n**Note:** IT sector is at bottom of rotation cycle. Patient accumulation recommended. AI Confidence: **64%** (Moderate)',

  portfolio: '**Portfolio Analysis** 💼\n\n**Summary:**\n• Total Invested: ₹5,93,450\n• Current Value: ₹6,21,967 (+4.6%)\n• Day P&L: ₹+8,655 (+1.4%)\n\n**Top Performer:** Sun Pharma (+11.16%) ✅\n**Concern:** TCS (-6.07%) — Review stoploss at ₹3,290\n\n**Risk Assessment:**\n• Portfolio Beta: 1.2 (moderately aggressive)\n• Sector Concentration: Banking 28%, IT 24%, Auto 22%\n• VaR (95%): -₹28,400 (4.3%)\n\n**Recommendation:** Reduce IT exposure by 50%, deploy proceeds in Banking or Realty sector. Set trailing stops on profitable positions.',

  risk: '**Risk Analysis** ⚠️\n\n**Current Exposure:**\n• Equity Holdings: ₹5,93,450\n• MTF Exposure: ₹1,31,000 (19.7% leverage)\n• Max Risk/Day: ₹14,836 (2.5%)\n\n**Margin Utilization:** 23.4% (Healthy)\n\n**Alerts:**\n🔴 BAJFINANCE MTF: Margin call trigger at ₹6,800 (current: ₹7,235 — safe)\n🟡 TCS position: Down 6.07% from average. Review stoploss.\n\n**Recommendation:** Overall risk profile is moderate. MTF positions within safe zone. Consider reducing TCS position if it breaks ₹3,290.',

  momentum: '**Top Momentum Stocks Today** 🔥\n\n1. **TATAMOTORS** — Score: 85 | Conf: 88% | +2.54%\n   Bull flag breakout with 2.1x volume\n\n2. **DLF** — Score: 88 | Conf: 84% | +3.31%\n   Realty sector leader, 52W high breakout\n\n3. **BAJFINANCE** — Score: 80 | Conf: 85% | +2.06%\n   Breakout retest with strong NBFC momentum\n\n4. **RELIANCE** — Score: 78 | Conf: 82% | +1.51%\n   Cup & Handle nearing completion\n\n5. **SUNPHARMA** — Score: 74 | Conf: 77% | +1.96%\n   Continuation pattern with US pipeline catalyst\n\nAll positions have R:R > 3x. Prioritize 1 & 2 for maximum momentum.',

  sector: '**Sector Rotation Analysis** 🔄\n\n**Leading Sectors (BUY):**\n🟢 Realty: +2.34% | Strength: 85/100\n🟢 Auto: +1.85% | Strength: 78/100\n🟢 Banking: +1.42% | Strength: 82/100\n🟢 Pharma: +1.18% | Strength: 68/100\n\n**Lagging Sectors (AVOID):**\n🔴 Metal: -1.24% | Strength: 38/100\n🔴 IT: -0.72% | Strength: 45/100\n\n**Rotation Signal:** Money flowing from IT → Banking + Realty. This rotation typically lasts 4–6 weeks.\n\n**Action:** Add Realty (DLF, Godrej Properties) and Banking (HDFCBANK, ICICIBANK) positions. Exit IT on bounces.',

  default: "I'm analyzing the current market data for you. The broader market (Nifty 50: +0.60%) is in a moderate bullish phase with Banking and Auto sectors leading.\n\n**Today's Key Insights:**\n• FII buying: ₹2,345 Cr net inflows\n• Market breadth: 1,456 advances vs 892 declines (Bullish)\n• New 52W highs: 124 stocks\n• VIX: 14.2 (Low volatility — favorable for swing trades)\n\nWhat specific stock or strategy would you like me to analyze? I can help with entry/exit levels, pattern identification, and risk management.",
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface StockAnalysis {
  recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  confidence: number;
  summary: string;
  entry: number;
  target1: number;
  target2: number;
  stoploss: number;
  riskReward: string;
  holdingPeriod: string;
  catalysts: string[];
  risks: string[];
  technicals: {
    trend: string;
    pattern: string;
    rsi: string;
    volume: string;
    momentum: string;
  };
}

/**
 * Send a message to the AI trading assistant
 * Real API: POST https://api.openai.com/v1/chat/completions
 */
export const sendChatMessage = async (
  messages: ChatMessage[],
  context?: { stocks?: string[]; portfolio?: boolean }
): Promise<string> => {
  // Simulate realistic AI response delay
  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  // Real OpenAI API call (uncomment for production):
  /*
  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
  */

  // Mock response routing
  if (lastMessage.includes('hdfc')) return MOCK_RESPONSES.hdfc;
  if (lastMessage.includes('reliance')) return MOCK_RESPONSES.reliance;
  if (lastMessage.includes('tcs') || lastMessage.includes('infosys')) return MOCK_RESPONSES.tcs;
  if (lastMessage.includes('portfolio')) return MOCK_RESPONSES.portfolio;
  if (lastMessage.includes('risk') || lastMessage.includes('exposure')) return MOCK_RESPONSES.risk;
  if (lastMessage.includes('momentum') || lastMessage.includes('top stock')) return MOCK_RESPONSES.momentum;
  if (lastMessage.includes('sector') || lastMessage.includes('rotation')) return MOCK_RESPONSES.sector;

  return MOCK_RESPONSES.default;
};

/**
 * Get comprehensive AI analysis for a specific stock
 * Uses GPT-4 to generate technical + fundamental analysis
 */
export const getStockAnalysis = async (symbol: string, stockData: any): Promise<StockAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const score = stockData?.momentumScore || 70;
  const conf = stockData?.aiConfidence || 75;
  const price = stockData?.price || 1000;

  return {
    recommendation: score >= 80 ? 'STRONG BUY' : score >= 65 ? 'BUY' : score >= 50 ? 'HOLD' : 'SELL',
    confidence: conf,
    summary: stockData?.aiExplanation || `${symbol} showing ${score >= 70 ? 'strong bullish' : 'neutral'} momentum setup with volume confirmation.`,
    entry: stockData?.suggestedEntry || Math.round(price * 0.98),
    target1: stockData?.suggestedExit || Math.round(price * 1.08),
    target2: Math.round((stockData?.suggestedExit || price * 1.08) * 1.05),
    stoploss: Math.round((stockData?.suggestedEntry || price * 0.98) * 0.96),
    riskReward: '3.2x',
    holdingPeriod: '10–15 days',
    catalysts: [
      'Strong sector momentum with institutional support',
      'Volume breakout confirms buyer conviction',
      '50-DMA acting as dynamic support',
      'Relative strength above Nifty 50',
    ],
    risks: [
      'Nifty 50 broader market correction risk',
      'Sector rotation away from current leaders',
      'Global risk-off event (FII outflows)',
    ],
    technicals: {
      trend: score >= 65 ? 'Bullish' : 'Neutral',
      pattern: stockData?.breakoutPattern || 'Ascending Triangle',
      rsi: `${stockData?.rsi || 58} (${(stockData?.rsi || 58) > 70 ? 'Overbought' : (stockData?.rsi || 58) < 40 ? 'Oversold' : 'Neutral'})`,
      volume: `${stockData?.volumeBreakout || 1.2}x average (${(stockData?.volumeBreakout || 1.2) > 1.5 ? 'Strong breakout' : 'Moderate'})`,
      momentum: score >= 70 ? 'Strong' : score >= 50 ? 'Moderate' : 'Weak',
    },
  };
};

/**
 * Get AI market sentiment summary
 * Analyzes technical + macro data to generate market outlook
 */
export const getMarketSentiment = async (): Promise<{
  overall: 'Strongly Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Strongly Bearish';
  score: number;
  summary: string;
  factors: { name: string; value: string; sentiment: 'positive' | 'neutral' | 'negative'; weight: number }[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    overall: 'Bullish',
    score: 72,
    summary: 'Markets in moderate bullish phase. Banking + Auto leading. FII net buying ₹2,345 Cr. Market breadth 1.63:1 (healthy). Low VIX at 14.2 indicates favorable swing trading environment.',
    factors: [
      { name: 'FII Activity', value: '+₹2,345 Cr', sentiment: 'positive', weight: 85 },
      { name: 'DII Activity', value: '+₹890 Cr', sentiment: 'positive', weight: 72 },
      { name: 'Global Markets', value: 'S&P +0.4%', sentiment: 'positive', weight: 60 },
      { name: 'Market Breadth', value: '1.63:1 A/D', sentiment: 'positive', weight: 78 },
      { name: 'India VIX', value: '14.2 (Low)', sentiment: 'positive', weight: 80 },
      { name: 'USD/INR', value: '83.45 (Stable)', sentiment: 'neutral', weight: 55 },
    ],
  };
};

/**
 * Generate AI-powered trade journal insights
 */
export const getJournalInsights = async (trades: any[]): Promise<{
  overallRating: string;
  winRate: number;
  keyMistakes: string[];
  improvements: string[];
  bestTrade: string;
  worstTrade: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    overallRating: 'Above Average',
    winRate: 67,
    keyMistakes: [
      'FOMO entries — chasing breakouts 2.5%+ above ideal entry',
      'Early exits costing ₹3,500+ in potential profits',
      'No trailing stop on winning trades',
    ],
    improvements: [
      'Wait for pullback to 50-DMA before entry',
      'Use 1:3 risk/reward minimum for all trades',
      'Trail stops by 3% once 5% profit achieved',
      'Avoid trading during high VIX (>20) periods',
    ],
    bestTrade: 'HDFCBANK — disciplined entry, proper position sizing, followed the plan',
    worstTrade: 'TATASTEEL — FOMO entry, no edge, purely emotional trade',
  };
};
