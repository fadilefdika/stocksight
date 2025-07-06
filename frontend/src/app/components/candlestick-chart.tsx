'use client';

import { useEffect, useRef } from 'react';
import { CandlestickSeries, createChart, ColorType, Time } from 'lightweight-charts';
interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  predicted?: boolean;
}

interface CandlestickChartProps {
  historicalData: CandlestickData[];
  predictionData: CandlestickData[];
}

export default function CandlestickChart({ historicalData, predictionData }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  console.log('📊 Historical Data:', historicalData);
  console.log('🤖 Prediction Data:', predictionData);

  useEffect(() => {
    if (!chartContainerRef.current || historicalData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#111' },
        textColor: '#ccc',
      },
      grid: {
        vertLines: { color: '#333' },
        horzLines: { color: '#333' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const historicalSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      borderVisible: false,
    });

    const formattedHistorical = historicalData.map((item) => ({
      time: Math.floor(new Date(item.date).getTime() / 1000) as Time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    historicalSeries.setData(formattedHistorical);

    if (predictionData.length > 0) {
      const predictionSeries = chart.addSeries(CandlestickSeries, {
        upColor: 'rgba(126, 56, 191, 0.6)',
        downColor: 'rgba(126, 56, 191, 0.6)',
        wickUpColor: 'rgba(126, 56, 191, 0.6)',
        wickDownColor: 'rgba(126, 56, 191, 0.6)',
        borderVisible: false,
      });

      const formattedPrediction = predictionData.map((item) => ({
        time: Math.floor(new Date(item.date).getTime() / 1000) as Time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      predictionSeries.setData(formattedPrediction);
    }

    chart.timeScale().fitContent(); // ➜ Dipanggil terakhir agar prediction ikut

    const handleResize = () => {
      chart.resize(chartContainerRef.current!.clientWidth, 400);
      chart.timeScale().fitContent();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [historicalData, predictionData]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
