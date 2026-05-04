import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowRight, CheckCircle2, BarChart3, Zap,
  Layout, MessageSquare, Shield, Users, Briefcase, ChevronRight, Play, Star
} from 'lucide-react';

const HomePage = () => {
  const { currentUser } = useApp();
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.1 });

    const sections = ['hero-pinned-content', 'features-section', 'roles-section'];
    sections.forEach(id => {
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
    <div style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'hidden', color: '#172B4D', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Navbar ── */}
      <div style={{ padding: '1.5rem 5% 0', position: 'fixed', width: '100%', zIndex: 1000 }}>
        <nav style={{
          maxWidth: '1200px', margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '100px',
          height: '76px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2.5rem',
          boxShadow: '0 10px 40px rgba(9, 30, 66, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          transform: scrollY > 50 ? 'translateY(-10px) scale(0.98)' : 'translateY(0) scale(1)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '36px', height: '36px', background: '#0052CC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/axis-logo.png" alt="AXIS" style={{ width: '24px', filter: 'brightness(10)' }} />
            </div>
            <span style={{ fontSize: '1.375rem', fontWeight: '900', color: '#0052CC', letterSpacing: '-0.04em' }}>AXIS</span>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }} className="nav-links-desktop">
            {['Features', 'Solutions', 'Pricing', 'Resources'].map(n => (
              <span key={n} style={{ fontSize: '0.9rem', fontWeight: '600', color: '#42526E', cursor: 'pointer', transition: 'color 0.2s' }} className="nav-text-link">{n}</span>
            ))}
          </div>

          <Link to={dashboardPath} style={{
            padding: '0.75rem 1.75rem', background: '#0052CC', color: '#fff',
            borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem',
            boxShadow: '0 8px 20px rgba(0, 82, 204, 0.25)', transition: 'all 0.3s',
            textDecoration: 'none'
          }} className="nav-cta">
            {currentUser ? 'Dashboard' : 'Login'}
          </Link>
        </nav>
      </div>

      {/* ── Hero Section with Scroll Pinning ── */}
      <section style={{ height: '120vh', position: 'relative' }}>
        <div style={{
          position: 'sticky',
          top: 0,
          height: '120vh',
          display: 'flex',
          alignItems: 'flex-start', 
          paddingTop: '160px', 
          overflow: 'hidden',
          background: 'radial-gradient(circle at top right, #E3FCEF 0%, #ffffff 40%)',
        }}>
          {/* Background Design */}
          <div style={{ position: 'absolute', top: '100px', right: '15%', width: '2px', height: '100%', background: '#36B37E', opacity: 0.3, zIndex: 0 }} />

          <div id="hero-pinned-content" style={{ 
            maxWidth: '1300px', margin: '0 auto', 
            display: 'flex', alignItems: 'flex-start', gap: '6rem', 
            zIndex: 1, flexWrap: 'wrap', padding: '0 8%',
          }}>
            
            {/* Hero Left Content */}
            <div style={{ flex: '1.2', minWidth: '400px' }}>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
                fontWeight: '900', color: '#172B4D',
                lineHeight: '1.1',
                letterSpacing: '-0.05em',
                marginBottom: '2rem',
              }}>
                Build fast. Stay focused. Deliver smarter with <span style={{ color: '#0052CC' }}>AXIS</span>
              </h1>
              
              <p style={{
                fontSize: '1.125rem', color: '#42526E',
                lineHeight: '1.8', marginBottom: '3.5rem',
                maxWidth: '540px',
              }}>
                The project management platform for agile software teams. AXIS helps you plan, track, and release great software — together.
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
                <Link to={dashboardPath} style={{
                  padding: '1.125rem 2.5rem', background: '#DEEBFF', color: '#0052CC',
                  borderRadius: '50px', fontWeight: '700', fontSize: '1rem',
                  transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  textDecoration: 'none', border: '1px solid #B3D4FF'
                }} className="hero-cta-light">
                  Contact us
                </Link>
                <button style={{
                  padding: '1.125rem 2.5rem', background: '#253858', color: '#fff',
                  borderRadius: '50px', fontWeight: '700', fontSize: '1rem',
                  transition: 'all 0.3s', cursor: 'pointer', border: 'none',
                  boxShadow: '0 10px 30px rgba(37, 56, 88, 0.2)',
                }} className="hero-cta-dark">
                  Explore Solutions
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#6B778C', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Teams Trusted on</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ 
                          width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #fff', 
                          marginLeft: '-10px', overflow: 'hidden', background: '#F4F5F7',
                          zIndex: 5-i
                        }}>
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '1.375rem', fontWeight: '900', color: '#172B4D' }}>100K+</span>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#6B778C', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modules Delivered</p>
                  <div style={{ fontSize: '1.375rem', fontWeight: '900', color: '#172B4D' }}>3.5M+</div>
                </div>
              </div>
            </div>

            {/* Hero Right */}
            <div style={{ flex: '1', position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: '480px',
                height: '580px',
                borderRadius: '40px 40px 100px 40px',
                border: '2px solid #36B37E',
                padding: '0.75rem',
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.4)',
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '30px 30px 90px 30px', overflow: 'hidden' }}>
                  <img 
                    src="https://thumbs.dreamstime.com/b/teamwork-team-together-collaboration-business-communication-outd-outdoors-concept-48568990.jpg" 
                    alt="Team Collaboration" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Floating Badge */}
                <div style={{
                  position: 'absolute', 
                  left: '-40px', 
                  top: '60px',
                  transform: `translateY(${Math.min((scrollY / (window.innerHeight * 0.45)) * 380, 420)}px)`,
                  background: '#fff', border: '2px solid #36B37E', borderRadius: '24px',
                  padding: '1.5rem', width: '220px',
                  boxShadow: '0 20px 50px rgba(54, 179, 126, 0.15)',
                  zIndex: 10,
                  transition: 'transform 0.1s ease-out'
                }}>
                  <p style={{ fontSize: '0.9rem', color: '#36B37E', fontWeight: '700', lineHeight: '1.5' }}>
                    Plan with clarity. Execute with speed. Succeed together
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features-section" style={{ padding: '8rem 8%', background: '#fff' }}>
        <div style={{ 
          textAlign: 'center', maxWidth: '700px', margin: '0 auto 6rem',
          opacity: visibleSections['features-section'] ? 1 : 0,
          transform: visibleSections['features-section'] ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <span style={{ color: '#0052CC', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Core Capabilities</span>
          <h2 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#172B4D', marginTop: '1rem' }}>Everything your team needs to plan, track, and ship great software</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }} className="features-grid">
          {[
            { icon: <Layout size={32} />, title: 'Plan with Agility', desc: 'Create user stories, plan sprints, and distribute tasks across your software team.', color: '#0052CC' },
            { icon: <Zap size={32} />, title: 'Track in Real-Time', desc: 'Prioritize and discuss your team\'s work in full context with complete visibility.', color: '#FFAB00' },
            { icon: <Shield size={32} />, title: 'Release with Confidence', desc: 'Ship on-time software with confidence knowing information is always up-to-date.', color: '#36B37E' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '3rem 2.5rem', borderRadius: '32px', border: '1px solid #DFE1E6',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default',
              opacity: visibleSections['features-section'] ? 1 : 0,
              transform: visibleSections['features-section'] ? 'translateY(0)' : 'translateY(50px)',
              transitionDelay: `${i * 150}ms`,
              boxShadow: '0 4px 12px rgba(9, 30, 66, 0.04)'
            }} className="feature-card-new">
              <div style={{ color: f.color, marginBottom: '2rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.25rem' }}>{f.title}</h3>
              <p style={{ color: '#42526E', lineHeight: '1.7', fontSize: '1rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role Sections ── */}
      <section id="roles-section" style={{ padding: '8rem 8%', background: '#F4F5F7' }}>
         <div style={{ 
           display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1200px', margin: '0 auto',
           opacity: visibleSections['roles-section'] ? 1 : 0,
           transform: visibleSections['roles-section'] ? 'translateY(0)' : 'translateY(30px)',
           transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
         }} className="roles-grid">
            {[
              { role: 'Admin', icon: <Shield size={28} />, desc: 'Full control over users, projects, and security compliance.' },
              { role: 'Team Leader', icon: <Users size={28} />, desc: 'Review code, manage modules, and guide developer success.' },
              { role: 'Developer', icon: <Briefcase size={28} />, desc: 'Focus on coding, track modules, and deliver features.' },
            ].map((r, i) => (
              <div key={i} style={{ background: '#fff', padding: '3rem 2.5rem', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#DEEBFF', color: '#0052CC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>{r.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>{r.role}</h3>
                <p style={{ color: '#6B778C', fontSize: '1rem', lineHeight: '1.7' }}>{r.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '6rem 8% 4rem', background: '#091E42', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4rem', marginBottom: '5rem' }}>
            <div style={{ maxWidth: '350px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#0052CC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/axis-logo.png" alt="AXIS" style={{ width: '28px', filter: 'brightness(10)' }} />
                </div>
                <span style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.04em' }}>AXIS</span>
              </div>
              <p style={{ color: '#B3D4FF', lineHeight: '1.8', fontSize: '1.05rem' }}>The project management platform for modern software teams. Plan, track, and ship with confidence.</p>
            </div>
            <div style={{ display: 'flex', gap: '6rem', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontWeight: '800', marginBottom: '1.75rem', fontSize: '1.125rem' }}>Product</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#B3D4FF', fontSize: '1rem' }}>
                  <span>Features</span><span>Pricing</span><span>Integrations</span>
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: '800', marginBottom: '1.75rem', fontSize: '1.125rem' }}>Company</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#B3D4FF', fontSize: '1rem' }}>
                  <span>About</span><span>Careers</span><span>Contact</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem', textAlign: 'center', color: '#6B778C', fontSize: '0.95rem' }}>
            © 2026 AXIS Intelligence Systems. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        .nav-text-link:hover { color: #0052CC !important; }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0, 82, 204, 0.4) !important; background: #0747A6 !important; }
        .hero-cta-light:hover { background: #B3D4FF !important; transform: translateY(-2px); }
        .hero-cta-dark:hover { transform: translateY(-2px); box-shadow: 0 15px 40px rgba(37, 56, 88, 0.3) !important; background: #172B4D !important; }
        .feature-card-new:hover { border-color: #0052CC !important; transform: translateY(-8px); box-shadow: 0 20px 40px rgba(9, 30, 66, 0.08); }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }

        @media (max-width: 1200px) {
          .nav-links-desktop { display: none !important; }
          .hero-section { text-align: center; }
          .hero-left { flex: 1 !important; text-align: center; }
          .hero-right { display: none !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .roles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
