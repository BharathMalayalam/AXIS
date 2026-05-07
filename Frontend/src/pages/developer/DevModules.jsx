import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Calendar, CheckCircle, AlertTriangle, Send, X, MessageSquare, Clock } from 'lucide-react';

const DevModules = () => {
  const { currentUser, modules, projects, submitModule, issues } = useApp();
  const [selectedModule, setSelectedModule] = useState(null);
  const [submitModalModule, setSubmitModalModule] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const myModules = modules.filter(m => (m.assignedDev?._id || m.assignedDev) === currentUser?._id);

  const getProjectName = (mod) => {
    if (!mod.projectId) return 'Unknown';
    if (typeof mod.projectId === 'object') return mod.projectId.name;
    return projects.find(p => p._id === mod.projectId)?.name || 'Unknown';
  };
  const getIssue = (modId) => issues?.find(i => (i.moduleId?._id || i.moduleId) === modId && i.status === 'open');

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select a file to submit.');
    await submitModule(submitModalModule, selectedFile);
    setSubmitModalModule(null); setSelectedFile(null);
  };

  const statusConfig = {
    assigned:  { color: 'var(--primary)',   label: 'Assigned' },
    pending:   { color: 'var(--warning)',    label: 'Pending' },
    submitted: { color: 'var(--secondary)', label: 'Submitted' },
    completed: { color: 'var(--success)',   label: 'Completed' },
    rejected:  { color: 'var(--danger)',    label: 'Rejected' },
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Modules</h1>
          <p className="page-subtitle">View and submit work for your assigned project modules.</p>
        </div>
        <div className="header-actions">
          <span className="status-pill status-pill-pending">
            {myModules.length} {myModules.length === 1 ? 'Module' : 'Modules'} Assigned
          </span>
        </div>
      </div>

      {myModules.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state-icon"><Layers size={28} /></div>
            <p className="empty-state-title">No Modules Assigned</p>
            <p className="empty-state-text">Contact your Team Leader if you believe this is an error.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {myModules.map(mod => {
            const issue = getIssue(mod._id);
            const sc    = statusConfig[mod.status] || { color: 'var(--text-muted)', label: mod.status };
            const isRej = mod.status === 'rejected';
            return (
              <div key={mod._id} className="glass-card" style={{
                borderTop: `3px solid ${sc.color}`,
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                ...(isRej ? { borderColor: 'var(--danger)' } : {}),
              }}>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '.75rem' }}>
                    <span className={`badge badge-${mod.status}`}>{sc.label}</span>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Clock size={11} />
                      {mod.deadline ? new Date(mod.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '.25rem', lineHeight: 1.3 }}>{mod.name}</h3>
                  <p className="text-xs text-primary" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.875rem' }}>
                    {getProjectName(mod)}
                  </p>

                  <div style={{ background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: 6, padding: '.75rem', marginBottom: '1rem', flex: 1 }}>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{mod.description}</p>
                  </div>

                  {isRej && issue && (
                    <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                      <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '.75rem', marginBottom: '.25rem' }}>Rejection Feedback</p>
                        <p className="text-sm">{issue.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-1" style={{ marginTop: 'auto' }}>
                    {['assigned', 'rejected', 'pending'].includes(mod.status) ? (
                      <button onClick={() => setSubmitModalModule(mod._id)} className="btn btn-primary w-full">
                        <Send size={14} /> Submit Work
                      </button>
                    ) : mod.status === 'submitted' ? (
                      <button className="btn w-full" disabled style={{ background: 'var(--warning-bg)', color: '#974F0C', border: '1px solid #FFE380' }}>
                        <Clock size={14} /> Awaiting Review
                      </button>
                    ) : (
                      <button className="btn w-full" disabled style={{ background: 'var(--success-bg)', color: '#006644', border: '1px solid #ABF5D1' }}>
                        <CheckCircle size={14} /> Approved ✓
                      </button>
                    )}
                    <button onClick={() => setSelectedModule(mod)} className="btn btn-ghost btn-icon" title="View details">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedModule && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="modal-icon" style={{ background: 'var(--primary-xlight)', color: 'var(--primary)' }}>
                  <Layers size={20} />
                </div>
                <h2 className="modal-title">Module Details</h2>
              </div>
              <button onClick={() => setSelectedModule(null)} className="modal-close"><X size={16} /></button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Module Title</label>
                <div style={{ padding: '.625rem .875rem', background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: 4, fontSize: '.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedModule.name}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <div style={{ padding: '.625rem .875rem', background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: 4, fontSize: '.9rem', color: 'var(--primary)', fontWeight: 600 }}>{getProjectName(selectedModule)}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <div style={{ paddingTop: '.25rem' }}><span className={`badge badge-${selectedModule.status}`}>{selectedModule.status}</span></div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Description</label>
                <div style={{ padding: '.875rem 1rem', background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: 6, fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selectedModule.description}</div>
              </div>
              {getIssue(selectedModule._id) && (
                <div className="alert alert-danger">
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span>{getIssue(selectedModule._id).description}</span>
                </div>
              )}
              <div className="modal-footer">
                <button onClick={() => setSelectedModule(null)} className="btn btn-ghost">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {submitModalModule && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="modal-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                  <Send size={20} />
                </div>
                <h2 className="modal-title">Submit Module Work</h2>
              </div>
              <button onClick={() => setSubmitModalModule(null)} className="modal-close"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitWork} className="modal-form">
              <div className="form-group">
                <label className="form-label">Upload Code / Artifact *</label>
                <input type="file" className="form-input" required
                  onChange={e => setSelectedFile(e.target.files[0])}
                  style={{ padding: '.5rem' }} />
                <p className="text-xs text-muted" style={{ marginTop: '.5rem' }}>Upload your module code (.html, .js, .zip, etc).</p>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setSubmitModalModule(null)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-success">Submit File</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default DevModules;
