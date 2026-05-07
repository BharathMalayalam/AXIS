import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, Clock, FileCheck, ShieldAlert, X } from 'lucide-react';

const AdminApproval = () => {
  const { projects, users, approveProject, rejectProject } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingProjects = projects.filter(p => p.status === 'completed');

  const handleApprove = async (id) => {
    if (window.confirm('Approve this project for final delivery?')) await approveProject(id);
  };
  const handleReject = async (e) => {
    e.preventDefault();
    await rejectProject(selectedProject._id, rejectionReason);
    setShowRejectModal(false); setSelectedProject(null); setRejectionReason('');
  };
  const getTLName = (proj) => {
    if (!proj.assignedTL) return 'Unknown';
    if (typeof proj.assignedTL === 'object') return proj.assignedTL.name;
    return users.find(u => u._id === proj.assignedTL)?.name || 'Unknown';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Approvals</h1>
          <p className="page-subtitle">Review completed projects and validate deliverables for final sign-off.</p>
        </div>
        <div className="header-actions">
          <span className={`status-pill ${pendingProjects.length > 0 ? 'status-pill-pending' : 'status-pill-success'}`}>
            <Clock size={14} />
            {pendingProjects.length} Pending {pendingProjects.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Team Leader</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingProjects.length === 0 ? (
              <tr><td colSpan="5">
                <div className="empty-state">
                  <div className="empty-state-icon"><FileCheck size={28} /></div>
                  <p className="empty-state-title">No Projects Awaiting Approval</p>
                  <p className="empty-state-text">Check back when Team Leaders submit completed projects.</p>
                </div>
              </td></tr>
            ) : pendingProjects.map(proj => (
              <tr key={proj._id}>
                <td>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '.875rem' }}>{proj.name}</div>
                    <div className="text-xs text-muted truncate" style={{ maxWidth: 240 }}>{proj.description || '—'}</div>
                  </div>
                </td>
                <td>
                  <div className="user-pill">
                    <div className="avatar avatar-xs avatar-primary">{getTLName(proj)[0]?.toUpperCase()}</div>
                    <span className="text-sm">{getTLName(proj)}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                    {proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </div>
                </td>
                <td><span className="badge badge-pending">Awaiting Approval</span></td>
                <td>
                  <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={() => handleApprove(proj._id)} className="btn btn-sm btn-success">
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button onClick={() => { setSelectedProject(proj); setShowRejectModal(true); }} className="btn btn-sm btn-danger">
                      <XCircle size={14} /> Reject
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
                  <XCircle size={20} />
                </div>
                <div>
                  <h2 className="modal-title">Reject Project</h2>
                  <p className="text-xs text-muted">{selectedProject?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <div className="alert alert-warning">
              <ShieldAlert size={16} />
              <span>The Team Leader will be notified and must revise the project.</span>
            </div>
            <form onSubmit={handleReject} className="modal-form">
              <div className="form-group">
                <label className="form-label">Reason for Rejection *</label>
                <textarea className="form-textarea" required
                  placeholder="Provide detailed, actionable feedback for the team leader…"
                  value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}
                  style={{ minHeight: 120 }} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-danger">Send Back Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminApproval;
