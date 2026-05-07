import { useApp } from '../../context/AppContext';
import { Briefcase, Calendar, ChevronRight, Layers, Clock } from 'lucide-react';
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
        <div className="header-actions">
          <span className="status-pill" style={{ background: 'var(--primary-xlight)', color: 'var(--primary)', border: '1px solid #B3D4FF' }}>
            <Briefcase size={14} />
            {myProjects.length} {myProjects.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>
      </div>

      {myProjects.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state-icon"><Briefcase size={28} /></div>
            <p className="empty-state-title">No Projects Assigned Yet</p>
            <p className="empty-state-text">Waiting for Admin to assign new projects to your queue.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {myProjects.map(proj => {
            const projModules    = modules.filter(m => (m.projectId?._id || m.projectId) === proj._id);
            const completedCount = projModules.filter(m => m.status === 'completed').length;
            const progress       = projModules.length > 0 ? Math.round((completedCount / projModules.length) * 100) : 0;
            const progressColor  = progress >= 80 ? 'var(--success)' : progress >= 40 ? 'var(--primary)' : 'var(--warning)';
            const isOverdue      = proj.deadline && new Date(proj.deadline) < new Date() && proj.status !== 'completed';

            return (
              <div key={proj._id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${progressColor}` }}>
                <div style={{ padding: '1.375rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                    <span className={`badge badge-${proj.status}`}>{(proj.status || '').replace('_', ' ')}</span>
                    {isOverdue && <span className="badge badge-rejected">Overdue</span>}
                  </div>

                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '.5rem', lineHeight: 1.3 }}>{proj.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                    {proj.description || 'No description provided for this project.'}
                  </p>

                  {proj.deadline && (
                    <div className="flex items-center gap-1 text-sm" style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: 600 }}>
                      <Clock size={13} />
                      Due: {new Date(proj.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}

                  {/* Progress */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '.5rem' }}>
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        <Layers size={13} /> {projModules.length} Modules
                      </div>
                      <span className="text-sm" style={{ fontWeight: 800, color: progressColor }}>{progress}%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${progress}%`, background: progressColor }} />
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/tl/modules', { state: { projectId: proj._id } })}
                    className="btn btn-primary w-full"
                    style={{ justifyContent: 'center' }}
                  >
                    Manage Modules <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default TLProjects;
