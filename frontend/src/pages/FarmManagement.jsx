import React, { useState } from 'react';
import { Plus, Trash2, Edit3, CheckCircle, Clock, AlertCircle, Sprout, Droplets, Calendar, X, ChevronRight } from 'lucide-react';

const INITIAL_TASKS = [
  { id: 1, title: 'Apply NPK fertilizer to Field A', field: 'Field A (Wheat)', due: '2026-05-05', priority: 'high', status: 'pending' },
  { id: 2, title: 'Irrigate Field B — drip system check', field: 'Field B (Rice)', due: '2026-05-04', priority: 'medium', status: 'done' },
  { id: 3, title: 'Spray neem oil for aphid control', field: 'Field C (Mustard)', due: '2026-05-06', priority: 'high', status: 'pending' },
  { id: 4, title: 'Soil pH testing — send samples to lab', field: 'All Fields', due: '2026-05-10', priority: 'low', status: 'pending' },
  { id: 5, title: 'Harvest Field A — wheat ready', field: 'Field A (Wheat)', due: '2026-05-15', priority: 'high', status: 'pending' },
];

const FIELDS = [
  { id: 1, name: 'Field A', crop: 'Wheat', area: '5 acres', stage: 'Maturity', health: 92, moisture: 58, nextAction: 'Harvest in 12 days' },
  { id: 2, name: 'Field B', crop: 'Basmati Rice', area: '3 acres', stage: 'Tillering', health: 78, moisture: 72, nextAction: 'Fertilize in 3 days' },
  { id: 3, name: 'Field C', crop: 'Mustard', area: '4 acres', stage: 'Flowering', health: 85, moisture: 45, nextAction: 'Irrigate today' },
];

const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

const HealthBar = ({ value, color = 'green' }) => (
  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
    <div className={`h-full rounded-full bg-${color}-500 transition-all`} style={{ width: `${value}%` }} />
  </div>
);

const AddTaskModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ title: '', field: 'Field A (Wheat)', due: '', priority: 'medium' });
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ id: Date.now(), ...form, status: 'pending' });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Add Farm Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task Description</label>
            <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Apply fertilizer to Field A" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Field</label>
              <select value={form.field} onChange={e => setForm(p => ({ ...p, field: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                {['Field A (Wheat)', 'Field B (Rice)', 'Field C (Mustard)', 'All Fields'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input required type="date" value={form.due} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">Add Task</button>
        </form>
      </div>
    </div>
  );
};

const FarmManagement = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const pending = tasks.filter(t => t.status === 'pending');
  const done = tasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-6">
      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onAdd={t => setTasks(p => [t, ...p])} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Farm Management</h1>
          <p className="text-slate-500 mt-1">Track your fields, tasks, and crop schedules.</p>
        </div>
        <button onClick={() => setShowAddTask(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition">
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Fields', value: FIELDS.length, icon: <Sprout size={20} className="text-green-600" />, bg: 'bg-green-50' },
          { label: 'Pending Tasks', value: pending.length, icon: <Clock size={20} className="text-amber-600" />, bg: 'bg-amber-50' },
          { label: 'Completed', value: done.length, icon: <CheckCircle size={20} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'High Priority', value: pending.filter(t => t.priority === 'high').length, icon: <AlertCircle size={20} className="text-red-600" />, bg: 'bg-red-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['tasks', 'fields'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab === 'tasks' ? '📋 Tasks' : '🌾 Fields'}
          </button>
        ))}
      </div>

      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {tasks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Calendar size={40} className="mx-auto mb-3 opacity-30" />
              <p>No tasks yet. Add your first farm task!</p>
            </div>
          )}
          {tasks.map(task => (
            <div key={task.id} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 transition-all ${task.status === 'done' ? 'opacity-60 border-slate-100' : 'border-slate-100 hover:shadow-md'}`}>
              <button onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-green-400'}`}>
                {task.status === 'done' && <CheckCircle size={14} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-slate-800 text-sm ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>{task.title}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-slate-400">{task.field}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={10} /> {task.due}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'fields' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FIELDS.map(field => (
            <div key={field.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{field.name}</h3>
                  <p className="text-green-600 font-semibold text-sm">{field.crop}</p>
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">{field.area}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Crop Health</span>
                    <span className="font-semibold text-slate-700">{field.health}%</span>
                  </div>
                  <HealthBar value={field.health} color="green" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Soil Moisture</span>
                    <span className="font-semibold text-slate-700">{field.moisture}%</span>
                  </div>
                  <HealthBar value={field.moisture} color="blue" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div>
                  <p className="text-xs text-slate-400">Growth Stage</p>
                  <p className="text-sm font-semibold text-slate-700">{field.stage}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Next Action</p>
                  <p className="text-xs font-semibold text-amber-600">{field.nextAction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmManagement;
