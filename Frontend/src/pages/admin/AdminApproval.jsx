import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, Clock, FileCheck, ShieldAlert, X, ClipboardCheck } from 'lucide-react';

const AdminApproval = () => {
  const { projects, users, approveProject, rejectProject } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingProjects = projects.filter(p => p.status === 'completed');

  const handleApprove = async (id) => {
    if (window.confirm('Approve this project for final delivery?')) {
      await approveProject(id);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    await rejectProject(selectedProject._id, rejectionReason);
    setShowRejectModal(false);
    setSelectedProject(null);
    setRejectionReason('');
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
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          padding: '0.5rem 1rem', background: pendingProjects.length > 0 ? '#FFFAE6' : '#E3FCEF',
          border: `1px solid ${pendingProjects.length > 0 ? '#FFE380' : '#ABF5D1'}`,
          borderRadius: '20px', fontSize: '0.8125rem', fontWeight: '700',
          color: pendingProjects.length > 0 ? '#974F0C' : '#006644',
        }}>
          <Clock size={14} />
          {pendingProjects.length} Pending {pendingProjects.length === 1 ? 'Review' : 'Reviews'}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>Project</th>
                <th>Team Leader</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th style={{ paddingRight: '1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProjects.length === 0 ? (
                <tr><td colSpan="5">
                  <div className="empty-state">
                    <FileCheck style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
                    <p className="empty-state-text">No Projects Awaiting Approval</p>
                    <p className="empty-state-sub">Check back when Team Leaders submit completed projects.</p>
                  </div>
                </td></tr>
              ) : (
                pendingProjects.map(proj => (
                  <tr key={proj._id}>
                    <td style={{ paddingLeft: '1.5rem' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#172B4D', fontSize: '0.875rem' }}>{proj.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B778C', marginTop: '2px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {proj.description || '—'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0052CC', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800', flexShrink: 0 }}>
                          {getTLName(proj)[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#42526E' }}>{getTLName(proj)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#42526E' }}>
                        <Clock size={12} style={{ color: '#8993A4' }} />
                        {proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td><span className="badge badge-pending">Awaiting Approval</span></td>
                    <td style={{ paddingRight: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleApprove(proj._id)}
                          style={{ background: '#E3FCEF', border: '1px solid #ABF5D1', color: '#006644', borderRadius: '5px', padding: '0.4rem 0.875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: '700', transition: 'all 0.15s' }}
                          className="approve-btn">
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button onClick={() => { setSelectedProject(proj); setShowRejectModal(true); }}
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
                  <XCircle size={18} />
                </div>
                <div>
                  <h2 className="modal-title">Reject Project</h2>
                  <p style={{ fontSize: '0.775rem', color: '#6B778C', marginTop: '1px' }}>{selectedProject?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <div className="alert alert-warning" style={{ marginBottom: '1.25rem' }}>
              <ShieldAlert size={16} />
              <span>The Team Leader will be notified and must revise the project.</span>
            </div>
            <form onSubmit={handleReject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Reason for Rejection *</label>
                <textarea className="form-textarea" required placeholder="Provide detailed, actionable feedback for the team leader…"
                  value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} style={{ minHeight: '120px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-danger">Send Back Project</button>
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

export default AdminApproval;
