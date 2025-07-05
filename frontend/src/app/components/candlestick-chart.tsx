'use client';

import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const CustomCandlestick = (props: any) => {
  const { payload, x, y, width, height } = props;
  if (!payload) return null;

  const { open, high, low, close, predicted } = payload;
  const isUp = close > open;
  const color = predicted ? (isUp ? '#a855f7' : '#7c3aed') : isUp ? '#10b981' : '#ef4444';
  const wickColor = predicted ? '#a855f7' : isUp ? '#10b981' : '#ef4444';

  const bodyHeight = Math.abs(close - open) * (height / (high - low));
  const bodyY = y + (high - Math.max(open, close)) * (height / (high - low));
  const wickX = x + width / 2;

  return (
    <g>
      {/* High-Low Wick */}
      <line x1={wickX} y1={y} x2={wickX} y2={y + height} stroke={wickColor} strokeWidth={1} opacity={predicted ? 0.8 : 1} />
      {/* Open-Close Body */}
      <rect x={x + 1} y={bodyY} width={width - 2} height={Math.max(bodyHeight, 1)} fill={color} stroke={color} strokeWidth={1} opacity={predicted ? 0.7 : 1} strokeDasharray={predicted ? '2,2' : '0'} />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const { open, high, low, close, volume, predicted } = data;
    const change = close - open;
    const changePercent = (change / open) * 100;

    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${predicted ? 'bg-purple-400' : close > open ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <p className="text-gray-300 text-sm font-medium">{label}</p>
          {predicted && <span className="text-purple-400 text-xs font-medium">PREDICTED</span>}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Open:</span>
            <span className="text-white font-mono">${open.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">High:</span>
            <span className="text-white font-mono">${high.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Low:</span>
            <span className="text-white font-mono">${low.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Close:</span>
            <span className="text-white font-mono">${close.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4 pt-1 border-t border-gray-700">
            <span className="text-gray-400">Change:</span>
            <span className={`font-mono ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}${change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
          {volume && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Volume:</span>
              <span className="text-white font-mono">{volume.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function CandlestickChart({ historicalData, predictionData }: CandlestickChartProps) {
  const allData = [...historicalData, ...predictionData];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={allData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="1 1" stroke="#333" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={11}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            tick={{ fill: '#666' }}
          />
          <YAxis stroke="#666" fontSize={11} tickFormatter={(value) => `$${value.toFixed(0)}`} tick={{ fill: '#666' }} domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip content={<CustomTooltip />} />

          {/* Custom Candlestick Bars */}
          <Bar dataKey="high" shape={<CustomCandlestick />} fill="transparent" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
