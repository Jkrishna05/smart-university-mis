import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartTypes = { bar: Bar, pie: Pie, line: Line, doughnut: Doughnut };

const defaultColors = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(139, 92, 246, 0.8)',
  'rgba(6, 182, 212, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(249, 115, 22, 0.8)'
];

const ChartWidget = ({ type = 'bar', title, labels, datasets, height = 300 }) => {
  const ChartComponent = chartTypes[type];

  const chartData = {
    labels,
    datasets: datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || (type === 'pie' || type === 'doughnut' ? defaultColors : defaultColors[i]),
      borderColor: ds.borderColor || defaultColors[i]?.replace('0.8', '1'),
      borderWidth: ds.borderWidth || (type === 'line' ? 2 : 1),
      borderRadius: type === 'bar' ? 8 : undefined,
      fill: type === 'line' ? { target: 'origin', above: defaultColors[i]?.replace('0.8', '0.1') } : undefined,
      tension: type === 'line' ? 0.4 : undefined,
      pointRadius: type === 'line' ? 4 : undefined,
      pointHoverRadius: type === 'line' ? 6 : undefined
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === 'pie' || type === 'doughnut' ? 'bottom' : 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { family: 'Inter', size: 12 }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: { family: 'Inter', size: 16, weight: '600' },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: type === 'pie' || type === 'doughnut' ? {} : {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { font: { family: 'Inter', size: 11 } }, beginAtZero: true }
    }
  };

  return (
    <div className="glass-card p-6">
      <div style={{ height }}>
        <ChartComponent data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ChartWidget;
