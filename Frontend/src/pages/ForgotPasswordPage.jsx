import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, ChevronLeft, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Cannot connect to server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-bg">
        <div className="fp-blob"></div>
      </div>

      <Link to="/login" className="fp-back btn btn-ghost btn-pill">
        <ChevronLeft size={18} /> Back to Login
      </Link>

      <div className="fp-card glass">
        <div className="fp-icon-wrap">
          <Shield size={28} />
        </div>

        {!success ? (
          <>
            <h2>Forgot your password?</h2>
            <p>Enter the email address associated with your account and we'll send you a link to reset your password.</p>

            {error && (
              <div className="fp-error animate-in">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="fp-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 size={20} className="animate-spin" /> Sending...</>
                ) : (
                  <>Send Reset Link <ArrowRight size={20} /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="fp-success">
            <div className="fp-success-icon">
              <CheckCircle2 size={32} />
            </div>
            <h3>Check your email</h3>
            <p>
              If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly. Check your inbox and spam folder.
            </p>
            <Link to="/login" className="btn btn-primary btn-lg w-full" style={{ marginTop: '1.5rem' }}>
              Return to Login
            </Link>
          </div>
        )}

        <div className="fp-footer">
          <p>Remember your password? <Link to="/login">Sign in</Link></p>
        </div>
      </div>

      <style>{`
        .fp-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F4F5F7;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .fp-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .fp-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          background: #007BFF;
          opacity: 0.1;
          top: -150px;
          right: -150px;
        }

        .fp-back {
          position: absolute;
          top: 2rem;
          left: 2rem;
          z-index: 10;
        }

        .fp-card {
          width: 100%;
          max-width: 460px;
          padding: 3rem;
          border-radius: var(--radius-2xl);
          background: #fff;
          box-shadow: var(--shadow-xl);
          position: relative;
          z-index: 1;
        }

        .fp-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: var(--primary-xlight);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .fp-card h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .fp-card > p {
          color: var(--text-muted);
          font-size: 0.9375rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .fp-error {
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

        .fp-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .fp-success {
          text-align: center;
        }

        .fp-success-icon {
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

        .fp-success h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .fp-success p {
          color: var(--text-muted);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .fp-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .fp-footer a {
          color: var(--primary);
          font-weight: 600;
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

        .fp-card .form-input {
          padding-left: 3rem;
          background: #F8F9FC;
        }

        @media (max-width: 640px) {
          .fp-wrapper { padding: 1rem; }
          .fp-card { padding: 2rem; border-radius: var(--radius-lg); }
          .fp-card h2 { font-size: 1.375rem; }
          .fp-back { top: 1rem; left: 1rem; font-size: 0.8rem; }
        }

        @media (max-width: 480px) {
          .fp-wrapper { padding: 0; align-items: flex-start; }
          .fp-card { border-radius: 0; max-width: 100%; min-height: 100vh; padding: 4rem 1.5rem 2rem; }
          .fp-back { top: 0.75rem; left: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
