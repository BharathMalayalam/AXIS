import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle, ChevronLeft, KeyRound, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Failed to reset password. Please try again.');
      }
    } catch {
      setError('Cannot connect to server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rp-wrapper">
      <div className="rp-bg">
        <div className="rp-blob"></div>
      </div>

      <Link to="/login" className="rp-back btn btn-ghost btn-pill">
        <ChevronLeft size={18} /> Back to Login
      </Link>

      <div className="rp-card glass">
        <div className="rp-icon-wrap">
          <KeyRound size={28} />
        </div>

        {!success ? (
          <>
            <h2>Set new password</h2>
            <p>Your new password must be at least 6 characters. Choose something secure that you haven't used before.</p>

            {error && (
              <div className="rp-error animate-in">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="rp-form">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="rp-toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="rp-strength">
                  <div className="rp-strength-bar">
                    <div
                      className={`rp-strength-fill ${
                        password.length >= 12 ? 'strong' :
                        password.length >= 8 ? 'medium' : 'weak'
                      }`}
                      style={{ width: password.length >= 12 ? '100%' : password.length >= 8 ? '66%' : '33%' }}
                    />
                  </div>
                  <span className="rp-strength-label">
                    {password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Medium' : 'Weak'}
                  </span>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 size={20} className="animate-spin" /> Resetting...</>
                ) : (
                  <>Reset Password <ArrowRight size={20} /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="rp-success">
            <div className="rp-success-icon">
              <CheckCircle2 size={32} />
            </div>
            <h3>Password reset!</h3>
            <p>Your password has been changed successfully. Redirecting you to the login page...</p>
            <Link to="/login" className="btn btn-primary btn-lg w-full" style={{ marginTop: '1.5rem' }}>
              Go to Login
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .rp-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F4F5F7;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .rp-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .rp-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          background: #28A745;
          opacity: 0.1;
          bottom: -150px;
          left: -150px;
        }

        .rp-back {
          position: absolute;
          top: 2rem;
          left: 2rem;
          z-index: 10;
        }

        .rp-card {
          width: 100%;
          max-width: 460px;
          padding: 3rem;
          border-radius: var(--radius-2xl);
          background: #fff;
          box-shadow: var(--shadow-xl);
          position: relative;
          z-index: 1;
        }

        .rp-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--primary-xlight) 0%, var(--success-bg) 100%);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .rp-card h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .rp-card > p {
          color: var(--text-muted);
          font-size: 0.9375rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .rp-error {
          padding: 0.875rem;
          background: var(--danger-bg);
          color: var(--danger);
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .rp-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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
        }

        .rp-card .form-input {
          padding-left: 3rem;
          padding-right: 3rem;
          background: #F8F9FC;
        }

        .rp-toggle-pw {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
        }

        .rp-toggle-pw:hover {
          color: var(--text-primary);
        }

        /* Password strength */
        .rp-strength {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .rp-strength-bar {
          flex: 1;
          height: 4px;
          background: #E9ECEF;
          border-radius: 4px;
          overflow: hidden;
        }

        .rp-strength-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease, background 0.3s ease;
        }

        .rp-strength-fill.weak { background: var(--danger); }
        .rp-strength-fill.medium { background: var(--warning); }
        .rp-strength-fill.strong { background: var(--success); }

        .rp-strength-label {
          font-size: 0.75rem;
          font-weight: 700;
          min-width: 50px;
          text-align: right;
          color: var(--text-muted);
        }

        /* Success */
        .rp-success {
          text-align: center;
        }

        .rp-success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--success-bg);
          color: var(--success);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .rp-success h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .rp-success p {
          color: var(--text-muted);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .rp-wrapper { padding: 1rem; }
          .rp-card { padding: 2rem; border-radius: var(--radius-lg); }
          .rp-card h2 { font-size: 1.375rem; }
          .rp-back { top: 1rem; left: 1rem; font-size: 0.8rem; }
        }

        @media (max-width: 480px) {
          .rp-wrapper { padding: 0; align-items: flex-start; }
          .rp-card { border-radius: 0; max-width: 100%; min-height: 100vh; padding: 4rem 1.5rem 2rem; }
          .rp-back { top: 0.75rem; left: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
