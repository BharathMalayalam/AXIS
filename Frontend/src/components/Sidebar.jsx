import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Briefcase, Users, UserCheck,
  ClipboardCheck, Layers, MessageSquare, LogOut,
  ShieldCheck, ChevronRight, Menu, X
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const adminLinks = [
    { name: 'Dashboard',     path: '/admin',               icon: <LayoutDashboard size={17} /> },
    { name: 'Projects',      path: '/admin/projects',      icon: <Briefcase size={17} /> },
    { name: 'Team Leaders',  path: '/admin/team-leaders',  icon: <UserCheck size={17} /> },
    { name: 'Team Members',  path: '/admin/team-members',  icon: <Users size={17} /> },
    { name: 'Approvals',     path: '/admin/approval',      icon: <ShieldCheck size={17} /> },
  ];

  const tlLinks = [
    { name: 'Dashboard',       path: '/tl',          icon: <LayoutDashboard size={17} /> },
    { name: 'My Projects',     path: '/tl/projects', icon: <Briefcase size={17} /> },
    { name: 'Manage Modules',  path: '/tl/modules',  icon: <Layers size={17} /> },
    { name: 'Review Work',     path: '/tl/review',   icon: <ClipboardCheck size={17} /> },
    { name: 'Queries',         path: '/tl/queries',  icon: <MessageSquare size={17} /> },
  ];

  const devLinks = [
    { name: 'Dashboard',  path: '/dev',          icon: <LayoutDashboard size={17} /> },
    { name: 'My Modules', path: '/dev/modules',  icon: <Layers size={17} /> },
    { name: 'Queries',    path: '/dev/queries',  icon: <MessageSquare size={17} /> },
  ];

  const links = currentUser?.role === 'admin' ? adminLinks
              : currentUser?.role === 'teamleader' ? tlLinks
              : devLinks;

  const roleBadgeColor = {
    admin:      { bg: '#DEEBFF', color: '#0052CC' },
    teamleader: { bg: '#E3FCEF', color: '#006644' },
    developer:  { bg: '#EAE6FF', color: '#403294' },
  };
  const rb = roleBadgeColor[currentUser?.role] || { bg: '#F4F5F7', color: '#42526E' };

  const SidebarContent = () => (
    <div style={{
      width: '240px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#FFFFFF',
      borderRight: '1px solid #DFE1E6',
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid #F4F5F7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px',
            background: '#0052CC',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,82,204,0.3)',
            flexShrink: 0,
          }}>
            <img src="/axis-logo.png" alt="AXIS" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'brightness(10)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0052CC', letterSpacing: '-0.03em', lineHeight: 1 }}>AXIS</h1>
            <p style={{ fontSize: '0.6rem', color: '#6B778C', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '1px' }}>Project Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto' }}>
        <p className="section-label">Navigation</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin' || link.path === '/tl' || link.path === '/dev'}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '6px',
                color: isActive ? '#0052CC' : '#42526E',
                background: isActive ? '#DEEBFF' : 'transparent',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                position: 'relative',
                borderLeft: isActive ? '3px solid #0052CC' : '3px solid transparent',
              })}
              className="sidebar-nav-link"
            >
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? '#0052CC' : '#6B778C', display: 'flex', flexShrink: 0 }}>{link.icon}</span>
                  <span style={{ flex: 1 }}>{link.name}</span>
                  {isActive && <ChevronRight size={14} style={{ color: '#0052CC', opacity: 0.6 }} />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #F4F5F7' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem', borderRadius: '8px',
          background: '#F8F9FC', border: '1px solid #EBECF0',
          marginBottom: '0.5rem',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: '#0052CC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.8rem', fontWeight: '800', flexShrink: 0,
          }}>
            {currentUser?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#172B4D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name}</p>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: rb.color, background: rb.bg, padding: '1px 6px', borderRadius: '3px', textTransform: 'capitalize' }}>
              {currentUser?.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.5rem 0.875rem', borderRadius: '6px',
            background: 'transparent', border: '1px solid #EBECF0',
            color: '#42526E', fontSize: '0.875rem', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          className="logout-btn"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="sidebar-desktop"
        style={{
          width: '240px',
          height: '100vh',
          position: 'fixed',
          left: 0, top: 0,
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(9,30,66,0.04)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed', top: '12px', left: '12px', zIndex: 200,
          width: '40px', height: '40px', borderRadius: '8px',
          background: '#0052CC', color: 'white',
          border: 'none', cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
        }}
        className="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(9,30,66,0.5)', zIndex: 150 }}
          />
          <aside style={{
            position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 200,
            animation: 'slideIn 0.25s ease',
          }}>
            <div style={{ position: 'absolute', top: '12px', right: '-48px' }}>
              <button onClick={() => setMobileOpen(false)} style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'white', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      <style>{`
        .sidebar-nav-link:hover {
          background: #F4F5F7 !important;
          color: #172B4D !important;
        }
        .sidebar-nav-link:hover span:first-child {
          color: #0052CC !important;
        }
        .logout-btn:hover {
          background: #FFEBE6 !important;
          color: #BF2600 !important;
          border-color: #FFBDAD !important;
        }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
