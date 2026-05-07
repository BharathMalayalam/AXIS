import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, Clock, CheckCircle2, AlertCircle, Briefcase, 
  Send, ChevronRight, MoreHorizontal, Filter, BarChart3,
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
    { label: 'To-Do Items',    value: stats.pendingModules || 0,  icon: <Clock size={22} />,       color: 'var(--warning)', bg: 'var(--warning-xlight)' },
    { label: 'Under Review',   value: stats.submittedModules || 0,icon: <Briefcase size={22} />,   color: 'var(--accent)', bg: 'var(--accent-xlight)' },
    { label: 'Milestones',     value: stats.completedModules || 0,icon: <CheckCircle2 size={22} />,color: 'var(--success)', bg: 'var(--success-xlight)' },
  ];

  const activeModules = myModules.filter(m => m.status !== 'completed');

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Developer Hub</h1>
          <p className="page-subtitle">Welcome back, {currentUser?.name}. Focus on your top {activeModules.length} priorities today.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-pill"><Filter size={18} /> View Logs</button>
          <button className="btn btn-primary btn-pill"><Send size={18} /> Submit Module</button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="dashboard-grid grid-4 mb-xl">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card stat-card stagger-1" style={{ '--delay': `${i * 0.1}s` }}>
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <div className="stat-card-body">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-label">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid grid-2-1">
        {/* Task Distribution Bar */}
        <div className="glass-card chart-container">
          <div className="card-header">
            <div className="card-header-title">
              <h3>Sprint Distribution</h3>
              <p>Module breakdown by status</p>
            </div>
            <button className="btn-icon-sm"><BarChart3 size={16} /></button>
          </div>
          <div className="chart-wrapper" style={{ height: 320 }}>
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
              <div className="table-empty-state" style={{ height: '100%' }}>
                <div className="empty-icon"><AlertCircle size={40} /></div>
                <p>No active module data</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Focus List */}
        <div className="glass-card focus-container">
          <div className="card-header">
            <div className="card-header-title">
              <h3>Immediate Focus</h3>
              <p>Critical tasks requiring action</p>
            </div>
          </div>
          <div className="focus-list">
            {activeModules.length > 0 ? (
              activeModules.slice(0, 4).map(mod => (
                <div key={mod._id} className={`focus-item-premium ${mod.status === 'rejected' ? 'rejected' : ''}`}>
                  <div className="focus-header">
                    <span className="focus-name">{mod.name}</span>
                    <span className={`badge badge-${mod.status} badge-pill`}>{mod.status}</span>
                  </div>
                  <div className="focus-footer">
                    <div className="focus-meta">
                      <Calendar size={14} />
                      <span>{mod.deadline ? new Date(mod.deadline).toLocaleDateString() : 'No deadline'}</span>
                    </div>
                    <button className="btn-icon-xs"><ChevronRight size={14} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="all-clear glass">
                <CheckCircle2 size={40} className="success-icon" />
                <h4>Workspace Cleared</h4>
                <p>All modules are completed or verified.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .mb-xl { margin-bottom: 2rem; }
        .dashboard-grid { display: grid; gap: 1.5rem; }
        .grid-4 { grid-template-columns: repeat(4, 1fr); }
        .grid-2-1 { grid-template-columns: 2fr 1fr; }

        .stat-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .stat-card-header { display: flex; align-items: center; justify-content: space-between; }
        .stat-icon-wrapper { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; letter-spacing: -0.02em; }
        .stat-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 600; }

        .chart-container { padding: 1.5rem; }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
        .card-header-title h3 { font-size: 1.125rem; font-weight: 800; margin-bottom: 0.25rem; }
        .card-header-title p { font-size: 0.875rem; color: var(--text-muted); }

        .focus-container { padding: 1.5rem; }
        .focus-list { display: flex; flex-direction: column; gap: 1rem; }
        .focus-item-premium { padding: 1rem; background: #FAFBFC; border: 1px solid var(--border); border-radius: var(--radius-md); transition: var(--transition-base); }
        .focus-item-premium:hover { border-color: var(--primary-light); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
        .focus-item-premium.rejected { border-left: 4px solid var(--danger); background: #FFF5F5; }
        
        .focus-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
        .focus-name { font-weight: 700; color: var(--text-primary); font-size: 0.9375rem; }
        
        .focus-footer { display: flex; justify-content: space-between; align-items: center; }
        .focus-meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-muted); }
        
        .all-clear { padding: 2.5rem 1.5rem; text-align: center; border-radius: var(--radius-lg); }
        .success-icon { color: var(--success); margin: 0 auto 1rem; opacity: 0.8; }
        .all-clear h4 { font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; }
        .all-clear p { font-size: 0.8125rem; color: var(--text-muted); }

        .btn-icon-xs { width: 24px; height: 24px; border-radius: 6px; background: white; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; }

        @media (max-width: 1200px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
          .grid-2-1 { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .grid-4 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default DevDashboard;
