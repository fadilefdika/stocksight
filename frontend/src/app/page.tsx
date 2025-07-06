'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Search, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CandlestickChart from './components/candlestick-chart';
import { fetchStockHistory, fetchStockPrediction } from '@/lib/api';

export default function StockPredictionApp() {
  const [symbol, setSymbol] = useState('AAPL');
  const [currentSymbol, setCurrentSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState<any[]>([]);
  const [predictData, setPredictData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchStockHistory(symbol);
        setStockData(result?.data || []);
      } catch (err) {
        console.error('❌ Error loading stock history', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setIsLoading(true);
    setCurrentSymbol(symbol.toUpperCase());

    try {
      const data = await fetchStockPrediction(symbol);
      setPredictData(data);
    } catch (err) {
      console.error('❌ Error loading stock prediction', err);
    } finally {
      setIsLoading(false);
    }
  };

  const lastDay = stockData.slice(-1)[0];
  const prevDay = stockData.slice(-2)[0];

  const currentPrice = lastDay?.close || 0;
  const priceChange = lastDay && prevDay ? lastDay.close - prevDay.close : 0;
  const priceChangePercent = lastDay && prevDay ? ((lastDay.close - prevDay.close) / prevDay.close) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">AI Stock Predictor</h1>
            <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
              TradingView Style
            </Badge>
          </div>
          <Badge variant="outline" className="border-gray-700 text-gray-300">
            LSTM Model
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
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

        {stockData.length > 0 && currentSymbol && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{currentSymbol}</h2>
                <p className="text-white">Candlestick Chart & AI Prediction</p>
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

            <Card className="bg-gray-900 border-gray-800 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-white">Candlestick Chart & AI Prediction</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500"></div>
                    <span className="text-gray-300">Bullish (Historical)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500"></div>
                    <span className="text-gray-300">Bearish (Historical)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 opacity-70"></div>
                    <span className="text-gray-300">AI Prediction</span>
                  </div>
                </div>
              </div>
              <CandlestickChart historicalData={stockData} predictionData={predictData} />
            </Card>
          </div>
        )}

        {stockData.length === 0 && !isLoading && (
          <Card className="bg-gray-900 border-gray-800 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Analyze Stock Charts</h3>
            <p className="text-gray-500">Enter a stock symbol above to get TradingView-style candlestick charts with AI predictions</p>
          </Card>
        )}
      </main>
    </div>
  );
}
