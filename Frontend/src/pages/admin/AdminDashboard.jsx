import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Briefcase, CheckCircle2, Clock,
  Plus, Activity,
  ChevronRight, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Filter, Download, Users, UserCheck, Layers, ShieldCheck,
  TrendingUp, Zap, Calendar, ExternalLink
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { projects, users, getAdminStats } = useApp();
  const navigate = useNavigate();
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
  const teamLeaders  = safeUsers.filter(u => u.role === 'teamleader');
  const developers   = safeUsers.filter(u => u.role === 'developer');

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects || 0,   trend: '+12%', trendUp: true, icon: <Briefcase size={20} />,    color: 'var(--primary)', bg: 'var(--primary-xlight)', link: '/admin/projects' },
    { label: 'Active Modules', value: stats.activeProjects || 0,  trend: '+5%',  trendUp: true, icon: <Activity size={20} />,     color: 'var(--accent)', bg: 'var(--accent-light)', link: '/admin/projects' },
    { label: 'Completed',      value: stats.completedProjects || 0, trend: '+18%', trendUp: true, icon: <CheckCircle2 size={20} />,color: 'var(--success)', bg: 'var(--success-bg)', link: '/admin/approval' },
    { label: 'Pending Review', value: stats.pendingApproval || 0, trend: '-2%',   trendUp: false, icon: <Clock size={20} />,      color: 'var(--warning)', bg: 'var(--warning-bg)', link: '/admin/approval' },
  ];

  // Quick action cards for the overview
  const quickActions = [
    { label: 'Create Project', icon: <Plus size={18} />, action: () => navigate('/admin/projects'), color: 'var(--primary)', bg: 'var(--primary-xlight)' },
    { label: 'Manage Leads', icon: <UserCheck size={18} />, action: () => navigate('/admin/team-leaders'), color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Manage Devs', icon: <Users size={18} />, action: () => navigate('/admin/team-members'), color: 'var(--accent)', bg: 'var(--accent-light)' },
    { label: 'Approvals', icon: <ShieldCheck size={18} />, action: () => navigate('/admin/approval'), color: 'var(--warning)', bg: 'var(--warning-bg)' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Overview</h1>
          <p className="page-subtitle">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-pill">
            <Download size={16} /> Export Report
          </button>
          <button className="btn btn-primary btn-pill" onClick={() => navigate('/admin/projects')}>
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid mb-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="stat-card stat-card-clickable stagger-1"
            style={{ animationDelay: `${i * 0.1}s`, cursor: 'pointer' }}
            onClick={() => navigate(card.link)}
          >
            <div className="flex justify-between w-full items-center mb-2">
              <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold" style={{ color: card.trendUp ? 'var(--success)' : 'var(--danger)', background: card.trendUp ? 'var(--success-bg)' : 'var(--danger-bg)', padding: '4px 8px', borderRadius: '12px' }}>
                {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.trend}
              </div>
            </div>
            <div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid mb-4">
        {quickActions.map((action, i) => (
          <button
            key={i}
            className="quick-action-card"
            onClick={action.action}
          >
            <div className="quick-action-icon" style={{ background: action.bg, color: action.color }}>
              {action.icon}
            </div>
            <span className="quick-action-label">{action.label}</span>
            <ChevronRight size={14} className="quick-action-arrow" />
          </button>
        ))}
      </div>

      {/* Chart + Fleet Status */}
      <div className="dashboard-grid grid-2-1 mb-4">
        <div className="glass-card chart-container">
          <div className="card-header">
            <div className="card-header-title">
              <h3>System Performance</h3>
              <p>Project throughput over the last 7 days</p>
            </div>
            <div className="card-actions">
              <button className="btn-icon-sm"><Filter size={16} /></button>
              <button className="btn-icon-sm"><MoreHorizontal size={16} /></button>
            </div>
          </div>
          <div className="chart-wrap">
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

        <div className="glass-card p-4">
          <div className="card-header" style={{ padding: 0, marginBottom: '1.5rem', border: 'none' }}>
            <div className="card-header-title">
              <h3>Fleet Status</h3>
              <p>Real-time system health</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Team Leaders', value: `${teamLeaders.length}`, progress: Math.min(teamLeaders.length * 20, 100), color: 'var(--primary)' },
              { label: 'Active Developers', value: `${developers.length}`, progress: Math.min(developers.length * 10, 100), color: 'var(--success)' },
              { label: 'Project Completion', value: `${stats.totalProjects > 0 ? Math.round(((stats.completedProjects || 0) / stats.totalProjects) * 100) : 0}%`, progress: stats.totalProjects > 0 ? Math.round(((stats.completedProjects || 0) / stats.totalProjects) * 100) : 0, color: 'var(--warning)' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-secondary">{item.label}</span>
                  <span className="text-sm font-bold text-primary">{item.value}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${item.progress}%`, background: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="alert alert-success mt-4" style={{ marginBottom: 0 }}>
            <Activity size={18} className="animate-pulse" />
            <div>
              <p className="font-bold text-xs" style={{ marginBottom: '2px' }}>All systems go</p>
              <p className="text-xs opacity-80">No incidents reported in 48h.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Project Pipeline */}
      <div className="table-container">
        <div className="card-header">
          <div className="card-header-title">
            <h3>Active Project Pipeline</h3>
            <p>Real-time status of all ongoing initiatives</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/projects')}>
            View All <ChevronRight size={16} />
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Project Identifier</th>
              <th>Assigned Lead</th>
              <th>Phase</th>
              <th>Launch Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeProjects.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="empty-state-icon"><Briefcase size={28} /></div>
                    <p className="empty-state-title">No projects found</p>
                    <p className="empty-state-text">Start by creating a new project to track progress.</p>
                    <button className="btn btn-primary btn-pill mt-4" onClick={() => navigate('/admin/projects')}>
                      <Plus size={16} /> Create First Project
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              [...safeProjects].reverse().slice(0, 5).map(proj => (
                <tr key={proj._id}>
                  <td>
                    <div>
                      <div className="font-bold text-primary">{proj.name || 'Untitled Project'}</div>
                      <div className="text-xs text-muted">#{proj._id ? proj._id.slice(-6).toUpperCase() : 'XXXXXX'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="user-pill">
                      <div className="avatar avatar-xs avatar-primary">
                        {(safeUsers.find(u => u._id === (proj.assignedTL?._id || proj.assignedTL))?.name || 'U')[0]}
                      </div>
                      <span className="text-sm">
                        {safeUsers.find(u => u._id === (proj.assignedTL?._id || proj.assignedTL))?.name || 'Unassigned'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${proj.status || 'pending'}`}>
                      {(proj.status || 'pending').replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-sm text-muted">
                      <Calendar size={13} />
                      {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : 'No date'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon-sm" onClick={() => navigate('/admin/projects')}><ExternalLink size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
