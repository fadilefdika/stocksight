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
}

export default function CandlestickChart({ historicalData }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || historicalData.length === 0) return;
    console.log('ini ', historicalData);
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

    chart.timeScale().fitContent();

    const candleSeries = chart.addSeries(CandlestickSeries, { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });

    const formattedData = historicalData.map((item) => ({
      time: Math.floor(new Date(item.date).getTime() / 1000) as Time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candleSeries.setData(formattedData);

    const handleResize = () => {
      chart.resize(chartContainerRef.current!.clientWidth, 400);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [historicalData]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
