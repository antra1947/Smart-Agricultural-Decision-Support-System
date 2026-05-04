import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cloud, Droplets, Thermometer, FlaskConical, Bell, TrendingUp, Sprout, ShieldCheck, ArrowRight, Sun, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

const marketData = [
  { name: 'Mon', Wheat: 2100, Mustard: 4500, Rice: 3000 },
  { name: 'Tue', Wheat: 2150, Mustard: 4400, Rice: 3050 },
  { name: 'Wed', Wheat: 2120, Mustard: 4600, Rice: 2980 },
  { name: 'Thu', Wheat: 2200, Mustard: 4700, Rice: 3100 },
  { name: 'Fri', Wheat: 2180, Mustard: 4650, Rice: 3080 },
  { name: 'Sat', Wheat: 2250, Mustard: 4800, Rice: 3150 },
  { name: 'Sun', Wheat: 2300, Mustard: 4900, Rice: 3200 },
];

const moistureHistory = [
  { time: '6AM', value: 62 }, { time: '8AM', value: 60 }, { time: '10AM', value: 55 },
  { time: '12PM', value: 50 }, { time: '2PM', value: 47 }, { time: '4PM', value: 51 },
  { time: '6PM', value: 58 },
];

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-3`}>{icon}</div>
    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
    <p className="text-3xl font-extrabold text-slate-800 mt-1">{value}</p>
    {sub && <span className="text-xs mt-2 font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full">{sub}</span>}
  </div>
);

const Dashboard = () => {
  const [soilData, setSoilData] = useState({ moisture: '--', temperature: '--', pH: '--' });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('soilData', (data) => setSoilData(data));
    socket.on('smartAlert', (alert) => setAlerts(prev => [alert, ...prev].slice(0, 3)));
    return () => socket.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Farm Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Punjab, India • Sunday, May 3, 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Data
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
              <Bell className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="text-sm font-semibold text-amber-800">Smart Alert</p>
                <p className="text-sm text-amber-700">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Sensor Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Cloud size={24} className="text-blue-500" />} label="Weather" value="28°C" sub="Clear • Good for harvest" color="bg-blue-50" />
        <StatCard icon={<Droplets size={24} className="text-cyan-500" />} label="Soil Moisture" value={`${soilData.moisture}%`} color="bg-cyan-50" />
        <StatCard icon={<Thermometer size={24} className="text-rose-500" />} label="Soil Temp" value={`${soilData.temperature}°C`} color="bg-rose-50" />
        <StatCard icon={<FlaskConical size={24} className="text-purple-500" />} label="Soil pH" value={soilData.pH} color="bg-purple-50" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Market Prices */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Market Price Trends (₹/Quintal)</h2>
            <div className="flex gap-3 text-xs">
              {[{ color: 'bg-amber-400', label: 'Wheat' }, { color: 'bg-green-500', label: 'Mustard' }, { color: 'bg-blue-400', label: 'Rice' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  <span className="text-slate-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="Wheat" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Mustard" stroke="#22c55e" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Rice" stroke="#60a5fa" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-800">AI Recommendations</h2>
          {[
            { icon: <Sprout size={16} className="text-green-600" />, bg: 'bg-green-50 border-green-100', title: 'Crop Suggestion', text: 'Soil pH 6.5 — Mustard is highly recommended for the upcoming Rabi season.', color: 'text-green-800' },
            { icon: <Droplets size={16} className="text-blue-600" />, bg: 'bg-blue-50 border-blue-100', title: 'Irrigation Notice', text: 'No rain expected in 3 days. Activate drip irrigation for Field B tomorrow morning.', color: 'text-blue-800' },
            { icon: <ShieldCheck size={16} className="text-amber-600" />, bg: 'bg-amber-50 border-amber-100', title: 'Pest Alert', text: 'Aphid activity detected in nearby farms. Inspect Field C and apply neem oil spray.', color: 'text-amber-800' },
          ].map((r, i) => (
            <div key={i} className={`p-3 rounded-xl border ${r.bg}`}>
              <div className="flex items-center gap-2 mb-1">{r.icon}<h4 className={`font-semibold text-sm ${r.color}`}>{r.title}</h4></div>
              <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Moisture Trend + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 col-span-2">
          <h2 className="text-base font-bold text-slate-800 mb-4">Today's Soil Moisture Trend</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={moistureHistory}>
              <defs>
                <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[30, 80]} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} fill="url(#moistGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-800">Quick Access</h2>
          {[
            { to: '/disease', icon: <ShieldCheck size={18} className="text-red-500" />, label: 'Detect Crop Disease', sub: 'Upload or paste a photo', bg: 'bg-red-50' },
            { to: '/chat', icon: <Sprout size={18} className="text-green-600" />, label: 'Ask AI Assistant', sub: '12 languages supported', bg: 'bg-green-50' },
            { to: '/marketplace', icon: <TrendingUp size={18} className="text-blue-500" />, label: 'Sell Your Crops', sub: '12+ active listings', bg: 'bg-blue-50' },
            { to: '/farm', icon: <Sun size={18} className="text-amber-500" />, label: 'Farm Tasks', sub: 'Manage your schedule', bg: 'bg-amber-50' },
          ].map((item, i) => (
            <Link key={i} to={item.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group">
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400">{item.sub}</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500 transition" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
