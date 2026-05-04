import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, User, Users, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const roleConfigs = {
  admin: {
    icon: <Shield size={20} />,
    label: 'Administrator',
    color: '#0052CC',
    bg: '#DEEBFF',
    border: '#B3D4FF',
    isSwapped: false,
    instructions: [
      'Manage platform users and roles',
      'Oversee all company projects',
      'Approve project completions',
    ]
  },
  teamleader: {
    icon: <Users size={20} />,
    label: 'Team Leader',
    color: '#36B37E',
    bg: '#E3FCEF',
    border: '#ABF5D1',
    isSwapped: true,
    instructions: [
      'Oversee project roadmaps',
      'Review team submissions',
      'Clarify developer queries',
    ]
  },
  developer: {
    icon: <User size={20} />,
    label: 'Developer',
    color: '#6554C0',
    bg: '#EAE6FF',
    border: '#C0B6F2',
    isSwapped: true,
    instructions: [
      'Track your assigned modules',
      'Submit work for review',
      'Communicate with team leaders',
    ]
  },
};

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await login(userId, password, role);
      if (res.success) {
        const r = res.user.role?.toLowerCase();
        navigate(r === 'admin' ? '/admin' : r === 'teamleader' ? '/tl' : '/dev');
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const rc = roleConfigs[role];
  const isSwapped = rc.isSwapped;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(145deg, #EAF2FF 0%, #DEEBFF 40%, #F4F5F7 100%)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '480px', height: '480px', borderRadius: '50%', background: 'rgba(0,82,204,0.08)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(0,184,212,0.07)', filter: 'blur(60px)', zIndex: 0 }} />

      {/* Main Flex Wrapper */}
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        position: 'relative',
        zIndex: 1,
      }}>
        
        {/* Branding Panel */}
        <div style={{
          flex: '1', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '3rem',
          background: `linear-gradient(135deg, ${rc.color} 0%, #2684FF 100%)`,
          position: 'relative', overflow: 'hidden',
          transition: 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1), background 0.8s ease',
          transform: isSwapped ? 'translateX(100%)' : 'translateX(0)',
          zIndex: isSwapped ? 10 : 20,
        }} className="login-panel">
          {/* Circles decor */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)' }} />
          <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '360px', height: '360px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />

          <div style={{ position: 'relative', textAlign: 'center', maxWidth: '360px' }}>
            <div 
              onClick={() => navigate('/')}
              style={{
                width: '80px', height: '80px', background: 'rgba(255,255,255,0.15)',
                borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 2rem', border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              }}
            >
              <img src="/axis-logo.png" alt="AXIS" style={{ width: '54px', objectFit: 'contain', filter: 'brightness(10)' }} />
            </div>
            <h1 
              onClick={() => navigate('/')}
              style={{ 
                fontSize: '3rem', fontWeight: '900', color: '#fff', 
                letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.75rem',
                cursor: 'pointer'
              }}
            >AXIS</h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', lineHeight: 1.6 }}>
              {rc.label} Workspace
            </p>
            <div style={{ textAlign: 'left' }} key={role} className="animate-fade-in">
              {rc.instructions.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#79E2F2', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.925rem', color: 'rgba(255,255,255,0.9)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div style={{
          flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2.5rem', background: '#fff',
          position: 'relative',
          transition: 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1), box-shadow 0.8s ease',
          transform: isSwapped ? 'translateX(-100%)' : 'translateX(0)',
          zIndex: isSwapped ? 20 : 10,
          boxShadow: isSwapped ? '12px 0 32px rgba(9,30,66,0.1)' : '-12px 0 32px rgba(9,30,66,0.1)',
        }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div className="animate-slide-up stagger-1">
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#172B4D', marginBottom: '0.375rem' }}>
                Welcome back
              </h2>
              <p style={{ color: '#6B778C', fontSize: '0.925rem', marginBottom: '2rem' }}>
                Log in to your AXIS platform
              </p>
            </div>

            {/* Role Selector */}
            <div className="animate-slide-up stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem', marginBottom: '1.5rem' }}>
              {Object.entries(roleConfigs).map(([r, cfg]) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    padding: '0.875rem 0.5rem',
                    background: role === r ? cfg.bg : '#F4F5F7',
                    border: `2px solid ${role === r ? cfg.border : '#DFE1E6'}`,
                    borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                  }}
                  className="role-btn"
                >
                  <span style={{ color: role === r ? cfg.color : '#6B778C' }}>{cfg.icon}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: role === r ? cfg.color : '#6B778C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r}</span>
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="animate-shake" style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.75rem 1rem', marginBottom: '1.25rem',
                background: '#FFEBE6', color: '#BF2600',
                border: '1px solid #FFBDAD', borderRadius: '4px',
                fontSize: '0.85rem', fontWeight: '500',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="animate-slide-up stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#42526E', marginBottom: '0.375rem' }}>User ID</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8993A4' }} />
                  <input
                    type="text" placeholder={`Enter ${rc.label} ID`}
                    value={userId} onChange={e => setUserId(e.target.value)} required
                    style={{
                      width: '100%', padding: '0.6875rem 0.875rem 0.6875rem 2.5rem',
                      background: '#FAFBFC', border: '2px solid #DFE1E6',
                      borderRadius: '4px', fontSize: '0.9rem', color: '#172B4D',
                      outline: 'none', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                    }}
                    className="login-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#42526E', marginBottom: '0.375rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8993A4' }} />
                  <input
                    type="password" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required
                    style={{
                      width: '100%', padding: '0.6875rem 0.875rem 0.6875rem 2.5rem',
                      background: '#FAFBFC', border: '2px solid #DFE1E6',
                      borderRadius: '4px', fontSize: '0.9rem', color: '#172B4D',
                      outline: 'none', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                    }}
                    className="login-input"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={isLoading}
                style={{
                  width: '100%', padding: '0.75rem',
                  background: rc.color, color: '#fff',
                  border: 'none', borderRadius: '4px',
                  fontSize: '0.9375rem', fontWeight: '700',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  marginTop: '0.25rem',
                  boxShadow: `0 4px 12px ${rc.color}40`,
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                  opacity: isLoading ? 0.7 : 1,
                }}
                className="login-submit"
              >
                {isLoading
                  ? <><Loader2 size={18} className="animate-spin" /> Authenticating…</>
                  : <>Access Dashboard <ArrowRight size={17} /></>
                }
              </button>
            </form>

            <footer className="animate-slide-up stagger-4" style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.8125rem', color: '#6B778C' }}>
              Having trouble? {' '}
              <span style={{ color: '#0052CC', cursor: 'pointer', fontWeight: '600' }}>Contact Admin</span>
            </footer>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }

        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-spin { animation: spin 1s linear infinite; }

        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }

        .login-input {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .login-input:focus {
          background: #fff !important;
          border-color: #0052CC !important;
          box-shadow: 0 4px 12px rgba(0,82,204,0.15) !important;
          transform: translateY(-1px);
        }
        .login-submit {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .login-submit:hover:not(:disabled) { 
          opacity: 0.95 !important; 
          transform: translateY(-2px); 
          box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
        }
        .login-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .role-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .role-btn:hover { 
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(9,30,66,0.08);
        }
        @media (max-width: 768px) {
          .login-panel { display: none !important; }
          div[style*="translateX"] { transform: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
