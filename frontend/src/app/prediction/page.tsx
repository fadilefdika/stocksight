'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface StockData {
  symbol: string;
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export default function PredictionPage() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/stock/AAPL');
        setStockData(response.data);
      } catch (error) {
        console.error('Axios fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cegah error saat data masih null
  if (loading) return <p>Loading data...</p>;
  if (!stockData) return <p>Error fetching data</p>;

  return (
    <div>
      <h1>Prediksi Saham {stockData.symbol}</h1>
      <p>Tanggal: {stockData.date}</p>
      <p>Harga Pembukaan: {stockData.open}</p>
      <p>Harga Penutupan: {stockData.close}</p>
    </div>
  );
}
