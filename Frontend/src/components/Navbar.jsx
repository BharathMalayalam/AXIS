import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Bell, Search, ChevronDown, Settings, HelpCircle,
  User, LogOut, ExternalLink, X, Plus
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate    = useNavigate();
  const profileRef  = useRef(null);
  const notifRef    = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
      if (notifRef.current  && !notifRef.current.contains(e.target))   setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleLabel = {
    admin: 'Platform Admin',
    teamleader: 'Team Lead',
    developer: 'Senior Developer',
  }[currentUser?.role] || currentUser?.role;

  const avatarColors = {
    admin:      { bg: 'var(--primary)', text: 'white' },
    teamleader: { bg: 'var(--success)', text: 'white' },
    developer:  { bg: 'var(--accent)', text: 'white' },
  };
  const av = avatarColors[currentUser?.role] || { bg: 'var(--primary)', text: 'white' };

  return (
    <header className="navbar glass">
      {/* Left: Breadcrumbs & Actions */}
      <div className="navbar-left">
        <button className="btn btn-primary btn-pill btn-sm">
          <Plus size={16} /> Create
        </button>
        <div className="navbar-divider"></div>
        <div className="navbar-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks, docs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <kbd className="search-kbd">/</kbd>
        </div>
      </div>

      {/* Right: Tools & Profile */}
      <div className="navbar-right">
        <div className="navbar-tools">
          <button className="nav-tool-btn" title="Help"><HelpCircle size={18} /></button>
          <button className="nav-tool-btn" title="Settings"><Settings size={18} /></button>
          
          <div className="navbar-notif-wrapper" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              className={`nav-tool-btn ${showNotifications ? 'active' : ''}`}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notif-dot"></span>
            </button>

            {showNotifications && (
              <div className="dropdown-menu notif-dropdown animate-up">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <button className="btn-close" onClick={() => setShowNotifications(false)}><X size={16} /></button>
                </div>
                <div className="dropdown-body empty">
                  <div className="empty-state-icon"><Bell size={32} /></div>
                  <p>All clear! No new notifications.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-profile-wrapper" ref={profileRef}>
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className={`profile-trigger ${showProfileMenu ? 'active' : ''}`}
          >
            <div className="avatar" style={{ background: av.bg }}>
              {currentUser?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="profile-info">
              <span className="profile-name">{currentUser?.name}</span>
              <span className="profile-role">{roleLabel}</span>
            </div>
            <ChevronDown size={14} className={`chevron ${showProfileMenu ? 'rotated' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="dropdown-menu profile-dropdown animate-up">
              <div className="dropdown-profile-header">
                <div className="avatar avatar-lg" style={{ background: av.bg }}>
                  {currentUser?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="profile-name-lg">{currentUser?.name}</h4>
                  <p className="profile-email">{currentUser?.email || 'user@axis.systems'}</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-items">
                <button className="dropdown-item"><User size={16} /> My Profile</button>
                <button className="dropdown-item"><Settings size={16} /> Preferences</button>
                <button className="dropdown-item"><ExternalLink size={16} /> Support Center</button>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-items">
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          height: var(--navbar-height);
          position: fixed;
          top: 0; right: 0;
          left: var(--sidebar-width);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 90;
          transition: var(--transition-base);
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
        }

        .navbar-divider {
          width: 1px;
          height: 24px;
          background: var(--border);
        }

        .navbar-search-box {
          position: relative;
          width: 320px;
          display: flex;
          align-items: center;
        }

        .navbar-search-box .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-placeholder);
        }

        .navbar-search-box input {
          width: 100%;
          padding: 0.625rem 3rem 0.625rem 2.75rem;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          color: var(--text-primary);
          transition: var(--transition-base);
        }

        .navbar-search-box input:focus {
          background: white;
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
          width: 400px;
        }

        .search-kbd {
          position: absolute;
          right: 0.75rem;
          padding: 0.125rem 0.375rem;
          background: white;
          border: 1px solid var(--border);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .navbar-tools {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-tool-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-base);
          position: relative;
        }

        .nav-tool-btn:hover, .nav-tool-btn.active {
          background: var(--primary-xlight);
          color: var(--primary);
        }

        .notif-dot {
          position: absolute;
          top: 8px; right: 8px;
          width: 8px; height: 8px;
          background: var(--danger);
          border: 2px solid white;
          border-radius: 50%;
        }

        /* Dropdowns */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 320px;
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .dropdown-header {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
        }

        .dropdown-header h4 { font-size: 1rem; font-weight: 800; }
        .btn-close { background: none; border: none; color: var(--text-muted); cursor: pointer; }

        .dropdown-body.empty {
          padding: 3rem 1.5rem;
          text-align: center;
          color: var(--text-muted);
        }

        .dropdown-body.empty .empty-state-icon {
          margin-bottom: 1rem;
          opacity: 0.2;
        }

        /* Profile Trigger */
        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.375rem;
          padding-right: 1rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background: #FAFBFC;
          cursor: pointer;
          transition: var(--transition-base);
        }

        .profile-trigger:hover, .profile-trigger.active {
          border-color: var(--primary-light);
          background: white;
          box-shadow: var(--shadow-sm);
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 0.8125rem;
        }

        .avatar-lg { width: 48px; height: 48px; font-size: 1.25rem; }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.2;
        }

        .profile-name { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); }
        .profile-role { font-size: 0.75rem; color: var(--text-muted); }

        .chevron { color: var(--text-muted); transition: var(--transition-base); }
        .chevron.rotated { transform: rotate(180deg); }

        /* Profile Dropdown */
        .profile-dropdown { width: 280px; }
        .dropdown-profile-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #FAFBFC;
        }

        .profile-name-lg { font-size: 1rem; font-weight: 800; }
        .profile-email { font-size: 0.8125rem; color: var(--text-muted); }

        .dropdown-divider { height: 1px; background: var(--border); }
        .dropdown-items { padding: 0.5rem; }
        
        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .dropdown-item:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .dropdown-item.text-danger { color: var(--danger); }
        .dropdown-item.text-danger:hover { background: var(--danger-bg); }

        @media (max-width: 768px) {
          .navbar { left: 0; padding: 0 1rem; }
          .navbar-search-box { display: none; }
          .profile-info { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
