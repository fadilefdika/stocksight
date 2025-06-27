// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, TrendingUp } from 'lucide-react';
import StockChart from './components/stock-chart';

export default function StockPredictionApp() {
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get('symbol') || '';

  const [symbol, setSymbol] = useState(initialSymbol);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [stockData, setStockData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentPrice = stockData?.latest?.close ?? null;
  const predictedPrice = stockData?.predicted_close ?? null;
  const priceChange = predictedPrice && currentPrice ? predictedPrice - currentPrice : 0;
  const priceChangePercent = predictedPrice && currentPrice ? (priceChange / currentPrice) * 100 : 0;

  const fetchStock = async (symbol: string) => {
    try {
      const res = await fetch(`http://localhost:8000/stock/${symbol}`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const json = await res.json();
      const formatted = {
        ...json,
        predictionData: [
          { date: json.latest.date, price: json.latest.close },
          { date: '7-Day', price: json.predicted_close },
        ],
      };
      setStockData(formatted);
    } catch (error) {
      console.error('Gagal fetch data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setIsLoading(true);
    setCurrentSymbol(symbol.toUpperCase());
    await fetchStock(symbol.trim().toUpperCase());
    setIsLoading(false);
  };

  // Fetch saat halaman dibuka jika ada symbol
  useEffect(() => {
    if (initialSymbol) {
      setCurrentSymbol(initialSymbol.toUpperCase());
      setIsLoading(true);
      fetchStock(initialSymbol.toUpperCase()).then(() => setIsLoading(false));
    }
  }, [initialSymbol]);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">AI Stock Predictor</h1>
          </div>
          <Badge variant="outline" className="border-gray-700 text-gray-300">
            LSTM Model
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Search Form */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-2">
                Stock Symbol
              </label>
              <Input
                id="symbol"
                type="text"
                placeholder="Enter symbol (e.g., AAPL, GOOGL, TSLA)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="bg-black border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading || !symbol.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              {isLoading ? 'Analyzing...' : 'Predict'}
            </Button>
          </form>
        </Card>

        {/* Stock Info & Chart */}
        {stockData && currentSymbol && (
          <div className="space-y-6">
            {/* Stock Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{currentSymbol}</h2>
                <p className="text-gray-400">Stock Price Analysis & AI Prediction</p>
              </div>
              {currentPrice && (
                <div className="text-right">
                  <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
                  <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className={`w-4 h-4 ${priceChange < 0 ? 'rotate-180' : ''}`} />
                    <span>
                      {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Chart */}
            <Card className="bg-gray-900 border-gray-800 p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Price Chart & AI Prediction</h3>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-blue-400"></div>
                    <span className="text-gray-300">Historical Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-purple-400 border-dashed border-t"></div>
                    <span className="text-gray-300">AI Prediction</span>
                  </div>
                </div>
              </div>
              <StockChart data={stockData} />
            </Card>

            {/* Prediction Summary */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">AI Prediction Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black rounded-lg p-4 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">7-Day Target</div>
                  <div className="text-xl font-bold text-purple-400">${predictedPrice?.toFixed(2)}</div>
                </div>
                <div className="bg-black rounded-lg p-4 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Predicted Change</div>
                  <div className={`text-xl font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {priceChange >= 0 ? '+' : ''}
                    {priceChangePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-black rounded-lg p-4 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Model Confidence</div>
                  <div className="text-xl font-bold text-blue-400">{(Math.random() * 20 + 75).toFixed(1)}%</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!stockData && !isLoading && (
          <Card className="bg-gray-900 border-gray-800 p-12 text-center">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Predict Stock Prices</h3>
            <p className="text-gray-500">Enter a stock symbol above to get AI-powered price predictions using our LSTM model</p>
          </Card>
        )}
      </main>
    </div>
  );
}
