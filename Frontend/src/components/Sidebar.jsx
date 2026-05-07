import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Briefcase, Users, UserCheck,
  ClipboardCheck, Layers, MessageSquare, LogOut,
  ShieldCheck, ChevronRight, Menu, X, Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={20} /> },
    { name: 'Team Leads', path: '/admin/team-leaders', icon: <UserCheck size={20} /> },
    { name: 'Members', path: '/admin/team-members', icon: <Users size={20} /> },
    { name: 'Approvals', path: '/admin/approval', icon: <ShieldCheck size={20} /> },
  ];

  const tlLinks = [
    { name: 'Dashboard', path: '/tl', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/tl/projects', icon: <Briefcase size={20} /> },
    { name: 'Modules', path: '/tl/modules', icon: <Layers size={20} /> },
    { name: 'Verifications', path: '/tl/review', icon: <ClipboardCheck size={20} /> },
    { name: 'Messages', path: '/tl/queries', icon: <MessageSquare size={20} /> },
  ];

  const devLinks = [
    { name: 'Dashboard', path: '/dev', icon: <LayoutDashboard size={20} /> },
    { name: 'Modules', path: '/dev/modules', icon: <Layers size={20} /> },
    { name: 'Queries', path: '/dev/queries', icon: <MessageSquare size={20} /> },
  ];

  const links = currentUser?.role === 'admin' ? adminLinks
    : currentUser?.role === 'teamleader' ? tlLinks
      : devLinks;

  const SidebarContent = () => (
    <div className="sidebar-inner">
      <Link to="/" className="sidebar-brand">
        <div className="brand-icon">
          <img src="/axis-logo.png" alt="AXIS" style={{ width: 28, filter: 'brightness(10)' }} />
        </div>
        <div className="brand-text">
          <h2>AXIS</h2>
          <span>ENTERPRISE</span>
        </div>
      </Link>

      <div className="sidebar-nav">
        <div className="nav-group">
          <span className="nav-group-label">Core Workspace</span>
          <div className="nav-links" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin' || link.path === '/tl' || link.path === '/dev'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span style={{ display: 'flex' }}>{link.icon}</span>
                <span className="link-text">{link.name}</span>
                <ChevronRight className="link-chevron" size={14} style={{ marginLeft: 'auto' }} />
              </NavLink>
            ))}
          </div>
        </div>

        <div className="nav-group">
          <span className="nav-group-label">Insights</span>
          <div className="nav-links">
            <button className="sidebar-link" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              <span style={{ display: 'flex' }}><Sparkles size={20} /></span>
              <span className="link-text">AI Analytics</span>
              <span className="badge-progress" style={{ fontSize: '0.6rem', padding: '2px 4px', borderRadius: '4px', marginLeft: 'auto' }}>PRO</span>
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-pill glass" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="avatar avatar-sm avatar-primary" style={{ background: 'var(--primary-light)' }}>
            {currentUser?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex flex-col truncate" style={{ flex: 1 }}>
            <span className="font-bold text-xs" style={{ color: 'white' }}>{currentUser?.name}</span>
            <span className="text-xs text-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></div> Online
            </span>
          </div>
          <button className="btn-icon-sm" onClick={handleLogout} style={{ color: 'rgba(255,255,255,0.4)' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen(true)}>
        <Menu size={24} />
      </button>

      {mobileOpen && (
        <div className="sidebar-overlay animate-fade-in" onClick={() => setMobileOpen(false)}>
          <div className="sidebar-mobile-drawer animate-slide-right" onClick={e => e.stopPropagation()}>
            <button className="modal-close" style={{ position: 'absolute', top: '1rem', right: '-3.5rem', borderRadius: '50%', width: 44, height: 44, background: 'white' }} onClick={() => setMobileOpen(false)}>
              <X size={24} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
