import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Clock, CheckCircle2, AlertCircle, Briefcase, Send, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DevDashboard = () => {
  const { currentUser, modules, getDevStats } = useApp();
  const [stats, setStats] = useState({ totalModules: 0, pendingModules: 0, submittedModules: 0, completedModules: 0 });

  useEffect(() => {
    getDevStats().then(s => { if (s) setStats(s); });
  }, [modules]);

  const myModules = modules.filter(m => (m.assignedDev?._id || m.assignedDev) === currentUser?._id);

  const chartData = [
    { name: 'To-Do',     count: stats.pendingModules,   fill: '#FFAB00' },
    { name: 'Submitted', count: stats.submittedModules, fill: '#0052CC' },
    { name: 'Completed', count: stats.completedModules, fill: '#36B37E' },
  ];

  const statCards = [
    { label: 'Total Assigned',  value: stats.totalModules,    icon: <Layers size={20} />,      color: '#0052CC', bg: '#DEEBFF' },
    { label: 'To-Do / Rejected',value: stats.pendingModules,  icon: <Clock size={20} />,       color: '#FFAB00', bg: '#FFFAE6' },
    { label: 'Awaiting Review', value: stats.submittedModules,icon: <Briefcase size={20} />,   color: '#00B8D4', bg: '#E6FCFF' },
    { label: 'Finished Tasks',  value: stats.completedModules,icon: <CheckCircle2 size={20} />,color: '#36B37E', bg: '#E3FCEF' },
  ];

  const activeModules = myModules.filter(m => m.status !== 'completed');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Developer Dashboard</h1>
          <p className="page-subtitle">Track your assignments and overall progress.</p>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6B778C', background: '#fff', border: '1px solid #DFE1E6', borderRadius: '20px', padding: '0.375rem 1rem', fontWeight: '500' }}>
          👋 Welcome back, <strong style={{ color: '#172B4D' }}>{currentUser?.name}</strong>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }} className="dev-stats-grid">
        {statCards.map((card, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.375rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', borderTop: `3px solid ${card.color}`, transition: 'all 0.2s' }} className="stat-card-hover">
            <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#172B4D', lineHeight: 1.1, fontFamily: "'Outfit', sans-serif" }}>{card.value}</div>
              <div style={{ fontSize: '0.775rem', color: '#6B778C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }} className="dev-chart-grid">
        {/* Bar Chart */}
        <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#172B4D', marginBottom: '1.5rem' }}>Task Distribution</h3>
          {stats.totalModules > 0 ? (
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F5F7" vertical={false} />
                  <XAxis dataKey="name" stroke="#8993A4" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8993A4" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(9,30,66,0.04)' }}
                    contentStyle={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '6px', boxShadow: '0 4px 12px rgba(9,30,66,0.1)', fontSize: '12px' }}
                    itemStyle={{ color: '#172B4D' }}
                  />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state" style={{ height: '260px' }}>
              <AlertCircle style={{ width: '2rem', height: '2rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
              <p className="empty-state-text">No data to display</p>
            </div>
          )}
        </div>

        {/* Current Focus */}
        <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#172B4D', marginBottom: '1.25rem' }}>Current Focus</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeModules.slice(0, 4).map(mod => (
              <div key={mod._id} style={{
                padding: '0.875rem 1rem', borderRadius: '8px',
                background: mod.status === 'rejected' ? '#FFF5F5' : '#F8F9FC',
                border: `1px solid ${mod.status === 'rejected' ? '#FFBDAD' : '#EBECF0'}`,
                transition: 'all 0.2s',
              }} className="focus-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#172B4D', flex: 1, marginRight: '0.5rem' }}>{mod.name}</span>
                  <span className={`badge badge-${mod.status}`} style={{ fontSize: '0.65rem', flexShrink: 0 }}>{mod.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#6B778C' }}>
                  <Clock size={11} /> Due: {mod.deadline ? new Date(mod.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                </div>
              </div>
            ))}
            {activeModules.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle2 size={32} style={{ color: '#36B37E', opacity: 0.5, margin: '0 auto 0.75rem', display: 'block' }} />
                <p style={{ fontSize: '0.875rem', color: '#6B778C', fontWeight: '600' }}>All caught up! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .stat-card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(9,30,66,0.1) !important; }
        .focus-item:hover { border-color: #B3D4FF !important; background: #FAFBFF !important; }
        @media (max-width: 960px) {
          .dev-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dev-chart-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dev-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default DevDashboard;
