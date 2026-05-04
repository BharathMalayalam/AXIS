import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Calendar, CheckCircle, AlertTriangle, Send, X, MessageSquare, Clock } from 'lucide-react';

const DevModules = () => {
  const { currentUser, modules, projects, submitModule, issues } = useApp();
  const [selectedModule, setSelectedModule] = useState(null);

  const myModules = modules.filter(m => (m.assignedDev?._id || m.assignedDev) === currentUser?._id);

  const getProjectName = (mod) => {
    if (!mod.projectId) return 'Unknown';
    if (typeof mod.projectId === 'object') return mod.projectId.name;
    return projects.find(p => p._id === mod.projectId)?.name || 'Unknown';
  };

  const getIssue = (modId) => issues?.find(i => (i.moduleId?._id || i.moduleId) === modId && i.status === 'open');

  const [submitModalModule, setSubmitModalModule] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select a file to submit.');
    await submitModule(submitModalModule, selectedFile);
    setSubmitModalModule(null);
    setSelectedFile(null);
  };

  const statusConfig = {
    assigned:  { bar: '#0052CC', label: 'Assigned' },
    pending:   { bar: '#FFAB00', label: 'Pending' },
    submitted: { bar: '#00B8D4', label: 'Submitted' },
    completed: { bar: '#36B37E', label: 'Completed' },
    rejected:  { bar: '#DE350B', label: 'Rejected' },
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Modules</h1>
          <p className="page-subtitle">View and submit work for your assigned project modules.</p>
        </div>
        <div style={{
          fontSize: '0.8125rem', color: '#6B778C',
          background: '#fff', border: '1px solid #DFE1E6', borderRadius: '20px',
          padding: '0.375rem 1rem', fontWeight: '600',
        }}>
          {myModules.length} {myModules.length === 1 ? 'Module' : 'Modules'} Assigned
        </div>
      </div>

      {myModules.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '12px', padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(9,30,66,0.06)' }}>
          <div style={{ width: '64px', height: '64px', background: '#DEEBFF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#0052CC' }}>
            <Layers size={32} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#172B4D', marginBottom: '0.5rem' }}>No Modules Assigned</h3>
          <p style={{ color: '#6B778C', fontSize: '0.9rem' }}>Contact your Team Leader if you believe this is an error.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {myModules.map(mod => {
            const issue  = getIssue(mod._id);
            const sc     = statusConfig[mod.status] || { bar: '#8993A4', label: mod.status };
            const isRej  = mod.status === 'rejected';

            return (
              <div key={mod._id} style={{
                background: '#fff',
                border: `1px solid ${isRej ? '#FFBDAD' : '#DFE1E6'}`,
                borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(9,30,66,0.06)',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.2s',
              }} className="module-card">
                {/* Status color bar */}
                <div style={{ height: '4px', background: sc.bar }} />

                <div style={{ padding: '1.375rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${mod.status}`}>{sc.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#6B778C' }}>
                      <Clock size={11} />
                      {mod.deadline ? new Date(mod.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#172B4D', marginBottom: '0.375rem', lineHeight: 1.3 }}>{mod.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#0052CC', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.875rem' }}>
                    {getProjectName(mod)}
                  </p>

                  <div style={{ background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem', flex: 1 }}>
                    <p style={{ fontSize: '0.8125rem', color: '#42526E', lineHeight: 1.6 }}>{mod.description}</p>
                  </div>

                  {/* Rejection issue */}
                  {isRej && issue && (
                    <div style={{ background: '#FFEBE6', border: '1px solid #FFBDAD', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <AlertTriangle size={15} style={{ color: '#DE350B', flexShrink: 0, marginTop: '1px' }} />
                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#BF2600', marginBottom: '0.25rem' }}>Rejection Feedback</p>
                        <p style={{ fontSize: '0.8125rem', color: '#42526E', lineHeight: 1.5 }}>{issue.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.625rem', marginTop: 'auto' }}>
                    {['assigned', 'rejected', 'pending'].includes(mod.status) ? (
                      <button onClick={() => setSubmitModalModule(mod._id)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                        <Send size={15} /> Submit Work
                      </button>
                    ) : mod.status === 'submitted' ? (
                      <button className="btn" disabled style={{ flex: 1, justifyContent: 'center', background: '#FFFAE6', color: '#974F0C', border: '1px solid #FFE380', cursor: 'not-allowed' }}>
                        <Clock size={15} /> Awaiting Review
                      </button>
                    ) : (
                      <button className="btn" disabled style={{ flex: 1, justifyContent: 'center', background: '#E3FCEF', color: '#006644', border: '1px solid #ABF5D1', cursor: 'not-allowed' }}>
                        <CheckCircle size={15} /> Approved ✓
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedModule(mod)}
                      style={{ width: '38px', height: '38px', padding: 0, background: '#F4F5F7', border: '1px solid #DFE1E6', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#42526E', transition: 'all 0.15s', flexShrink: 0 }}
                      className="detail-btn" title="View details">
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
          <div className="modal animate-scale-in">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#DEEBFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052CC' }}>
                  <Layers size={18} />
                </div>
                <h2 className="modal-title">Module Details</h2>
              </div>
              <button onClick={() => setSelectedModule(null)} className="modal-close"><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div className="form-group">
                <label className="form-label">Module Title</label>
                <div style={{ padding: '0.625rem 0.875rem', background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: '4px', fontSize: '0.9rem', color: '#172B4D', fontWeight: '600' }}>{selectedModule.name}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <div style={{ padding: '0.625rem 0.875rem', background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: '4px', fontSize: '0.9rem', color: '#0052CC', fontWeight: '600' }}>{getProjectName(selectedModule)}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <div style={{ paddingTop: '0.25rem' }}><span className={`badge badge-${selectedModule.status}`}>{selectedModule.status}</span></div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Description</label>
                <div style={{ padding: '0.875rem 1rem', background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: '6px', fontSize: '0.875rem', color: '#42526E', lineHeight: 1.7 }}>{selectedModule.description}</div>
              </div>
              {getIssue(selectedModule._id) && (
                <div className="form-group">
                  <label className="form-label" style={{ color: '#BF2600' }}>Rejection Feedback</label>
                  <div style={{ padding: '0.875rem 1rem', background: '#FFEBE6', border: '1px solid #FFBDAD', borderRadius: '6px', fontSize: '0.875rem', color: '#42526E', lineHeight: 1.7 }}>
                    {getIssue(selectedModule._id).description}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedModule(null)} className="btn btn-ghost">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {submitModalModule && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#E3FCEF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006644' }}>
                  <Send size={18} />
                </div>
                <h2 className="modal-title">Submit Module Work</h2>
              </div>
              <button onClick={() => setSubmitModalModule(null)} className="modal-close"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmitWork} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div className="form-group">
                <label className="form-label">Upload Code / Artifact *</label>
                <input 
                  type="file" 
                  className="form-input" 
                  required 
                  onChange={e => setSelectedFile(e.target.files[0])} 
                  style={{ padding: '0.5rem' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#6B778C', marginTop: '0.5rem' }}>Upload your module code (e.g. .html, .js, .zip, etc).</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSubmitModalModule(null)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#006644', borderColor: '#006644' }}>Submit File</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .module-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(9,30,66,0.1) !important; }
        .detail-btn:hover  { background: #DEEBFF !important; border-color: #B3D4FF !important; color: #0052CC !important; }
      `}</style>
    </div>
  );
};

export default DevModules;
