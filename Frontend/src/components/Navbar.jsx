import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Bell, Search, ChevronDown, Settings, HelpCircle,
  User, LogOut, ExternalLink, X
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
    admin: 'Administrator',
    teamleader: 'Team Leader',
    developer: 'Developer',
  }[currentUser?.role] || currentUser?.role;

  const avatarColors = {
    admin:      { bg: '#0052CC', text: 'white' },
    teamleader: { bg: '#36B37E', text: 'white' },
    developer:  { bg: '#6554C0', text: 'white' },
  };
  const av = avatarColors[currentUser?.role] || { bg: '#0052CC', text: 'white' };

  return (
    <header style={{
      height: 'var(--navbar-height)',
      position: 'fixed',
      top: 0, right: 0,
      left: 'var(--sidebar-width)',
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #DFE1E6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      zIndex: 90,
      boxShadow: '0 1px 4px rgba(9,30,66,0.06)',
    }}>

      {/* Left – Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div className="search-wrapper" style={{ position: 'relative', width: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8993A4', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search AXIS…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.875rem 0.45rem 2.25rem',
              background: '#F4F5F7',
              border: '1px solid #DFE1E6',
              borderRadius: '6px',
              color: '#172B4D',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif',
            }}
            className="navbar-search"
          />
        </div>
      </div>

      {/* Right – Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>

        {/* Utility Buttons */}
        <button className="nav-icon-btn" title="Help"><HelpCircle size={17} /></button>
        <button className="nav-icon-btn" title="Settings"><Settings size={17} /></button>

        <div style={{ width: '1px', height: '22px', background: '#DFE1E6', margin: '0 0.375rem' }} />

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="nav-icon-btn"
            style={{ position: 'relative' }}
            title="Notifications"
          >
            <Bell size={17} />
          </button>

          {showNotifications && (
            <div className="animate-slide-down" style={{
              position: 'absolute', top: '48px', right: 0,
              width: '300px', background: '#fff',
              border: '1px solid #DFE1E6', borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(9,30,66,0.15)',
              zIndex: 1000,
            }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F4F5F7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#172B4D' }}>Notifications</h4>
                <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B778C', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: '2rem 1.25rem', textAlign: 'center', color: '#8993A4', fontSize: '0.8rem' }}>
                <Bell size={24} style={{ opacity: 0.3, marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                You're all caught up!
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.3rem 0.625rem 0.3rem 0.375rem',
              background: showProfileMenu ? '#DEEBFF' : '#F4F5F7',
              border: '1px solid',
              borderColor: showProfileMenu ? '#B3D4FF' : '#DFE1E6',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="profile-trigger"
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: av.bg, color: av.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: '800',
            }}>
              {currentUser?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span style={{ fontSize: '0.825rem', fontWeight: '600', color: '#172B4D', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.name}
            </span>
            <ChevronDown size={13} style={{ color: '#6B778C', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </button>

          {showProfileMenu && (
            <div className="animate-slide-down" style={{
              position: 'absolute', top: '48px', right: 0,
              width: '256px', background: '#fff',
              border: '1px solid #DFE1E6', borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(9,30,66,0.15)',
              zIndex: 1000, overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{ padding: '1.125rem 1.25rem', background: '#F8F9FC', borderBottom: '1px solid #EBECF0', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: av.bg, color: av.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: '800', flexShrink: 0,
                }}>
                  {currentUser?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#172B4D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6B778C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{roleLabel}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '0.5rem' }}>
                <button className="profile-menu-item">
                  <User size={16} /><span>Profile</span>
                </button>
                <button className="profile-menu-item">
                  <Settings size={16} /><span>Account settings</span>
                </button>
                <button className="profile-menu-item">
                  <ExternalLink size={16} /><span>Documentation</span>
                </button>
              </div>

              <div style={{ height: '1px', background: '#EBECF0', margin: '0 0.5rem' }} />

              <div style={{ padding: '0.5rem' }}>
                <button
                  className="profile-menu-item"
                  onClick={handleLogout}
                  style={{ color: '#DE350B' }}
                >
                  <LogOut size={16} /><span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .nav-icon-btn {
          background: none; border: none;
          color: #42526E; cursor: pointer;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px;
          transition: all 0.15s;
        }
        .nav-icon-btn:hover {
          background: #F4F5F7;
          color: #172B4D;
        }
        .navbar-search:focus {
          background: #fff !important;
          border-color: #0052CC !important;
          box-shadow: 0 0 0 3px rgba(0,82,204,0.12) !important;
          width: 320px !important;
        }
        .profile-trigger:hover {
          background: #DEEBFF !important;
          border-color: #B3D4FF !important;
        }
        .profile-menu-item {
          width: 100%; display: flex; align-items: center; gap: 0.625rem;
          padding: 0.6rem 0.875rem;
          background: none; border: none; border-radius: 6px;
          color: #42526E; font-size: 0.8125rem; font-weight: 500;
          cursor: pointer; text-align: left;
          transition: all 0.15s;
        }
        .profile-menu-item:hover {
          background: #F4F5F7;
          color: #172B4D;
        }
        @media (max-width: 768px) {
          header { left: 0 !important; padding-left: 3.5rem !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
