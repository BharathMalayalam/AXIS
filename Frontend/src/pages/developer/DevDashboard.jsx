import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, Clock, CheckCircle2, AlertCircle, Briefcase, 
  Send, ChevronRight, BarChart3,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DevDashboard = () => {
  const { currentUser, modules, getDevStats } = useApp();
  const [stats, setStats] = useState({ 
    totalModules: 0, pendingModules: 0, 
    submittedModules: 0, completedModules: 0 
  });

  useEffect(() => {
    getDevStats().then(s => { if (s) setStats(s); });
  }, [modules, getDevStats]);

  const myModules = (modules || []).filter(m => (m.assignedDev?._id || m.assignedDev) === currentUser?._id);

  const chartData = [
    { name: 'To-Do',     count: stats.pendingModules || 0,   fill: 'var(--warning)' },
    { name: 'Review',    count: stats.submittedModules || 0, fill: 'var(--primary)' },
    { name: 'Finished',  count: stats.completedModules || 0, fill: 'var(--success)' },
  ];

  const statCards = [
    { label: 'Assigned Work',  value: stats.totalModules || 0,    icon: <Layers size={22} />,      color: 'var(--primary)', bg: 'var(--primary-xlight)' },
    { label: 'To-Do Items',    value: stats.pendingModules || 0,  icon: <Clock size={22} />,       color: 'var(--warning)', bg: 'var(--warning-bg)' },
    { label: 'Under Review',   value: stats.submittedModules || 0,icon: <Briefcase size={22} />,   color: 'var(--accent)', bg: 'var(--accent-light)' },
    { label: 'Milestones',     value: stats.completedModules || 0,icon: <CheckCircle2 size={22} />,color: 'var(--success)', bg: 'var(--success-bg)' },
  ];

  const activeModules = myModules.filter(m => m.status !== 'completed');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Developer Hub</h1>
          <p className="page-subtitle">Welcome back, {currentUser?.name}. Focus on your top {activeModules.length} priorities today.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-pill">View Logs</button>
          <button className="btn btn-primary btn-pill"><Send size={16} /> Submit Module</button>
        </div>
      </div>

      <div className="stat-grid mb-4">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card stagger-1" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-icon mb-2" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid grid-2-1">
        <div className="glass-card chart-container">
          <div className="card-header">
            <div className="card-header-title">
              <h3>Sprint Distribution</h3>
              <p>Module breakdown by status</p>
            </div>
            <button className="btn-icon-sm"><BarChart3 size={16} /></button>
          </div>
          <div className="chart-wrap" style={{ height: 300 }}>
            {stats.totalModules > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-lg)'
                    }} 
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><AlertCircle size={28} /></div>
                <p className="empty-state-text">No active module data</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="card-header" style={{ padding: 0, marginBottom: '1.5rem', border: 'none' }}>
            <div className="card-header-title">
              <h3>Immediate Focus</h3>
              <p>Critical tasks requiring action</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {activeModules.length > 0 ? (
              activeModules.slice(0, 4).map(mod => (
                <div key={mod._id} className="p-3 glass-card" style={{ background: mod.status === 'rejected' ? 'var(--danger-bg)' : '#FAFBFC', borderLeft: mod.status === 'rejected' ? '4px solid var(--danger)' : '1px solid var(--border)' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-primary text-sm truncate" style={{ maxWidth: '140px' }}>{mod.name}</div>
                    <span className={`badge badge-${mod.status}`}>{mod.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Calendar size={12} />
                      <span>{mod.deadline ? new Date(mod.deadline).toLocaleDateString() : 'No deadline'}</span>
                    </div>
                    <button className="btn-icon-sm" style={{ width: 24, height: 24 }}><ChevronRight size={14} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-success" style={{ padding: '2rem', flexDirection: 'column', textAlign: 'center', marginBottom: 0 }}>
                <CheckCircle2 size={32} style={{ marginBottom: '1rem' }} />
                <h4 className="font-bold text-sm">Workspace Cleared</h4>
                <p className="text-xs opacity-80">All modules are completed or verified.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;
