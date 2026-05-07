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
    if (window.confirm('Mark this module as correctly completed?')) await approveModule(id);
  };
  const handleReject = async (e) => {
    e.preventDefault();
    await rejectModule(selectedModule._id, issueDetails);
    setShowRejectModal(false); setSelectedModule(null); setIssueDetails('');
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
        <div className="header-actions">
          <span className={`status-pill ${reviewModules.length > 0 ? 'status-pill-pending' : 'status-pill-success'}`}>
            <Clock size={14} />
            {reviewModules.length} Pending {reviewModules.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Module Title</th>
              <th>Developer</th>
              <th>Submitted At</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviewModules.length === 0 ? (
              <tr><td colSpan="5">
                <div className="empty-state">
                  <div className="empty-state-icon"><FileSearch size={28} /></div>
                  <p className="empty-state-title">No Pending Reviews</p>
                  <p className="empty-state-text">New submissions from your team will appear here.</p>
                </div>
              </td></tr>
            ) : reviewModules.map(mod => (
              <tr key={mod._id}>
                <td>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '.875rem' }}>{mod.name}</div>
                    <div className="text-xs text-muted truncate" style={{ maxWidth: 220 }}>
                      {mod.description?.substring(0, 60)}{mod.description?.length > 60 ? '…' : ''}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="user-pill">
                    <div className="avatar avatar-xs avatar-accent">{getDevName(mod)[0]?.toUpperCase()}</div>
                    <span className="text-sm">{getDevName(mod)}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                    {mod.submittedAt ? new Date(mod.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </div>
                </td>
                <td><span className="badge badge-submitted">Submitted</span></td>
                <td>
                  <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
                    {mod.fileUrl && (
                      <a
                        href={mod.fileUrl.startsWith('http') ? mod.fileUrl : `http://localhost:5000${mod.fileUrl}`}
                        target="_blank" rel="noopener noreferrer"
                        className="btn btn-sm btn-ghost"
                      >
                        <Download size={13} /> File
                      </a>
                    )}
                    <button onClick={() => handleApprove(mod._id)} className="btn btn-sm btn-success">
                      <CheckCircle2 size={13} /> Accept
                    </button>
                    <button onClick={() => { setSelectedModule(mod); setShowRejectModal(true); }} className="btn btn-sm btn-danger">
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="modal-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h2 className="modal-title">Generate Issue</h2>
                  <p className="text-xs text-muted">{selectedModule?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <p className="text-sm" style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Specify the problems found. The developer will be notified to rework and resubmit.
            </p>
            <form onSubmit={handleReject} className="modal-form">
              <div className="form-group">
                <label className="form-label">Issue Details / Feedback *</label>
                <textarea className="form-textarea" required
                  placeholder="e.g. Broken validation on email field, missing error states…"
                  value={issueDetails} onChange={e => setIssueDetails(e.target.value)} style={{ minHeight: 120 }} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-danger">Send Back with Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TLReview;
