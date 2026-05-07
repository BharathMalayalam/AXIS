import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, UserPlus, Shield, X, Trash2, Mail, Phone } from 'lucide-react';

const ManageTeamLeaders = () => {
  const { getUsersByRole, addUser, deleteUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', userId: '', password: '', role: 'teamleader' });

  const tls = getUsersByRole('teamleader');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await addUser(formData);
    if (res.success) {
      setFormData({ name: '', email: '', phone: '', userId: '', password: '', role: 'teamleader' });
      setShowModal(false);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Leaders</h1>
          <p className="page-subtitle">Add and manage supervisors who oversee project execution.</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-pill">
            <Plus size={16} /> Add Team Leader
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon"><Shield size={22} /></div>
          <div>
            <div className="stat-value">{tls.length}</div>
            <div className="stat-label">Active Team Leaders</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Contact Info</th>
              <th>User ID</th>
              <th>Role</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tls.length === 0 ? (
              <tr><td colSpan="5">
                <div className="empty-state">
                  <div className="empty-state-icon"><UserPlus size={28} /></div>
                  <p className="empty-state-title">No Team Leaders Found</p>
                  <p className="empty-state-text">Start by adding a Team Leader.</p>
                </div>
              </td></tr>
            ) : tls.map(tl => (
              <tr key={tl._id}>
                <td>
                  <div className="user-pill">
                    <div className="avatar avatar-sm avatar-primary">{tl.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="user-pill-name">{tl.name}</div>
                      <div className="user-pill-sub">{tl.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm"><Mail size={12} style={{ color: 'var(--text-muted)' }} />{tl.email}</div>
                    <div className="flex items-center gap-1 text-sm"><Phone size={12} style={{ color: 'var(--text-muted)' }} />{tl.phone || '—'}</div>
                  </div>
                </td>
                <td><span className="code-chip">{tl.userId}</span></td>
                <td><span className="badge badge-progress">Team Leader</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => deleteUser(tl._id)} className="btn btn-sm btn-danger">
                    <Trash2 size={13} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="modal-icon" style={{ background: 'var(--primary-xlight)', color: 'var(--primary)' }}>
                  <Shield size={20} />
                </div>
                <h2 className="modal-title">Register Team Leader</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            {error && <div className="alert alert-danger"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-input" required placeholder="John Doe"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" required placeholder="john@company.com"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-input" placeholder="+1 234 567 890"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">User ID *</label>
                  <input type="text" className="form-input" required placeholder="TL001"
                    value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Password *</label>
                  <input type="password" className="form-input" required placeholder="••••••••"
                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageTeamLeaders;
