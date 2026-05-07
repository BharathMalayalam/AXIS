import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowRight, CheckCircle2, Zap,
  Layout, Shield, Users, Briefcase, Play, Star, Globe, Rocket, Award
} from 'lucide-react';

const HomePage = () => {
  const { currentUser } = useApp();
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.1 });

    ['hero', 'features', 'roles', 'trust', 'cta'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const dashboardPath = currentUser
    ? currentUser.role?.toLowerCase() === 'admin' ? '/admin'
      : currentUser.role?.toLowerCase() === 'teamleader' ? '/tl'
        : '/dev'
    : '/login';

  return (
    <div className="hp-wrapper">
      {/* ── Navbar ── */}
      <nav className={`hp-nav ${scrollY > 50 ? 'hp-nav-scrolled' : ''}`}>
        <div className="hp-nav-container">
          <Link to="/" className="hp-logo">
            <div className="hp-logo-icon">
              <img src="/axis-logo.png" alt="AXIS" />
            </div>
            <span>AXIS</span>
          </Link>

          <div className="hp-nav-links">
            {['Features', 'Solutions', 'Enterprise', 'Resources'].map(n => (
              <a key={n} href={`#${n.toLowerCase()}`} className="hp-nav-link">{n}</a>
            ))}
          </div>

          <div className="hp-nav-actions">
            {!currentUser && <Link to="/login" className="hp-nav-btn-text">Log in</Link>}
            <Link to={dashboardPath} className="btn btn-primary btn-pill btn-lg">
              {currentUser ? 'Go to Dashboard' : 'Get AXIS Free'}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="hero" className="hp-hero">
        <div className="hp-hero-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="hp-container">
          <div className="hp-hero-content">
            <div className="hp-hero-tag animate-up stagger-1">
              <Star size={14} fill="currentColor" />
              <span>Next-Gen Project Management</span>
            </div>

            <h1 className="hp-hero-title animate-up stagger-2">
              Accelerate your team's <span className="text-gradient">velocity</span> with AXIS
            </h1>

            <p className="hp-hero-subtitle animate-up stagger-3">
              The premium agile platform that scales with your ambition. Plan intuitively, track precisely, and release software that matters.
            </p>

            <div className="hp-hero-btns animate-up" style={{ animationDelay: '0.4s' }}>
              <Link to={dashboardPath} className="btn btn-primary btn-xl btn-pill">
                Start your journey
                <Rocket size={20} />
              </Link>
              <button className="btn btn-ghost btn-xl btn-pill">
                <Play size={20} fill="currentColor" />
                Watch Demo
              </button>
            </div>

            <div className="hp-hero-trust animate-up" style={{ animationDelay: '0.5s' }}>
              <div className="hp-avatars">
                {[1, 2, 3, 4, 5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" />
                ))}
              </div>
              <div className="hp-trust-text">
                <strong>Joined by 10,000+</strong> engineering teams worldwide
              </div>
            </div>
          </div>

          <div className="hp-hero-visual animate-fade" style={{ animationDelay: '0.6s' }}>
            <div className="hp-dashboard-preview glass">
              <div className="hp-preview-header">
                <div className="hp-preview-dots"><span></span><span></span><span></span></div>
                <div className="hp-preview-search">Search projects...</div>
              </div>
              <div className="hp-preview-body">
                <div className="hp-preview-sidebar">
                  {[1, 2, 3, 4].map(i => <div key={i} className="hp-sidebar-item"></div>)}
                </div>
                <div className="hp-preview-content">
                  <div className="hp-content-top"></div>
                  <div className="hp-content-grid">
                    <div className="hp-grid-card"></div>
                    <div className="hp-grid-card"></div>
                    <div className="hp-grid-card"></div>
                  </div>
                </div>
              </div>
              {/* Floating Element */}
              <div className="hp-floating-card glass animate-float">
                <div className="hp-floating-icon"><Zap size={20} /></div>
                <div>
                  <div className="hp-floating-label">Velocity</div>
                  <div className="hp-floating-value">+24%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className={`hp-features ${visibleSections['features'] ? 'section-visible' : ''}`}>
        <div className="hp-container">
          <div className="hp-section-header">
            <span className="hp-section-tag">Powerful Core</span>
            <h2 className="hp-section-title">Built for the modern workflow</h2>
            <p className="hp-section-desc">Sophisticated tools designed to keep your team in the flow state.</p>
          </div>

          <div className="hp-features-grid">
            {[
              { icon: <Layout />, title: 'Smart Planning', desc: 'Predictive sprint planning that adapts to your team\'s historical velocity.', color: 'blue' },
              { icon: <Zap />, title: 'Instant Insights', desc: 'Real-time analytics dashboards that visualize bottlenecks before they happen.', color: 'teal' },
              { icon: <Shield />, title: 'Enterprise Security', desc: 'Military-grade encryption and granular RBAC to protect your intellectual property.', color: 'purple' },
              { icon: <Globe />, title: 'Global Sync', desc: 'Seamless collaboration for distributed teams with zero latency updates.', color: 'indigo' },
              { icon: <Award />, title: 'Quality Guard', desc: 'Automated verification workflows to ensure every release meets your standards.', color: 'green' },
              { icon: <Users />, title: 'Social Dev', desc: 'Integrated discussion threads and pair programming tools built-in.', color: 'orange' },
            ].map((f, i) => (
              <div key={i} className="hp-feature-card">
                <div className={`hp-feature-icon hp-icon-${f.color}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="hp-feature-link">Learn more <ArrowRight size={16} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Showcase ── */}
      <section id="roles" className={`hp-roles ${visibleSections['roles'] ? 'section-visible' : ''}`}>
        <div className="hp-container">
          <div className="hp-roles-layout">
            <div className="hp-roles-content">
              <span className="hp-section-tag">Role-Based Experience</span>
              <h2 className="hp-section-title">Tailored for every team member</h2>
              <div className="hp-roles-list">
                {[
                  { role: 'Administrators', desc: 'Command center for project governance and team health.' },
                  { role: 'Team Leaders', desc: 'Streamlined review processes and roadmap management.' },
                  { role: 'Developers', desc: 'Distraction-free environment for deep coding sessions.' },
                ].map((r, i) => (
                  <div key={i} className="hp-role-item">
                    <div className="hp-role-bullet"></div>
                    <div>
                      <h4>{r.role}</h4>
                      <p>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hp-roles-visual">
              <div className="hp-roles-image-stack">
                <div className="hp-role-img img-1 glass"></div>
                <div className="hp-role-img img-2 glass"></div>
                <div className="hp-role-img img-3 glass"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section id="cta" className={`hp-cta ${visibleSections['cta'] ? 'section-visible' : ''}`}>
        <div className="hp-container">
          <div className="hp-cta-box glass animate-up">
            <h2>Ready to transform your delivery?</h2>
            <p>Join thousands of high-performing teams using AXIS to build the future.</p>
            <div className="hp-cta-btns">
              <Link to="/login" className="btn btn-primary btn-xl btn-pill">Get Started for Free</Link>
              <button className="btn btn-ghost btn-xl btn-pill">Talk to Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="hp-footer">
        <div className="hp-container">
          <div className="hp-footer-top">
            <div className="hp-footer-brand">
              <div className="hp-logo">
                <div className="hp-logo-icon">
                  <img src="/axis-logo.png" alt="AXIS" />
                </div>
                <span>AXIS</span>
              </div>
              <p>The premium project management platform for high-velocity software teams.</p>
            </div>
            <div className="hp-footer-grid">
              <div>
                <h4>Product</h4>
                <ul>
                  <li><a href="#">Changelog</a></li>
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">API</a></li>
                </ul>
              </div>
              <div>
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Privacy</a></li>
                </ul>
              </div>
              <div>
                <h4>Support</h4>
                <ul>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Community</a></li>
                  <li><a href="#">Status</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="hp-footer-bottom">
            <p>© 2026 AXIS Intelligence Systems. Crafted for excellence.</p>
            <div className="hp-socials">
              {/* Social icons could go here */}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .hp-wrapper {
          background: #ffffff;
          color: var(--text-primary);
          overflow-x: hidden;
        }

        .hp-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 2.5rem;
        }

        /* Navbar */
        .hp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          height: 90px;
          display: flex;
          align-items: center;
          transition: var(--transition-base);
        }

        .hp-nav-scrolled {
          height: 72px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .hp-nav-container {
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          padding: 0 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hp-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 900;
          font-size: 1.5rem;
          letter-spacing: -0.04em;
          color: var(--primary);
        }

        .hp-logo-icon {
          width: 40px;
          height: 40px;
          background: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0, 82, 204, 0.2);
        }

        .hp-logo-icon img {
          width: 26px;
          filter: brightness(10);
        }

        .hp-nav-links {
          display: flex;
          gap: 2.5rem;
        }

        .hp-nav-link {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .hp-nav-link:hover { color: var(--primary); }

        .hp-nav-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .hp-nav-btn-text {
          font-weight: 600;
          color: var(--text-secondary);
        }

        /* Hero */
        .hp-hero {
          position: relative;
          padding: 200px 0 100px;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .hp-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }

        .blob-1 { width: 500px; height: 500px; background: #E6F3FF; top: -100px; right: -100px; }
        .blob-2 { width: 400px; height: 400px; background: #CCE5FF; bottom: 0; left: -100px; }
        .blob-3 { width: 300px; height: 300px; background: #B3D9FF; top: 20%; left: 30%; }

        .hp-hero .hp-container {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hp-hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--primary-xlight);
          color: var(--primary);
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2rem;
        }

        .hp-hero-title {
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 900;
          margin-bottom: 2rem;
          line-height: 1.05;
        }

        .text-gradient {
          background: var(--gradient-premium);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hp-hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 3.5rem;
          max-width: 580px;
        }

        .hp-hero-btns {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 4rem;
        }

        .hp-hero-trust {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .hp-avatars {
          display: flex;
        }

        .hp-avatars img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid white;
          margin-left: -12px;
          box-shadow: var(--shadow-sm);
        }

        .hp-avatars img:first-child { margin-left: 0; }

        .hp-trust-text {
          font-size: 0.9375rem;
          color: var(--text-muted);
        }

        .hp-trust-text strong { color: var(--text-primary); }

        /* Hero Visual */
        .hp-dashboard-preview {
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.5);
          position: relative;
        }

        .hp-preview-header {
          height: 40px;
          background: rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          padding: 0 1rem;
          gap: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .hp-preview-dots { display: flex; gap: 0.5rem; }
        .hp-preview-dots span { width: 8px; height: 8px; border-radius: 50%; background: rgba(0, 0, 0, 0.1); }
        .hp-preview-search { 
          flex: 1; 
          height: 24px; 
          background: rgba(0, 0, 0, 0.03); 
          border-radius: 12px;
          font-size: 0.75rem;
          padding: 0 0.75rem;
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.2);
        }

        .hp-preview-body { display: flex; flex: 1; }
        .hp-preview-sidebar { width: 80px; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; border-right: 1px solid rgba(0, 0, 0, 0.05); }
        .hp-sidebar-item { height: 12px; background: rgba(0, 0, 0, 0.04); border-radius: 6px; }
        .hp-preview-content { flex: 1; padding: 1.5rem; }
        .hp-content-top { height: 20px; width: 40%; background: rgba(0, 0, 0, 0.04); border-radius: 10px; margin-bottom: 2rem; }
        .hp-content-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .hp-grid-card { aspect-ratio: 1; background: rgba(0, 0, 0, 0.03); border-radius: 12px; }

        .hp-floating-card {
          position: absolute;
          bottom: 30px;
          left: -40px;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 180px;
          box-shadow: var(--shadow-lg);
        }

        .hp-floating-icon {
          width: 40px;
          height: 40px;
          background: var(--success);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hp-floating-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .hp-floating-value { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }

        /* Sections General */
        .hp-section-header { text-align: center; max-width: 700px; margin: 0 auto 5rem; }
        .hp-section-tag { color: var(--primary); font-weight: 800; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 1rem; }
        .hp-section-title { font-size: 3rem; font-weight: 900; margin-bottom: 1.5rem; }
        .hp-section-desc { font-size: 1.125rem; color: var(--text-secondary); }

        /* Features */
        .hp-features { padding: 120px 0; }
        .hp-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        
        .hp-feature-card {
          padding: 3rem;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          transition: var(--transition-base);
          position: relative;
        }

        .hp-feature-card:hover {
          border-color: var(--primary-light);
          box-shadow: var(--shadow-xl);
          transform: translateY(-10px);
        }

        .hp-feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          font-size: 1.5rem;
        }

        .hp-icon-blue { background: #E6F3FF; color: #007BFF; }
        .hp-icon-teal { background: #CCE5FF; color: #0056CC; }
        .hp-icon-purple { background: #B3D9FF; color: #004499; }
        .hp-icon-indigo { background: #99CCFF; color: #003366; }
        .hp-icon-green { background: #80BFFF; color: #002244; }
        .hp-icon-orange { background: #66B3FF; color: #001122; }

        .hp-feature-card h3 { font-size: 1.375rem; font-weight: 800; margin-bottom: 1rem; }
        .hp-feature-card p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; }
        .hp-feature-link { font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; font-size: 0.9375rem; }

        /* Roles */
        .hp-roles { padding: 120px 0; background: #F8F9FC; }
        .hp-roles-layout { display: grid; grid-template-columns: 1fr 1.1fr; gap: 6rem; align-items: center; }
        .hp-roles-list { margin-top: 3.5rem; display: flex; flex-direction: column; gap: 2.5rem; }
        .hp-role-item { display: flex; gap: 1.5rem; }
        .hp-role-bullet { width: 12px; height: 12px; border-radius: 50%; background: var(--primary); margin-top: 0.5rem; flex-shrink: 0; box-shadow: 0 0 0 4px var(--primary-xlight); }
        .hp-role-item h4 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; }
        .hp-role-item p { color: var(--text-secondary); }

        .hp-roles-image-stack { position: relative; height: 500px; width: 100%; }
        .hp-role-img { position: absolute; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); }
        .img-1 { width: 80%; height: 60%; top: 0; right: 0; background: linear-gradient(135deg, #007BFF 0%, #4DA3FF 100%); opacity: 0.8; z-index: 1; }
        .img-2 { width: 70%; height: 50%; bottom: 10%; left: 0; background: linear-gradient(135deg, #0056CC 0%, #007BFF 100%); opacity: 0.9; z-index: 2; }
        .img-3 { width: 60%; height: 40%; top: 20%; left: 10%; background: linear-gradient(135deg, #004499 0%, #0056CC 100%); opacity: 1; z-index: 3; }

        /* CTA */
        .hp-cta { padding: 100px 0; }
        .hp-cta-box {
          padding: 6rem 4rem;
          border-radius: var(--radius-2xl);
          background: var(--gradient-premium);
          color: white;
          text-align: center;
          border: none;
        }

        .hp-cta-box h2 { font-size: 3.5rem; color: white; margin-bottom: 1.5rem; }
        .hp-cta-box p { font-size: 1.25rem; color: rgba(255, 255, 255, 0.8); margin-bottom: 3.5rem; }
        .hp-cta-btns { display: flex; justify-content: center; gap: 1.5rem; }
        .hp-cta-btns .btn-ghost { color: white; border-color: rgba(255, 255, 255, 0.3); }
        .hp-cta-btns .btn-ghost:hover { background: rgba(255, 255, 255, 0.1); }

        /* Footer */
        .hp-footer { padding: 100px 0 50px; border-top: 1px solid var(--border); }
        .hp-footer-top { display: flex; justify-content: space-between; margin-bottom: 6rem; flex-wrap: wrap; gap: 4rem; }
        .hp-footer-brand { max-width: 300px; }
        .hp-footer-brand p { margin-top: 1.5rem; }
        .hp-footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5rem; }
        .hp-footer-grid h4 { font-size: 1rem; font-weight: 800; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .hp-footer-grid ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
        .hp-footer-grid a { color: var(--text-secondary); font-size: 0.9375rem; }
        .hp-footer-grid a:hover { color: var(--primary); }
        
        .hp-footer-bottom { border-top: 1px solid var(--border); padding-top: 3rem; display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 0.875rem; }

        /* Section visibility logic */
        .section-visible .animate-up { opacity: 1; transform: translateY(0); }
        .hp-features-grid > * { opacity: 0; transform: translateY(30px); transition: var(--transition-slow); }
        .section-visible .hp-features-grid > * { opacity: 1; transform: translateY(0); }
        .section-visible .hp-features-grid > *:nth-child(1) { transition-delay: 0.1s; }
        .section-visible .hp-features-grid > *:nth-child(2) { transition-delay: 0.2s; }
        .section-visible .hp-features-grid > *:nth-child(3) { transition-delay: 0.3s; }
        .section-visible .hp-features-grid > *:nth-child(4) { transition-delay: 0.4s; }
        .section-visible .hp-features-grid > *:nth-child(5) { transition-delay: 0.5s; }
        .section-visible .hp-features-grid > *:nth-child(6) { transition-delay: 0.6s; }

        @media (max-width: 1024px) {
          .hp-nav-links { display: none; }
          .hp-hero .hp-container { grid-template-columns: 1fr; text-align: center; }
          .hp-hero-content { display: flex; flex-direction: column; align-items: center; }
          .hp-hero-subtitle { margin-inline: auto; }
          .hp-hero-btns { justify-content: center; }
          .hp-hero-trust { justify-content: center; }
          .hp-features-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-roles-layout { grid-template-columns: 1fr; }
          .hp-roles-visual { display: none; }
          .hp-container { padding: 0 2rem; }
        }

        @media (max-width: 768px) {
          .hp-features-grid { grid-template-columns: 1fr; }
          .hp-hero-title { font-size: 2.75rem; }
          .hp-cta-box h2 { font-size: 2.5rem; }
          .hp-footer-top { flex-direction: column; }
          .hp-footer-grid { grid-template-columns: repeat(2, 1fr); gap: 3rem; }
          .hp-nav-container { padding: 0 1.5rem; }
          .hp-container { padding: 0 1.5rem; }
          .hp-hero { padding: 150px 0 80px; }
          .hp-features { padding: 80px 0; }
          .hp-roles { padding: 80px 0; }
          .hp-cta { padding: 80px 0; }
          .hp-footer { padding: 80px 0 40px; }
        }

        @media (max-width: 640px) {
          .hp-hero-title { font-size: 2.25rem; }
          .hp-section-title { font-size: 2.5rem; }
          .hp-cta-box h2 { font-size: 2rem; }
          .hp-cta-box { padding: 4rem 2rem; }
          .hp-cta-btns { flex-direction: column; align-items: center; }
          .hp-nav-actions { gap: 1rem; }
          .hp-nav { height: 80px; }
          .hp-nav-scrolled { height: 64px; }
        }

        @media (max-width: 480px) {
          .hp-hero { padding: 120px 0 60px; }
          .hp-hero-title { font-size: 1.875rem; }
          .hp-section-title { font-size: 2rem; }
          .hp-cta-box h2 { font-size: 1.75rem; }
          .hp-feature-card { padding: 2rem; }
          .hp-container { padding: 0 1rem; }
          .hp-nav-container { padding: 0 1rem; }
          .hp-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
