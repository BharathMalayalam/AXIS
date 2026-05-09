import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Briefcase, Users, UserCheck,
  ClipboardCheck, Layers, MessageSquare, LogOut,
  ShieldCheck, ChevronRight, Menu, X, Sparkles, ChevronLeft,
  Zap, TrendingUp, Bell, Settings
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser, logout, sidebarCollapsed, toggleSidebar } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [mobileOpen]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} />, description: 'Dashboard & metrics' },
    { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={18} />, description: 'Manage all projects' },
    { name: 'Team Leads', path: '/admin/team-leaders', icon: <UserCheck size={18} />, description: 'Leader management' },
    { name: 'Members', path: '/admin/team-members', icon: <Users size={18} />, description: 'Developer management' },
    { name: 'Approvals', path: '/admin/approval', icon: <ShieldCheck size={18} />, description: 'Review submissions' },
  ];

  const tlLinks = [
    { name: 'Dashboard', path: '/tl', icon: <LayoutDashboard size={18} />, description: 'Operations center' },
    { name: 'Projects', path: '/tl/projects', icon: <Briefcase size={18} />, description: 'Your projects' },
    { name: 'Modules', path: '/tl/modules', icon: <Layers size={18} />, description: 'Module management' },
    { name: 'Verifications', path: '/tl/review', icon: <ClipboardCheck size={18} />, description: 'Review dev work' },
    { name: 'Messages', path: '/tl/queries', icon: <MessageSquare size={18} />, description: 'Team queries' },
  ];

  const devLinks = [
    { name: 'Dashboard', path: '/dev', icon: <LayoutDashboard size={18} />, description: 'Developer hub' },
    { name: 'Modules', path: '/dev/modules', icon: <Layers size={18} />, description: 'Your assignments' },
    { name: 'Queries', path: '/dev/queries', icon: <MessageSquare size={18} />, description: 'Ask questions' },
  ];

  const links = currentUser?.role === 'admin' ? adminLinks
    : currentUser?.role === 'teamleader' ? tlLinks
      : devLinks;

  // Get the role-specific accent
  const roleAccent = currentUser?.role === 'admin' ? 'var(--primary)'
    : currentUser?.role === 'teamleader' ? 'var(--success)'
      : 'var(--accent)';

  const roleLabel = currentUser?.role === 'admin' ? 'Administrator'
    : currentUser?.role === 'teamleader' ? 'Team Leader'
      : 'Developer';

  const SidebarContent = () => (
    <div className="sidebar-inner">
      {/* Brand */}
      <Link to="/" className="sidebar-brand">
        <div className="brand-icon">
          <img src="/axis-logo.png" alt="AXIS" style={{ width: 22, filter: 'brightness(10)' }} />
        </div>
        <div className="brand-text">
          <h2>AXIS</h2>
          <span>ENTERPRISE</span>
        </div>
      </Link>

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="nav-group">
          <span className="nav-group-label">Navigation</span>
          <div className="nav-links">
            {links.map((link) => {
              const isActive = link.path === '/admin' || link.path === '/tl' || link.path === '/dev'
                ? location.pathname === link.path
                : location.pathname.startsWith(link.path);

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/admin' || link.path === '/tl' || link.path === '/dev'}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={() => setHoveredLink(link.path)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={({ isActive: navActive }) => `sidebar-link ${navActive ? 'active' : ''}`}
                >
                  <span className="link-icon">{link.icon}</span>
                  <div className="link-content">
                    <span className="link-text">{link.name}</span>
                    {(hoveredLink === link.path || isActive) && !sidebarCollapsed && (
                      <span className="link-desc">{link.description}</span>
                    )}
                  </div>
                  {isActive && <div className="link-active-dot" />}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="nav-group">
          <span className="nav-group-label">Quick Access</span>
          <div className="nav-links">
            <button className="sidebar-link sidebar-link-subtle" disabled>
              <span className="link-icon link-icon-gradient"><Sparkles size={18} /></span>
              <div className="link-content">
                <span className="link-text">AI Analytics</span>
              </div>
              <span className="sidebar-badge sidebar-badge-pro">PRO</span>
            </button>
            <button className="sidebar-link sidebar-link-subtle" disabled>
              <span className="link-icon link-icon-muted"><TrendingUp size={18} /></span>
              <div className="link-content">
                <span className="link-text">Reports</span>
              </div>
              <span className="sidebar-badge sidebar-badge-soon">SOON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Upgrade card — only shown expanded */}
        {!sidebarCollapsed && (
          <div className="sidebar-upgrade-card">
            <div className="upgrade-glow" />
            <Zap size={18} className="upgrade-icon" />
            <div className="upgrade-text">
              <span className="upgrade-title">Upgrade Plan</span>
              <span className="upgrade-desc">Unlock advanced analytics</span>
            </div>
          </div>
        )}

        <div className="sidebar-profile-card">
          <div className="sidebar-avatar" style={{ '--avatar-color': roleAccent }}>
            {currentUser?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="profile-summary">
            <span className="profile-name">{currentUser?.name}</span>
            <span className="profile-role">
              <span className="profile-status-dot" />
              {roleLabel}
            </span>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} aria-label="Sign out" title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button
          className="sidebar-collapse-btn"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <SidebarContent />
      </aside>

      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div className="sidebar-overlay animate-fade-in" onClick={() => setMobileOpen(false)}>
          <div className={`sidebar-mobile-drawer animate-slide-right ${mobileOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
            <button
              className="sidebar-mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={22} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
