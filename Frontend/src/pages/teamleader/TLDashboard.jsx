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
    { label: 'Managed Modules', value: stats.totalModules || 0,    icon: <Layers size={22} />,    color: 'var(--accent)', bg: 'var(--accent-xlight)' },
    { label: 'Awaiting Review', value: stats.pendingReview || 0,   icon: <Clock size={22} />,     color: 'var(--warning)', bg: 'var(--warning-xlight)' },
    { label: 'Verified Work',   value: stats.completedModules || 0, icon: <CheckCircle2 size={22} />,color: 'var(--success)', bg: 'var(--success-xlight)' },
  ];

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Operations Dashboard</h1>
          <p className="page-subtitle">Welcome, {currentUser?.name}. You have {stats.pendingReview} modules awaiting verification.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-pill"><Filter size={18} /> Filter Views</button>
          <button className="btn btn-primary btn-pill"><TrendingUp size={18} /> Performance Report</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-grid grid-4 mb-xl">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card stat-card stagger-1" style={{ '--delay': `${i * 0.1}s` }}>
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <div className="stat-trend text-success">
                <ArrowUpRight size={14} />
                <span>+8%</span>
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
        {/* Module Health Pie */}
        <div className="glass-card chart-container">
          <div className="card-header">
            <div className="card-header-title">
              <h3>Module Velocity</h3>
              <p>Workload distribution across your projects</p>
            </div>
            <button className="btn-icon-sm"><MoreHorizontal size={16} /></button>
          </div>
          <div className="chart-wrapper" style={{ height: 320 }}>
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
              <div className="table-empty-state" style={{ height: '100%' }}>
                <div className="empty-icon"><AlertCircle size={40} /></div>
                <p>No module data available</p>
              </div>
            )}
          </div>
          <div className="pie-legend">
            {pieData.map((d, i) => (
              <div key={i} className="legend-item">
                <div className="legend-dot" style={{ background: d.color }} />
                <span className="legend-text">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap / Delivery */}
        <div className="glass-card roadmap-container">
          <div className="card-header">
            <div className="card-header-title">
              <h3>Project Roadmaps</h3>
              <p>Overall delivery progress</p>
            </div>
          </div>
          <div className="roadmap-list">
            {myProjects.length === 0 ? (
              <div className="table-empty-state">
                <div className="empty-icon"><Briefcase size={32} /></div>
                <p>No active projects</p>
              </div>
            ) : (
              myProjects.slice(0, 4).map(proj => {
                const projModules  = myModules.filter(m => (m.projectId?._id || m.projectId) === proj._id);
                const completed    = projModules.filter(m => m.status === 'completed').length;
                const progress     = projModules.length > 0 ? Math.round((completed / projModules.length) * 100) : 0;
                
                return (
                  <div key={proj._id} className="roadmap-item-premium">
                    <div className="roadmap-header">
                      <div className="roadmap-info">
                        <span className="roadmap-name">{proj.name}</span>
                        <span className="roadmap-count">{projModules.length} modules</span>
                      </div>
                      <span className="roadmap-percentage">{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progress}%`, background: progress >= 80 ? 'var(--success)' : 'var(--primary)' }}
                      ></div>
                    </div>
                  </div>
                );
              })
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
        .stat-trend { display: flex; align-items: center; gap: 0.25rem; font-size: 0.8125rem; font-weight: 700; padding: 0.25rem 0.5rem; background: rgba(255, 255, 255, 0.5); border-radius: 20px; }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; letter-spacing: -0.02em; }
        .stat-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 600; }

        .chart-container { padding: 1.5rem; }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
        .card-header-title h3 { font-size: 1.125rem; font-weight: 800; margin-bottom: 0.25rem; }
        .card-header-title p { font-size: 0.875rem; color: var(--text-muted); }

        .pie-legend { display: flex; justify-content: center; gap: 1.5rem; margin-top: 1rem; flex-wrap: wrap; }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
        .legend-text { font-size: 0.8125rem; color: var(--text-muted); font-weight: 600; }

        .roadmap-container { padding: 1.5rem; }
        .roadmap-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .roadmap-item-premium { padding: 1rem; background: #FAFBFC; border: 1px solid var(--border); border-radius: var(--radius-md); transition: var(--transition-base); }
        .roadmap-item-premium:hover { border-color: var(--primary-light); transform: scale(1.02); }
        .roadmap-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.75rem; }
        .roadmap-info { display: flex; flex-direction: column; }
        .roadmap-name { font-weight: 700; color: var(--text-primary); font-size: 0.9375rem; }
        .roadmap-count { font-size: 0.75rem; color: var(--text-muted); }
        .roadmap-percentage { font-weight: 800; color: var(--primary); font-size: 0.9375rem; }

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

export default TLDashboard;
