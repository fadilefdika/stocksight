'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockChartProps {
  data: {
    latest: {
      symbol: string;
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    };
    predicted_close: number;
    predictionData: {
      date: string;
      price: number;
    }[];
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPredicted = data.predicted;

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPredicted ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
          <span className="text-white font-semibold">${payload[0].value.toFixed(2)}</span>
          {isPredicted && <span className="text-purple-400 text-xs font-medium">PREDICTED</span>}
        </div>
        {data.volume && <p className="text-gray-400 text-xs mt-1">Volume: {data.volume.toLocaleString()}</p>}
      </div>
    );
  }
  return null;
};

export default function StockChart({ data }: StockChartProps) {
  // Siapkan data historis (hanya latest dalam contoh ini)
  const historicalData = [
    {
      date: data.latest.date,
      price: data.latest.close,
      volume: data.latest.volume,
      predicted: false,
    },
  ];

  // Data prediksi
  const predictionData = data.predictionData.map((item) => ({
    ...item,
    predicted: true,
  }));

  // Gabungkan data historis dan prediksi
  const allData = [...historicalData, ...predictionData];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={allData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `$${value.toFixed(0)}`} />
          <Tooltip content={<CustomTooltip />} />

          {/* Historical line */}
          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls={false} data={historicalData} />

          {/* Prediction line */}
          <Line type="monotone" dataKey="price" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#a855f7', strokeWidth: 2, r: 3 }} connectNulls={false} data={predictionData} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
