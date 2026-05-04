import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Layers, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TLDashboard = () => {
  const { currentUser, projects, modules, getTLStats } = useApp();
  const [stats, setStats] = useState({ totalProjects: 0, activeProjects: 0, totalModules: 0, pendingReview: 0, completedModules: 0 });

  useEffect(() => {
    getTLStats().then(s => { if (s) setStats(s); });
  }, [projects, modules]);

  const myProjects  = projects.filter(p => (p.assignedTL?._id || p.assignedTL) === currentUser?._id);
  const myProjectIds = myProjects.map(p => p._id);
  const myModules   = modules.filter(m => myProjectIds.includes(m.projectId?._id || m.projectId));

  const pieData = [
    { name: 'Completed',     value: stats.completedModules, color: '#36B37E' },
    { name: 'Pending Review', value: stats.pendingReview,  color: '#FFAB00' },
    { name: 'In Progress',   value: Math.max(0, stats.totalModules - stats.completedModules - stats.pendingReview), color: '#0052CC' },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: 'My Projects',     value: stats.totalProjects,   icon: <Briefcase size={20} />, color: '#0052CC', bg: '#DEEBFF' },
    { label: 'Total Modules',   value: stats.totalModules,    icon: <Layers size={20} />,    color: '#00B8D4', bg: '#E6FCFF' },
    { label: 'Pending Review',  value: stats.pendingReview,   icon: <Clock size={20} />,     color: '#FFAB00', bg: '#FFFAE6' },
    { label: 'Approved Modules',value: stats.completedModules,icon: <CheckCircle2 size={20} />,color: '#36B37E', bg: '#E3FCEF' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Leader Dashboard</h1>
          <p className="page-subtitle">Monitoring project modules and team performance.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }} className="tl-stats-grid">
        {statCards.map((card, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.375rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', borderTop: `3px solid ${card.color}`, transition: 'all 0.2s', cursor: 'default' }} className="stat-card-hover">
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

      {/* Charts + Roadmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="tl-chart-grid">
        {/* Pie Chart */}
        <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#172B4D', marginBottom: '1.5rem' }}>Module Completion Status</h3>
          {pieData.length > 0 ? (
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '6px', boxShadow: '0 4px 12px rgba(9,30,66,0.1)', fontSize: '12px' }}
                    itemStyle={{ color: '#172B4D' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '-1rem', flexWrap: 'wrap' }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: '#6B778C', fontWeight: '500' }}>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ height: '260px' }}>
              <AlertCircle style={{ width: '2rem', height: '2rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
              <p className="empty-state-text">No module data yet</p>
            </div>
          )}
        </div>

        {/* Project Roadmap */}
        <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#172B4D', marginBottom: '1.5rem' }}>Project Roadmap</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myProjects.length === 0 ? (
              <div className="empty-state" style={{ height: '200px' }}>
                <Briefcase style={{ width: '2rem', height: '2rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
                <p className="empty-state-text">No projects assigned yet.</p>
              </div>
            ) : (
              myProjects.slice(0, 4).map(proj => {
                const projModules  = myModules.filter(m => (m.projectId?._id || m.projectId) === proj._id);
                const completed    = projModules.filter(m => m.status === 'completed').length;
                const progress     = projModules.length > 0 ? Math.round((completed / projModules.length) * 100) : 0;
                const progressColor = progress >= 80 ? '#36B37E' : progress >= 40 ? '#0052CC' : '#FFAB00';

                return (
                  <div key={proj._id} style={{ padding: '1rem 1.25rem', borderRadius: '8px', background: '#F8F9FC', border: '1px solid #EBECF0', transition: 'all 0.2s' }} className="roadmap-item">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                      <div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#172B4D' }}>{proj.name}</span>
                        <div style={{ fontSize: '0.75rem', color: '#6B778C', marginTop: '1px' }}>{projModules.length} modules</div>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '800', color: progressColor }}>{progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#EBECF0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, height: '100%', background: progressColor, borderRadius: '3px', transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#8993A4' }}>
                      <span>{completed} done</span>
                      <span>{projModules.length - completed} remaining</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        .stat-card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(9,30,66,0.1) !important; }
        .roadmap-item:hover    { border-color: #B3D4FF !important; box-shadow: 0 2px 8px rgba(9,30,66,0.06); }
        @media (max-width: 960px) {
          .tl-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .tl-chart-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .tl-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default TLDashboard;
