import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, Layers, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, ArrowUpRight, TrendingUp, Filter, MoreHorizontal
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const TLDashboard = () => {
  const { currentUser, projects, modules, getTLStats } = useApp();
  const [stats, setStats] = useState({ 
    totalProjects: 0, activeProjects: 0, totalModules: 0, 
    pendingReview: 0, completedModules: 0 
  });

  useEffect(() => {
    getTLStats().then(s => { if (s) setStats(s); });
  }, [projects, modules, getTLStats]);

  const myProjects  = (projects || []).filter(p => (p.assignedTL?._id || p.assignedTL) === currentUser?._id);
  const myProjectIds = myProjects.map(p => p._id);
  const myModules   = (modules || []).filter(m => myProjectIds.includes(m.projectId?._id || m.projectId));

  const pieData = [
    { name: 'Completed',     value: stats.completedModules || 0, color: 'var(--success)' },
    { name: 'Reviewing',     value: stats.pendingReview || 0,  color: 'var(--warning)' },
    { name: 'In Progress',   value: Math.max(0, (stats.totalModules || 0) - (stats.completedModules || 0) - (stats.pendingReview || 0)), color: 'var(--primary)' },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: 'Active Projects', value: stats.totalProjects || 0,   icon: <Briefcase size={22} />, color: 'var(--primary)', bg: 'var(--primary-xlight)' },
    { label: 'Managed Modules', value: stats.totalModules || 0,    icon: <Layers size={22} />,    color: 'var(--accent)', bg: 'var(--accent-light)' },
    { label: 'Awaiting Review', value: stats.pendingReview || 0,   icon: <Clock size={22} />,     color: 'var(--warning)', bg: 'var(--warning-bg)' },
    { label: 'Verified Work',   value: stats.completedModules || 0, icon: <CheckCircle2 size={22} />,color: 'var(--success)', bg: 'var(--success-bg)' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Operations Dashboard</h1>
          <p className="page-subtitle">Welcome back, {currentUser?.name}. You have {stats.pendingReview} modules awaiting verification.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-pill"><Filter size={16} /> Filter Views</button>
          <button className="btn btn-primary btn-pill"><TrendingUp size={16} /> Performance Report</button>
        </div>
      </div>

      <div className="stat-grid mb-4">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card stagger-1" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex justify-between w-full items-center mb-2">
              <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-success" style={{ background: 'var(--success-bg)', padding: '4px 8px', borderRadius: '12px' }}>
                <ArrowUpRight size={12} /> +8%
              </div>
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
              <h3>Module Velocity</h3>
              <p>Workload distribution across your projects</p>
            </div>
            <button className="btn-icon-sm"><MoreHorizontal size={16} /></button>
          </div>
          <div className="chart-wrap" style={{ height: 300 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-lg)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-state-icon"><AlertCircle size={28} /></div>
                <p className="empty-state-text">No module data available</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                <span className="text-xs font-bold text-muted">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="card-header" style={{ padding: 0, marginBottom: '1.5rem', border: 'none' }}>
            <div className="card-header-title">
              <h3>Project Roadmaps</h3>
              <p>Overall delivery progress</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {myProjects.length === 0 ? (
              <div className="empty-state" style={{ padding: '1rem' }}>
                <div className="empty-state-icon"><Briefcase size={24} /></div>
                <p className="text-sm">No active projects</p>
              </div>
            ) : (
              myProjects.slice(0, 4).map(proj => {
                const projModules  = myModules.filter(m => (m.projectId?._id || m.projectId) === proj._id);
                const completed    = projModules.filter(m => m.status === 'completed').length;
                const progress     = projModules.length > 0 ? Math.round((completed / projModules.length) * 100) : 0;
                
                return (
                  <div key={proj._id} className="p-4 glass-card" style={{ background: '#FAFBFC' }}>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <div className="font-bold text-primary text-sm">{proj.name}</div>
                        <div className="text-xs text-muted">{projModules.length} modules</div>
                      </div>
                      <span className="font-bold text-primary text-sm">{progress}%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${progress}%`, background: progress >= 80 ? 'var(--success)' : 'var(--primary)' }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TLDashboard;
