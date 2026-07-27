import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Clock, Users, ShieldAlert } from 'lucide-react';
import { analyticsAPI } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const [predictions, setPredictions] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [predRes, chartRes] = await Promise.all([
        analyticsAPI.getPredictions(1),
        analyticsAPI.getChartData(1)
      ]);
      setPredictions(predRes.data);
      setChartData(chartRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !predictions || !chartData) {
    return <div className="text-center py-16 text-xs text-slate-400 font-semibold">Calculating Predictive Analytics & Machine Learning Models...</div>;
  }

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
    },
  };

  const lineChartData = {
    labels: chartData.line_chart.labels,
    datasets: [
      {
        label: 'Crowd Count Trend',
        data: chartData.line_chart.data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: chartData.bar_chart.labels,
    datasets: [
      {
        label: 'Current Occupancy per Zone',
        data: chartData.bar_chart.data,
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" /> Predictive Analytics & Event Performance
        </h1>
        <p className="text-xs text-slate-400">Machine learning moving average & trend algorithms for crowd forecasting and venue planning.</p>
      </div>

      {/* 4 AI Prediction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-blue-500/30 bg-blue-950/20">
          <span className="text-xs font-semibold text-blue-400 block mb-1">Predicted Crowd (Next 30m)</span>
          <div className="text-3xl font-extrabold text-white mb-1">{predictions.predicted_crowd} Visitors</div>
          <p className="text-[10px] text-slate-400">Based on arrival velocity & scan logs</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/20">
          <span className="text-xs font-semibold text-emerald-400 block mb-1">Expected Peak Time</span>
          <div className="text-3xl font-extrabold text-white mb-1">{predictions.predicted_peak_time}</div>
          <p className="text-[10px] text-slate-400">Predicted highest density window</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-amber-950/20">
          <span className="text-xs font-semibold text-amber-400 block mb-1">Expected Waiting Time</span>
          <div className="text-3xl font-extrabold text-white mb-1">{predictions.predicted_waiting_time_min} Minutes</div>
          <p className="text-[10px] text-slate-400">Estimated gate queue throughput</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs font-semibold text-purple-400 block mb-1">Expected Occupancy</span>
          <div className="text-3xl font-extrabold text-white mb-1">{predictions.predicted_occupancy_pct}%</div>
          <p className="text-[10px] text-slate-400">Peak venue capacity forecast</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Live Crowd Density Trend (Line Chart)</h3>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Zone Capacity Breakdown (Bar Chart)</h3>
          <Bar data={barChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
