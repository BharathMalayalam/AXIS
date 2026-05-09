import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, User, Users, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';

const roleConfigs = {
  admin: {
    icon: <Shield size={22} />,
    label: 'Administrator',
    color: '#007BFF',
    bg: '#E6F3FF',
    gradient: 'linear-gradient(135deg, #007BFF 0%, #4DA3FF 100%)',
    instructions: [
      'Manage platform users and permissions',
      'Oversee global project performance',
      'Finalize and archive completions',
    ]
  },
  teamleader: {
    icon: <Users size={22} />,
    label: 'Team Leader',
    color: '#0056CC',
    bg: '#CCE5FF',
    gradient: 'linear-gradient(135deg, #0056CC 0%, #007BFF 100%)',
    instructions: [
      'Orchestrate project roadmaps',
      'Review and verify submissions',
      'Mentor developer growth',
    ]
  },
  developer: {
    icon: <User size={22} />,
    label: 'Developer',
    color: '#004499',
    bg: '#B3D9FF',
    gradient: 'linear-gradient(135deg, #004499 0%, #0056CC 100%)',
    instructions: [
      'Execute high-impact modules',
      'Submit work for rapid review',
      'Collaborate on feature delivery',
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
        const targetPath = r === 'admin' ? '/admin' : r === 'teamleader' ? '/tl' : '/dev';
        navigate(targetPath, { replace: true });
      } else {
        setError(res.error || 'Invalid credentials. Please verify your ID and password.');
      }
    } catch (err) {
      setError('System unreachable. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const rc = roleConfigs[role];

  return (
    <div className="login-wrapper">
      <div className="login-bg">
        <div className="login-blob" style={{ background: rc.color, opacity: 0.15 }}></div>
      </div>

      <Link to="/" className="login-back btn btn-ghost btn-pill">
        <ChevronLeft size={18} /> Back to Home
      </Link>

      <div className="login-container glass">
        {/* Left Side: Branding */}
        <div className="login-branding" style={{ background: rc.gradient }}>
          <div className="login-logo-container">
            <div className="login-logo-icon">
              <img src="/axis-logo.png" alt="AXIS" />
            </div>
            <h1>AXIS</h1>
          </div>

          <div className="login-instructions animate-fade" key={role}>
            <h3>{rc.label} Portal</h3>
            <div className="instruction-list">
              {rc.instructions.map((text, i) => (
                <div key={i} className="instruction-item stagger-1">
                  <CheckCircle2 size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="login-branding-footer">
            <span>Enterprise Grade Security</span>
            <Shield size={16} />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-side">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Access your workspace to continue building.</p>
          </div>

          <div className="role-selector">
            {Object.entries(roleConfigs).map(([key, cfg]) => (
              <button
                key={key}
                className={`role-tab ${role === key ? 'active' : ''}`}
                onClick={() => setRole(key)}
                style={{ '--active-color': cfg.color, '--active-bg': cfg.bg }}
              >
                <span className="role-icon">{cfg.icon}</span>
                <span className="role-name">{key}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="login-error animate-in">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">User Identity</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Enter your ${role} ID`}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Secret Key</label>
                <Link to="/forgot-password" style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', textDecoration: 'none', marginBottom: '0.5rem' }}>
                  Forgot Password?
                </Link>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full mt-4" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 size={20} className="animate-spin" /> Verifying...</>
              ) : (
                <>Enter Workspace <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Forgot your credentials? <a href="#">Contact IT Support</a></p>
          </div>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F4F5F7;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .login-blob {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(100px);
          top: -200px;
          right: -200px;
          transition: background 0.8s ease;
        }

        .login-back {
          position: absolute;
          top: 2rem;
          left: 2rem;
          z-index: 10;
        }

        .login-container {
          width: 100%;
          max-width: 1000px;
          height: 640px;
          display: flex;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          position: relative;
          z-index: 1;
          border: none;
          box-shadow: var(--shadow-xl);
        }

        /* Branding Side */
        .login-branding {
          flex: 0.8;
          padding: 4rem;
          display: flex;
          flex-direction: column;
          color: white;
          position: relative;
          transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 5rem;
        }

        .login-logo-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .login-logo-icon img {
          width: 32px;
          filter: brightness(10);
        }

        .login-logo-container h1 {
          color: white;
          font-size: 2.25rem;
          margin: 0;
        }

        .login-instructions h3 {
          color: white;
          font-size: 1.75rem;
          margin-bottom: 2rem;
        }

        .instruction-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .instruction-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.05rem;
          opacity: 0.9;
        }

        .login-branding-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.6;
        }

        /* Form Side */
        .login-form-side {
          flex: 1;
          background: white;
          padding: 4rem;
          display: flex;
          flex-direction: column;
        }

        .login-header h2 {
          font-size: 2.25rem;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          margin-bottom: 3rem;
        }

        .role-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .role-tab {
          padding: 1rem 0.5rem;
          border: 2px solid var(--border);
          background: white;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: var(--transition-base);
        }

        .role-tab.active {
          border-color: var(--active-color);
          background: var(--active-bg);
        }

        .role-icon {
          color: var(--text-muted);
          transition: var(--transition-base);
        }

        .role-tab.active .role-icon {
          color: var(--active-color);
          transform: scale(1.1);
        }

        .role-name {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .role-tab.active .role-name {
          color: var(--active-color);
        }

        .login-error {
          padding: 1rem;
          background: var(--danger-bg);
          color: var(--danger);
          border-radius: var(--radius-sm);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-placeholder);
          transition: var(--transition-base);
        }

        .form-input {
          padding-left: 3rem;
          background: #F8F9FC;
        }

        .form-input:focus + .input-icon {
          color: var(--primary);
        }

        .login-footer {
          margin-top: auto;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .login-footer a {
          color: var(--primary);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .login-container {
            flex-direction: column;
            height: auto;
            max-width: 480px;
          }
          .login-branding {
            padding: 2.5rem 2rem;
          }
          .login-logo-container {
            margin-bottom: 1.5rem;
          }
          .login-instructions h3 {
            font-size: 1.5rem;
            margin-bottom: 1.25rem;
          }
          .instruction-list { gap: 0.875rem; }
          .instruction-item { font-size: 0.9375rem; }
          .login-branding-footer { margin-top: 1.5rem; }
          .login-form-side {
            padding: 2.5rem 2rem;
          }
          .login-header h2 { font-size: 1.75rem; }
          .login-header p { margin-bottom: 2rem; }
          .role-selector {
            grid-template-columns: repeat(3, 1fr);
            margin-bottom: 1.75rem;
          }
          .role-tab { padding: 0.75rem 0.375rem; }
        }

        @media (max-width: 640px) {
          .login-wrapper {
            padding: 0;
            align-items: flex-start;
          }
          .login-back {
            top: 0.75rem;
            left: 0.75rem;
            padding: 0.375rem 0.75rem;
            font-size: 0.8rem;
          }
          .login-container {
            max-width: 100%;
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }
          .login-branding {
            padding: 3rem 1.5rem 1.5rem;
            border-radius: 0;
          }
          .login-logo-container {
            margin-bottom: 1.25rem;
          }
          .login-logo-container h1 { font-size: 1.75rem; }
          .login-logo-icon { width: 42px; height: 42px; border-radius: 12px; }
          .login-logo-icon img { width: 26px; }
          .login-instructions h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
          }
          .instruction-list { gap: 0.75rem; }
          .instruction-item { font-size: 0.875rem; gap: 0.75rem; }
          .login-branding-footer { font-size: 0.75rem; margin-top: 1.25rem; }
          .login-form-side {
            padding: 1.75rem 1.5rem 2rem;
          }
          .login-header h2 {
            font-size: 1.5rem;
            margin-bottom: 0.375rem;
          }
          .login-header p { font-size: 0.875rem; margin-bottom: 1.5rem; }
          .role-selector {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }
          .role-tab { padding: 0.625rem 0.25rem; gap: 0.375rem; }
          .role-icon { transform: scale(0.9); }
          .role-name { font-size: 0.625rem; }
          .login-form { gap: 1.125rem; }
          .login-error { padding: 0.75rem; margin-bottom: 1.25rem; font-size: 0.8125rem; }
          .form-label { font-size: 0.75rem; }
        }

        @media (max-width: 480px) {
          .login-blob {
            width: 300px;
            height: 300px;
            top: -80px;
            right: -80px;
          }
          .login-branding {
            padding: 2.5rem 1.25rem 1.25rem;
          }
          .login-form-side {
            padding: 1.5rem 1.25rem 1.5rem;
          }
          .login-header h2 {
            font-size: 1.375rem;
          }
          .instruction-item {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
