// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchStockPrediction(symbol: string) {
  const res = await fetch(`${BASE_URL}/api/stocks/predict/${symbol}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch stock ${symbol}: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function fetchStockHistory(symbol: string) {
  const res = await fetch(`${BASE_URL}/api/stocks/${symbol}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch stock history ${symbol}: ${res.status} ${errorText}`);
  }

  return res.json();
}
