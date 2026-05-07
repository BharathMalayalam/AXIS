import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase, Users, UserCheck, CheckCircle2, Clock,
  TrendingUp, Plus, Calendar, BarChart3, Activity,
  ChevronRight, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Filter, Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { projects, users, getAdminStats } = useApp();
  const [stats, setStats] = useState({
    totalProjects: 0, activeProjects: 0, completedProjects: 0,
    pendingApproval: 0, totalTLs: 0, totalDevs: 0
  });

  useEffect(() => {
    getAdminStats()
      .then(d => { 
        if (d) setStats(d); 
      })
      .catch(err => {
        console.error('Failed to fetch admin stats:', err);
      });
  }, [getAdminStats]);

  const chartData = [
    { name: 'Mon', projects: 4 },
    { name: 'Tue', projects: 7 },
    { name: 'Wed', projects: 5 },
    { name: 'Thu', projects: 9 },
    { name: 'Fri', projects: 12 },
    { name: 'Sat', projects: 8 },
    { name: 'Sun', projects: stats?.totalProjects || 0 },
  ];

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeUsers    = Array.isArray(users) ? users : [];

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects || 0,   trend: '+12%', trendUp: true, icon: <Briefcase size={22} />,    color: 'var(--primary)', bg: 'var(--primary-xlight)' },
    { label: 'Active Modules', value: stats.activeProjects || 0,  trend: '+5%',  trendUp: true, icon: <Activity size={22} />,     color: 'var(--accent)', bg: 'var(--accent-xlight)' },
    { label: 'Completed',      value: stats.completedProjects || 0, trend: '+18%', trendUp: true, icon: <CheckCircle2 size={22} />,color: 'var(--success)', bg: 'var(--success-xlight)' },
    { label: 'Pending Review', value: stats.pendingApproval || 0, trend: '-2%',   trendUp: false, icon: <Clock size={22} />,      color: 'var(--warning)', bg: 'var(--warning-xlight)' },
  ];

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Executive Overview</h1>
          <p className="page-subtitle">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-pill">
            <Download size={18} /> Export Report
          </button>
          <button className="btn btn-primary btn-pill">
            <Plus size={18} /> New Project
          </button>
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
              <div className="stat-trend" style={{ color: card.trendUp ? 'var(--success)' : 'var(--danger)' }}>
                {card.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{card.trend}</span>
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
      <div className="dashboard-grid grid-2-1 mb-xl">
        {/* Performance Chart */}
        <div className="glass-card chart-container">
          <div className="card-header">
            <div className="card-header-title">
              <h3>System Performance</h3>
              <p>Project throughput over the last 7 days</p>
            </div>
            <div className="card-header-actions">
              <button className="btn-icon-sm"><Filter size={16} /></button>
              <button className="btn-icon-sm"><MoreHorizontal size={16} /></button>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#performanceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resources / Health */}
        <div className="glass-card health-container">
          <div className="card-header">
            <div className="card-header-title">
              <h3>Fleet Status</h3>
              <p>Real-time system health</p>
            </div>
          </div>
          <div className="health-list">
            {[
              { label: 'Cloud Resources', value: '42%', progress: 42, color: 'var(--primary)' },
              { label: 'Active Developers', value: '88%', progress: 88, color: 'var(--success)' },
              { label: 'Storage Used', value: '15%', progress: 15, color: 'var(--warning)' },
            ].map((item, i) => (
              <div key={i} className="health-item">
                <div className="health-item-info">
                  <span className="health-label">{item.label}</span>
                  <span className="health-value">{item.value}</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${item.progress}%`, background: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="health-footer-alert glass">
            <Activity size={20} className="pulse-icon" />
            <div>
              <p className="alert-title">All systems go</p>
              <p className="alert-text">No incidents reported in 48h.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass-card table-card overflow-hidden">
        <div className="card-header">
          <div className="card-header-title">
            <h3>Active Project Pipeline</h3>
            <p>Real-time status of all ongoing initiatives</p>
          </div>
          <button className="btn btn-ghost btn-sm">View Pipeline <ChevronRight size={16} /></button>
        </div>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Project Identifier</th>
                <th>Assigned Lead</th>
                <th>Phase</th>
                <th>Launch Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeProjects.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="table-empty-state">
                      <div className="empty-icon"><Briefcase size={40} /></div>
                      <h4>No projects found</h4>
                      <p>Start by creating a new project to track progress.</p>
                      <button className="btn btn-primary mt-md">Create Project</button>
                    </div>
                  </td>
                </tr>
              ) : (
                [...safeProjects].reverse().slice(0, 5).map(proj => (
                  <tr key={proj._id}>
                    <td>
                      <div className="project-cell">
                        <span className="project-name">{proj.name || 'Untitled Project'}</span>
                        <span className="project-id">#{proj._id ? proj._id.slice(-6).toUpperCase() : 'XXXXXX'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-xs">
                          {(safeUsers.find(u => u._id === (proj.assignedTL?._id || proj.assignedTL))?.name || 'U')[0]}
                        </div>
                        <span className="user-name-cell">
                          {safeUsers.find(u => u._id === (proj.assignedTL?._id || proj.assignedTL))?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${proj.status || 'pending'} badge-pill`}>
                        {(proj.status || 'pending').replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="date-cell">
                        <Calendar size={14} />
                        {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : 'No date'}
                      </div>
                    </td>
                    <td>
                      <button className="btn-icon-sm"><MoreHorizontal size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .mb-xl { margin-bottom: 2rem; }
        .dashboard-grid { display: grid; gap: 1.5rem; }
        .grid-4 { grid-template-columns: repeat(4, 1fr); }
        .grid-2-1 { grid-template-columns: 2fr 1fr; }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8125rem;
          font-weight: 700;
          padding: 0.25rem 0.5rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 20px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .chart-container { padding: 1.5rem; }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .card-header-title h3 { font-size: 1.125rem; font-weight: 800; margin-bottom: 0.25rem; }
        .card-header-title p { font-size: 0.875rem; color: var(--text-muted); }

        .health-container { padding: 1.5rem; display: flex; flex-direction: column; }
        .health-list { display: flex; flex-direction: column; gap: 1.5rem; flex: 1; }
        
        .health-item-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .health-footer-alert {
          margin-top: 2rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--success-xlight);
          border: 1px solid var(--success-light);
          border-radius: var(--radius-md);
        }

        .pulse-icon { color: var(--success); animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        .alert-title { font-size: 0.875rem; font-weight: 800; color: var(--success-dark); }
        .alert-text { font-size: 0.75rem; color: var(--success-dark); opacity: 0.8; }

        /* Table Styles */
        .modern-table { width: 100%; border-collapse: collapse; }
        .modern-table th {
          text-align: left;
          padding: 1rem 1.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
        }

        .modern-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
        .modern-table tr:last-child td { border-bottom: none; }

        .project-cell { display: flex; flex-direction: column; }
        .project-name { font-weight: 700; color: var(--text-primary); }
        .project-id { font-size: 0.75rem; color: var(--text-muted); }

        .user-cell { display: flex; align-items: center; gap: 0.75rem; }
        .user-avatar-xs {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .badge-pill { border-radius: 20px; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 700; }
        
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

export default AdminDashboard;
