import { useApp } from '../../context/AppContext';
import { Briefcase, Calendar, ChevronRight, Layers, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TLProjects = () => {
  const { currentUser, projects, modules } = useApp();
  const navigate = useNavigate();

  const myProjects = projects.filter(p => (p.assignedTL?._id || p.assignedTL) === currentUser?._id);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assigned Projects</h1>
          <p className="page-subtitle">View and manage projects received from Admin.</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#DEEBFF', border: '1px solid #B3D4FF',
          borderRadius: '20px', fontSize: '0.8125rem', fontWeight: '700', color: '#0052CC',
        }}>
          <Briefcase size={14} />
          {myProjects.length} {myProjects.length === 1 ? 'Project' : 'Projects'}
        </div>
      </div>

      {myProjects.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #DFE1E6', borderRadius: '12px',
          padding: '5rem 2rem', textAlign: 'center',
          boxShadow: '0 1px 4px rgba(9,30,66,0.06)',
        }}>
          <div style={{ width: '64px', height: '64px', background: '#DEEBFF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#0052CC' }}>
            <Briefcase size={32} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#172B4D', marginBottom: '0.5rem' }}>No Projects Assigned Yet</h3>
          <p style={{ color: '#6B778C', fontSize: '0.9rem' }}>Waiting for Admin to assign new projects to your queue.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {myProjects.map(proj => {
            const projModules    = modules.filter(m => (m.projectId?._id || m.projectId) === proj._id);
            const completedCount = projModules.filter(m => m.status === 'completed').length;
            const progress       = projModules.length > 0 ? Math.round((completedCount / projModules.length) * 100) : 0;
            const progressColor  = progress >= 80 ? '#36B37E' : progress >= 40 ? '#0052CC' : '#FFAB00';
            const isOverdue      = proj.deadline && new Date(proj.deadline) < new Date() && proj.status !== 'completed';

            return (
              <div key={proj._id} style={{
                background: '#fff', border: '1px solid #DFE1E6', borderRadius: '12px',
                boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', transition: 'all 0.2s',
              }} className="project-card">
                {/* Card Top Color Bar */}
                <div style={{ height: '4px', background: progressColor }} />

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className={`badge badge-${proj.status}`}>{(proj.status || '').replace('_', ' ')}</span>
                    {isOverdue && (
                      <span style={{ background: '#FFEBE6', color: '#BF2600', border: '1px solid #FFBDAD', borderRadius: '20px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: '700' }}>
                        Overdue
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#172B4D', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {proj.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6B778C', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                    {proj.description || 'No description provided for this project.'}
                  </p>

                  {/* Deadline */}
                  {proj.deadline && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: isOverdue ? '#BF2600' : '#6B778C', marginBottom: '1.25rem', fontWeight: '600' }}>
                      <Clock size={13} />
                      Due: {new Date(proj.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}

                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: '#42526E', fontWeight: '600' }}>
                        <Layers size={13} /> {projModules.length} Modules
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: progressColor }}>{progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#EBECF0', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      <div style={{ width: `${progress}%`, height: '100%', background: progressColor, borderRadius: '3px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => navigate('/tl/modules', { state: { projectId: proj._id } })}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Manage Modules <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .project-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(9,30,66,0.1) !important; border-color: #B3D4FF !important; }
      `}</style>
    </div>
  );
};

export default TLProjects;
