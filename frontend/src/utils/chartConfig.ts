import { ChartOptions, ChartData } from 'chart.js';

export const chartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Prediksi Saham',
    },
  },
};

export const chartDataTemplate = (labels: string[], data: number[]): ChartData<'line'> => ({
  labels,
  datasets: [
    {
      label: 'Harga Saham',
      data,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
});
