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
    { name: 'Overview',      path: '/admin',               icon: <LayoutDashboard size={20} /> },
    { name: 'Projects',      path: '/admin/projects',      icon: <Briefcase size={20} /> },
    { name: 'Team Leads',    path: '/admin/team-leaders',  icon: <UserCheck size={20} /> },
    { name: 'Members',       path: '/admin/team-members',  icon: <Users size={20} /> },
    { name: 'Approvals',     path: '/admin/approval',      icon: <ShieldCheck size={20} /> },
  ];

  const tlLinks = [
    { name: 'Dashboard',       path: '/tl',          icon: <LayoutDashboard size={20} /> },
    { name: 'Projects',        path: '/tl/projects', icon: <Briefcase size={20} /> },
    { name: 'Modules',         path: '/tl/modules',  icon: <Layers size={20} /> },
    { name: 'Verifications',   path: '/tl/review',   icon: <ClipboardCheck size={20} /> },
    { name: 'Messages',        path: '/tl/queries',  icon: <MessageSquare size={20} /> },
  ];

  const devLinks = [
    { name: 'Dashboard',  path: '/dev',          icon: <LayoutDashboard size={20} /> },
    { name: 'Modules',    path: '/dev/modules',  icon: <Layers size={20} /> },
    { name: 'Queries',    path: '/dev/queries',  icon: <MessageSquare size={20} /> },
  ];

  const links = currentUser?.role === 'admin' ? adminLinks
              : currentUser?.role === 'teamleader' ? tlLinks
              : devLinks;

  const SidebarContent = () => (
    <div className="sidebar-inner">
      {/* Brand */}
      <Link to="/" className="sidebar-brand">
        <div className="brand-icon">
          <img src="/axis-logo.png" alt="AXIS" />
        </div>
        <div className="brand-text">
          <h2>AXIS</h2>
          <span>ENTERPRISE</span>
        </div>
      </Link>

      {/* Nav Section */}
      <div className="sidebar-nav-container">
        <div className="nav-group">
          <span className="nav-group-label">Core Workspace</span>
          <div className="nav-links">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin' || link.path === '/tl' || link.path === '/dev'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="link-icon">{link.icon}</span>
                <span className="link-text">{link.name}</span>
                <ChevronRight className="link-chevron" size={14} />
              </NavLink>
            ))}
          </div>
        </div>

        <div className="nav-group">
          <span className="nav-group-label">Insights</span>
          <div className="nav-links">
            <button className="sidebar-link disabled">
              <span className="link-icon"><Sparkles size={20} /></span>
              <span className="link-text">AI Analytics</span>
              <span className="badge-pro">PRO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Profile */}
      <div className="sidebar-footer">
        <div className="user-card-compact glass">
          <div className="avatar-sm">
            {currentUser?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{currentUser?.name}</span>
            <span className="user-status">Online</span>
          </div>
          <button className="btn-logout-icon" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sidebar-desktop glass-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Trigger */}
      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen(true)}>
        <Menu size={24} />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="sidebar-mobile-overlay animate-fade">
          <div className="sidebar-mobile-drawer animate-slide-right">
            <button className="btn-close-sidebar" onClick={() => setMobileOpen(false)}>
              <X size={24} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <style>{`
        .glass-sidebar {
          background: #1A1D21; /* Deep charcoal */
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0; top: 0;
          z-index: 100;
          color: white;
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem 1rem;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1rem 2.5rem;
          text-decoration: none;
        }

        .brand-icon {
          width: 42px;
          height: 42px;
          background: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0, 82, 204, 0.3);
        }

        .brand-icon img {
          width: 28px;
          filter: brightness(10);
        }

        .brand-text h2 {
          color: white;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .brand-text span {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sidebar-nav-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .nav-group-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.05em;
          padding: 0 1rem 1rem;
          display: block;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-md);
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 600;
          transition: var(--transition-base);
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .sidebar-link.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 82, 204, 0.2);
        }

        .link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
        }

        .sidebar-link.active .link-icon {
          opacity: 1;
        }

        .link-text {
          flex: 1;
        }

        .link-chevron {
          opacity: 0;
          transform: translateX(-10px);
          transition: var(--transition-base);
        }

        .sidebar-link:hover .link-chevron {
          opacity: 0.5;
          transform: translateX(0);
        }

        .sidebar-link.active .link-chevron {
          opacity: 1;
          transform: translateX(0);
        }

        .badge-pro {
          font-size: 0.625rem;
          font-weight: 900;
          background: var(--accent-gradient);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: white;
        }

        .sidebar-link.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 2rem;
        }

        .user-card-compact {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .avatar-sm {
          width: 36px;
          height: 36px;
          background: var(--primary-light);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
        }

        .user-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
        }

        .user-status {
          font-size: 0.75rem;
          color: var(--success);
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .user-status::before {
          content: '';
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
        }

        .btn-logout-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          border-radius: 8px;
          transition: var(--transition-base);
        }

        .btn-logout-icon:hover {
          background: rgba(255, 71, 71, 0.1);
          color: #FF4747;
        }

        /* Mobile */
        .sidebar-mobile-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1000;
          background: white;
          border: 1px solid var(--border);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }

        .sidebar-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 2000;
        }

        .sidebar-mobile-drawer {
          width: 280px;
          height: 100vh;
          background: #1A1D21;
          position: relative;
        }

        .btn-close-sidebar {
          position: absolute;
          top: 1rem;
          right: -3.5rem;
          width: 44px;
          height: 44px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .sidebar-mobile-toggle { display: flex; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
