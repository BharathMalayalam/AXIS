import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase, Users, UserCheck, CheckCircle2, Clock,
  TrendingUp, Plus, Calendar, BarChart3, Activity,
  ChevronRight, MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { projects, users, getAdminStats } = useApp();
  const [stats, setStats] = useState({
    totalProjects: 0, activeProjects: 0, completedProjects: 0,
    pendingApproval: 0, totalTLs: 0, totalDevs: 0
  });

  useEffect(() => {
    getAdminStats().then(d => { if (d) setStats(d); });
  }, [getAdminStats]);

  const chartData = [
    { name: 'Mon', projects: 4 },
    { name: 'Tue', projects: 7 },
    { name: 'Wed', projects: 5 },
    { name: 'Thu', projects: 9 },
    { name: 'Fri', projects: 12 },
    { name: 'Sat', projects: 8 },
    { name: 'Sun', projects: stats.totalProjects || 10 },
  ];

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeUsers    = Array.isArray(users) ? users : [];

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects || 0,   icon: <Briefcase size={20} />,    color: '#0052CC', bg: '#DEEBFF' },
    { label: 'In Progress',    value: stats.activeProjects || 0,  icon: <Activity size={20} />,     color: '#00B8D4', bg: '#E6FCFF' },
    { label: 'Completed',      value: stats.completedProjects || 0, icon: <CheckCircle2 size={20} />,color: '#36B37E', bg: '#E3FCEF' },
    { label: 'Pending Approval', value: stats.pendingApproval || 0, icon: <Clock size={20} />,      color: '#FFAB00', bg: '#FFFAE6' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: '#8993A4', marginTop: '0.2rem' }}>
            <span>Home</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0052CC', fontWeight: '600' }}>Overview</span>
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
            <Calendar size={14} /> Last 30 days
          </button>
          <button className="btn btn-primary">
            <Plus size={16} /> Create Project
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }} className="admin-stats-grid">
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px',
            padding: '1.375rem', display: 'flex', alignItems: 'center', gap: '1rem',
            boxShadow: '0 1px 4px rgba(9,30,66,0.06)',
            transition: 'all 0.2s', cursor: 'default',
            borderTop: `3px solid ${card.color}`,
          }} className="stat-card-hover">
            <div style={{
              width: '46px', height: '46px', borderRadius: '10px',
              background: card.bg, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#172B4D', lineHeight: 1.1, fontFamily: "'Outfit', sans-serif" }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#6B778C', fontWeight: '600', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="chart-grid">
        {/* Area Chart */}
        <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#172B4D' }}>Project Activity</h3>
              <p style={{ fontSize: '0.8rem', color: '#6B778C', marginTop: '0.125rem' }}>Weekly project engagement trend</p>
            </div>
            <button className="btn btn-ghost btn-sm"><MoreHorizontal size={16} /></button>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0052CC" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#0052CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F5F7" vertical={false} />
                <XAxis dataKey="name" stroke="#8993A4" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                <YAxis stroke="#8993A4" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '6px', boxShadow: '0 4px 12px rgba(9,30,66,0.1)', fontSize: '12px' }}
                  itemStyle={{ color: '#172B4D' }}
                />
                <Area type="monotone" dataKey="projects" stroke="#0052CC" strokeWidth={2.5} fillOpacity={1} fill="url(#blueGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#172B4D', marginBottom: '1.5rem' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Active Sessions', value: '14 Units', progress: 75, color: '#0052CC' },
              { label: 'Resource Load',   value: '42%',     progress: 42, color: '#36B37E' },
              { label: 'Uptime',          value: '99.9%',   progress: 99, color: '#00B8D4' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.825rem' }}>
                  <span style={{ fontWeight: '600', color: '#42526E' }}>{item.label}</span>
                  <span style={{ color: '#172B4D', fontWeight: '700' }}>{item.value}</span>
                </div>
                <div style={{ height: '7px', background: '#EBECF0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.progress}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: '0.5rem', padding: '0.875rem 1rem', background: '#F8FFF8', borderRadius: '6px', border: '1px solid #ABF5D1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#006644', fontWeight: '600' }}>
                <CheckCircle2 size={14} />
                All systems operational
              </div>
              <p style={{ fontSize: '0.75rem', color: '#42526E', marginTop: '0.25rem', lineHeight: 1.5 }}>
                No critical alerts in the last 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid #F4F5F7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#172B4D' }}>Recent Projects</h3>
            <p style={{ fontSize: '0.8rem', color: '#6B778C', marginTop: '0.125rem' }}>{safeProjects.length} total projects</p>
          </div>
          <button style={{ color: '#0052CC', background: 'none', border: 'none', fontSize: '0.8125rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>Project Name</th>
                <th>Assigned Lead</th>
                <th>Status</th>
                <th style={{ paddingRight: '1.5rem' }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {safeProjects.length === 0 ? (
                <tr><td colSpan="4">
                  <div className="empty-state">
                    <Briefcase style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '0.75rem', color: '#6B778C' }} />
                    <p className="empty-state-text">No projects yet</p>
                    <p className="empty-state-sub">Create your first project to get started.</p>
                  </div>
                </td></tr>
              ) : (
                [...safeProjects].reverse().slice(0, 6).map(proj => (
                  <tr key={proj._id}>
                    <td style={{ paddingLeft: '1.5rem' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#172B4D', fontSize: '0.875rem' }}>{proj.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B778C', marginTop: '2px' }}>{proj.description?.slice(0, 50)}{proj.description?.length > 50 ? '…' : ''}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0052CC', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800' }}>
                          {(safeUsers.find(u => u._id === (proj.assignedTL?._id || proj.assignedTL))?.name || proj.assignedTL?.name || 'U')[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#42526E' }}>
                          {safeUsers.find(u => u._id === (proj.assignedTL?._id || proj.assignedTL))?.name || proj.assignedTL?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${proj.status}`}>
                        {(proj.status || 'unknown').replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ paddingRight: '1.5rem', fontSize: '0.8125rem', color: '#6B778C' }}>
                      {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .stat-card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(9,30,66,0.1) !important; }
        @media (max-width: 960px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .chart-grid       { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .admin-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
