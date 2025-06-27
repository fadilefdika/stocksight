// lib/api.ts
export async function fetchStock(symbol: string) {
  const res = await fetch(`http://localhost:8000/${symbol}`, {
    cache: 'no-store', // agar tidak di-cache
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch stock ${symbol}`);
  }

  return res.json();
}
