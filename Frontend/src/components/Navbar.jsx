import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Bell, Search, ChevronDown, Settings, HelpCircle,
  User, LogOut, ExternalLink, X, Plus,
  Briefcase, UserCheck, Users, Layers, MessageSquare
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, sidebarCollapsed } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const createRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (createRef.current && !createRef.current.contains(e.target)) setShowCreateMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleLabel = {
    admin: 'Admin',
    teamleader: 'Team Lead',
    developer: 'Developer',
  }[currentUser?.role] || currentUser?.role;

  const avatarColors = {
    admin: 'var(--primary)',
    teamleader: 'var(--success)',
    developer: 'var(--accent)',
  };
  const avBg = avatarColors[currentUser?.role] || 'var(--primary)';

  // Create menu options based on role
  const getCreateOptions = () => {
    const role = currentUser?.role;
    if (role === 'admin') return [
      { label: 'New Project', icon: <Briefcase size={15} />, path: '/admin/projects', desc: 'Create a new project' },
      { label: 'Add Team Lead', icon: <UserCheck size={15} />, path: '/admin/team-leaders', desc: 'Onboard a team leader' },
      { label: 'Add Developer', icon: <Users size={15} />, path: '/admin/team-members', desc: 'Onboard a developer' },
    ];
    if (role === 'teamleader') return [
      { label: 'New Module', icon: <Layers size={15} />, path: '/tl/modules', desc: 'Add module to project' },
      { label: 'Send Message', icon: <MessageSquare size={15} />, path: '/tl/queries', desc: 'Message your team' },
    ];
    return [
      { label: 'Submit Module', icon: <Layers size={15} />, path: '/dev/modules', desc: 'Submit your work' },
      { label: 'Ask Question', icon: <MessageSquare size={15} />, path: '/dev/queries', desc: 'Post a query' },
    ];
  };

  return (
    <header className={`navbar glass ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="navbar-left">
        <div className="navbar-create-wrapper" ref={createRef}>
          <button
            className="btn btn-primary btn-pill btn-sm"
            onClick={() => { setShowCreateMenu(!showCreateMenu); setShowProfileMenu(false); setShowNotifications(false); }}
          >
            <Plus size={16} /> Create
          </button>
          {showCreateMenu && (
            <div className="dropdown-menu create-dropdown animate-up">
              <div className="dropdown-header">
                <h4>Quick Create</h4>
                <button className="modal-close" onClick={() => setShowCreateMenu(false)}><X size={16} /></button>
              </div>
              <div className="dropdown-body">
                {getCreateOptions().map((opt, i) => (
                  <button
                    key={i}
                    className="create-option"
                    onClick={() => { navigate(opt.path); setShowCreateMenu(false); }}
                  >
                    <div className="create-option-icon">{opt.icon}</div>
                    <div className="create-option-content">
                      <span className="create-option-label">{opt.label}</span>
                      <span className="create-option-desc">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="navbar-divider"></div>
        <div className="navbar-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks, docs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-tools">
          <button className="nav-tool-btn" title="Help"><HelpCircle size={18} /></button>
          <button className="nav-tool-btn" title="Settings"><Settings size={18} /></button>

          <div className="navbar-notif-wrapper" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); setShowCreateMenu(false); }}
              className={`nav-tool-btn ${showNotifications ? 'active' : ''}`}
            >
              <Bell size={18} />
              <span className="notif-dot"></span>
            </button>

            {showNotifications && (
              <div className="dropdown-menu notif-dropdown animate-up">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <button className="modal-close" onClick={() => setShowNotifications(false)}><X size={16} /></button>
                </div>
                <div className="dropdown-body empty" style={{ padding: '2rem', textAlign: 'center' }}>
                  <Bell size={32} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p className="text-sm text-muted">All clear! No new notifications.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-profile-wrapper" ref={profileRef}>
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowCreateMenu(false); }}
            className={`profile-trigger ${showProfileMenu ? 'active' : ''}`}
          >
            <div className="avatar avatar-xs" style={{ background: avBg }}>
              {currentUser?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="profile-info">
              <span className="profile-name">{currentUser?.name}</span>
              <span className="profile-role">{roleLabel}</span>
            </div>
            <ChevronDown size={14} className={`chevron ${showProfileMenu ? 'rotated' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="dropdown-menu profile-dropdown animate-up" style={{ width: 260, position: 'absolute', top: '100%', right: 0, background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', overflow: 'hidden', marginTop: '8px' }}>
              <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#F8F9FC' }}>
                <div className="avatar avatar-md" style={{ background: avBg }}>
                  {currentUser?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="truncate">
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{currentUser?.name}</h4>
                  <p className="text-xs text-muted">{currentUser?.email || 'user@axis.systems'}</p>
                </div>
              </div>
              <div style={{ padding: '0.5rem' }}>
                <button className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', border: 'none', background: 'transparent', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}><User size={14} /> My Profile</button>
                <button className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', border: 'none', background: 'transparent', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}><Settings size={14} /> Preferences</button>
                <button className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', border: 'none', background: 'transparent', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}><ExternalLink size={14} /> Support</button>
                <div style={{ height: 1, background: 'var(--border)', margin: '0.5rem 0' }}></div>
                <button className="dropdown-item text-danger" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', border: 'none', background: 'transparent', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)' }} onClick={handleLogout}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
