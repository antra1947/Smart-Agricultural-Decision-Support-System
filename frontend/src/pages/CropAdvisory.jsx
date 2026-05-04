import React, { useState } from 'react';
import { CloudRain, Sun, Wind, Droplet, Thermometer, AlertTriangle, CheckCircle, Sprout, Calendar } from 'lucide-react';

const WEEKLY = [
  { day: 'Today', temp: '28°C', low: '19°C', icon: <CloudRain size={20} className="text-blue-500" />, desc: 'Light Rain', humidity: 78 },
  { day: 'Tomorrow', temp: '26°C', low: '18°C', icon: <CloudRain size={20} className="text-blue-400" />, desc: 'Showers', humidity: 82 },
  { day: 'Wednesday', temp: '28°C', low: '20°C', icon: <Sun size={20} className="text-amber-500" />, desc: 'Partly Cloudy', humidity: 65 },
  { day: 'Thursday', temp: '29°C', low: '21°C', icon: <Sun size={20} className="text-amber-500" />, desc: 'Sunny', humidity: 55 },
  { day: 'Friday', temp: '31°C', low: '22°C', icon: <Sun size={20} className="text-amber-500" />, desc: 'Clear', humidity: 48 },
  { day: 'Saturday', temp: '30°C', low: '21°C', icon: <Sun size={20} className="text-amber-400" />, desc: 'Sunny', humidity: 50 },
  { day: 'Sunday', temp: '27°C', low: '19°C', icon: <CloudRain size={20} className="text-blue-400" />, desc: 'Cloudy', humidity: 70 },
];

const ADVISORIES = [
  { priority: 'high', icon: <AlertTriangle size={16} className="text-red-500" />, bg: 'bg-red-50 border-red-200', title: 'Halt Pesticide Spraying', desc: 'Rain expected in next 48 hours will wash away chemicals. Wait for a dry window of at least 48 hours before spraying.', tag: 'Urgent' },
  { priority: 'high', icon: <Droplet size={16} className="text-blue-500" />, bg: 'bg-blue-50 border-blue-200', title: 'Pause Irrigation', desc: 'Soil moisture is at optimal levels (78%) and rain is imminent. Save groundwater and electricity — skip next 2 irrigation cycles.', tag: 'Water Saving' },
  { priority: 'medium', icon: <Sprout size={16} className="text-green-600" />, bg: 'bg-green-50 border-green-200', title: 'Ideal Sowing Window', desc: 'Post-rain period (Thursday–Friday) is ideal for sowing mustard and wheat. Soil will have optimal moisture for germination.', tag: 'Opportunity' },
  { priority: 'medium', icon: <AlertTriangle size={16} className="text-amber-500" />, bg: 'bg-amber-50 border-amber-200', title: 'Fungal Disease Risk', desc: 'High humidity (78%) combined with warm temperatures creates conditions for fungal diseases. Inspect crops daily and apply preventive copper fungicide if needed.', tag: 'Watch Out' },
  { priority: 'low', icon: <CheckCircle size={16} className="text-teal-500" />, bg: 'bg-teal-50 border-teal-200', title: 'Harvest Window — Wheat', desc: 'Clear weather from Thursday onwards provides a 3-day harvest window for mature wheat crops. Ensure combine harvester is serviced and ready.', tag: 'Planning' },
];

const CROP_CALENDAR = [
  { crop: 'Wheat (Rabi)', sow: 'Oct–Nov', harvest: 'Mar–Apr', status: 'active', note: 'Currently in maturity stage' },
  { crop: 'Mustard (Rabi)', sow: 'Oct–Nov', harvest: 'Feb–Mar', status: 'done', note: 'Harvest complete' },
  { crop: 'Rice (Kharif)', sow: 'Jun–Jul', harvest: 'Oct–Nov', status: 'upcoming', note: 'Prepare nursery in June' },
  { crop: 'Maize (Kharif)', sow: 'Jun–Jul', harvest: 'Sep–Oct', status: 'upcoming', note: 'Order seeds by May end' },
  { crop: 'Soybean (Kharif)', sow: 'Jun–Jul', harvest: 'Sep–Oct', status: 'upcoming', note: 'Good market prices expected' },
];

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  done: 'bg-slate-100 text-slate-500',
  upcoming: 'bg-blue-100 text-blue-700',
};

const CropAdvisory = () => {
  const [activeTab, setActiveTab] = useState('advisory');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Weather-Based Advisory</h1>
        <p className="text-slate-500 mt-1">Localized weather patterns and automated agronomic recommendations.</p>
      </div>

      {/* Current Weather Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
        <CloudRain className="absolute -right-8 -top-8 text-white/10" size={180} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CloudRain size={32} className="text-blue-200" />
              <h2 className="text-5xl font-extrabold">28°C</h2>
            </div>
            <p className="text-blue-100 text-lg font-medium">Light Rain Expected</p>
            <p className="text-blue-300 text-sm mt-2">Punjab, India • Updated just now</p>
          </div>
          <div className="flex gap-8">
            {[
              { icon: <Droplet size={22} />, value: '78%', label: 'Humidity' },
              { icon: <Wind size={22} />, value: '12 km/h', label: 'Wind' },
              { icon: <Thermometer size={22} />, value: '19°C', label: 'Feels Like' },
              { icon: <Sun size={22} />, value: 'High', label: 'UV Index' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-blue-200 mb-1 flex justify-center">{s.icon}</div>
                <div className="font-bold text-white">{s.value}</div>
                <div className="text-xs text-blue-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-base font-bold text-slate-800 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {WEEKLY.map((day, i) => (
            <div key={i} className={`flex flex-col items-center p-3 rounded-xl text-center transition ${i === 0 ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'}`}>
              <p className="text-xs font-semibold text-slate-500 mb-2">{day.day}</p>
              {day.icon}
              <p className="font-bold text-slate-800 text-sm mt-2">{day.temp}</p>
              <p className="text-xs text-slate-400">{day.low}</p>
              <p className="text-xs text-slate-400 mt-1 hidden sm:block">{day.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[{ key: 'advisory', label: '📋 Advisories' }, { key: 'calendar', label: '📅 Crop Calendar' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'advisory' && (
        <div className="space-y-3">
          {ADVISORIES.map((a, i) => (
            <div key={i} className={`border rounded-2xl p-4 ${a.bg}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">{a.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-slate-800 text-sm">{a.title}</h4>
                    <span className="text-xs bg-white/70 border border-current/20 px-2 py-0.5 rounded-full font-medium opacity-80">{a.tag}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Crop', 'Sowing', 'Harvest', 'Status', 'Note'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {CROP_CALENDAR.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-semibold text-slate-800">{row.crop}</td>
                  <td className="px-5 py-4 text-slate-600">{row.sow}</td>
                  <td className="px-5 py-4 text-slate-600">{row.harvest}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[row.status]}`}>{row.status}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CropAdvisory;
