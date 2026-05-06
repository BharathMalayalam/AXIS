import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Clock, X, FileSearch, XCircle, Download } from 'lucide-react';

const TLReview = () => {
  const { currentUser, modules, projects, users, approveModule, rejectModule } = useApp();
  const [selectedModule, setSelectedModule] = useState(null);
  const [issueDetails, setIssueDetails] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const myProjectIds = projects
    .filter(p => (p.assignedTL?._id || p.assignedTL) === currentUser?._id)
    .map(p => p._id);

  const reviewModules = modules.filter(m =>
    m.status === 'submitted' && myProjectIds.includes(m.projectId?._id || m.projectId)
  );

  const handleApprove = async (id) => {
    if (window.confirm('Mark this module as correctly completed?')) {
      await approveModule(id);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    await rejectModule(selectedModule._id, issueDetails);
    setShowRejectModal(false);
    setSelectedModule(null);
    setIssueDetails('');
  };

  const getDevName = (mod) => {
    if (!mod.assignedDev) return 'Unknown';
    if (typeof mod.assignedDev === 'object') return mod.assignedDev.name;
    return users.find(u => u._id === mod.assignedDev)?.name || 'Unknown';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Review Submissions</h1>
          <p className="page-subtitle">Verify developer completions and provide feedback or approval.</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', background: reviewModules.length > 0 ? '#FFFAE6' : '#E3FCEF',
          border: `1px solid ${reviewModules.length > 0 ? '#FFE380' : '#ABF5D1'}`,
          borderRadius: '20px', fontSize: '0.8125rem', fontWeight: '700',
          color: reviewModules.length > 0 ? '#974F0C' : '#006644',
        }}>
          <Clock size={14} />
          {reviewModules.length} Pending {reviewModules.length === 1 ? 'Review' : 'Reviews'}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>Module Title</th>
                <th>Developer</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th style={{ paddingRight: '1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewModules.length === 0 ? (
                <tr><td colSpan="5">
                  <div className="empty-state">
                    <FileSearch style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
                    <p className="empty-state-text">No Pending Reviews</p>
                    <p className="empty-state-sub">New submissions from your team will appear here.</p>
                  </div>
                </td></tr>
              ) : (
                reviewModules.map(mod => (
                  <tr key={mod._id}>
                    <td style={{ paddingLeft: '1.5rem' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#172B4D', fontSize: '0.875rem' }}>{mod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B778C', marginTop: '2px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {mod.description?.substring(0, 50)}{mod.description?.length > 50 ? '…' : ''}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#6554C0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800', flexShrink: 0 }}>
                          {getDevName(mod)[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#42526E' }}>{getDevName(mod)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#42526E' }}>
                        <Clock size={12} style={{ color: '#8993A4' }} />
                        {mod.submittedAt ? new Date(mod.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td><span className="badge badge-submitted">Submitted</span></td>
                    <td style={{ paddingRight: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {mod.fileUrl && (
                          <a href={mod.fileUrl.startsWith('http') ? mod.fileUrl : `http://localhost:5000${mod.fileUrl}`} target="_blank" rel="noopener noreferrer" 
                            style={{ background: '#EAE6FF', border: '1px solid #C0B6F2', color: '#403294', borderRadius: '5px', padding: '0.4rem 0.875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: '700', textDecoration: 'none', transition: 'all 0.15s' }}
                            className="view-btn">
                            <Download size={14} /> File
                          </a>
                        )}
                        <button onClick={() => handleApprove(mod._id)}
                          style={{ background: '#E3FCEF', border: '1px solid #ABF5D1', color: '#006644', borderRadius: '5px', padding: '0.4rem 0.875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: '700', transition: 'all 0.15s' }}
                          className="approve-btn">
                          <CheckCircle2 size={14} /> Accept
                        </button>
                        <button onClick={() => { setSelectedModule(mod); setShowRejectModal(true); }}
                          style={{ background: '#FFEBE6', border: '1px solid #FFBDAD', color: '#BF2600', borderRadius: '5px', padding: '0.4rem 0.875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: '700', transition: 'all 0.15s' }}
                          className="reject-btn">
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#FFEBE6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DE350B' }}>
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h2 className="modal-title">Generate Issue</h2>
                  <p style={{ fontSize: '0.775rem', color: '#6B778C', marginTop: '1px' }}>{selectedModule?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <p style={{ color: '#42526E', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Specify the problems found. The developer will be notified to rework and resubmit.
            </p>
            <form onSubmit={handleReject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Issue Details / Feedback *</label>
                <textarea className="form-textarea" required placeholder="e.g. Broken validation on email field, missing error states…"
                  value={issueDetails} onChange={e => setIssueDetails(e.target.value)} style={{ minHeight: '120px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-danger">Send Back with Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .approve-btn:hover { background: #ABF5D1 !important; }
        .reject-btn:hover  { background: #FFBDAD !important; }
      `}</style>
    </div>
  );
};

export default TLReview;
