import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, UserPlus, Code2, X, Trash2, Phone } from 'lucide-react';

const ManageTeamMembers = () => {
  const { getUsersByRole, addUser, deleteUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', userId: '', password: '', teamLeaderId: '', role: 'developer' });

  const tls  = getUsersByRole('teamleader');
  const devs = getUsersByRole('developer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await addUser(formData);
    if (res.success) {
      setFormData({ name: '', email: '', phone: '', userId: '', password: '', teamLeaderId: '', role: 'developer' });
      setShowModal(false);
    } else { setError(res.error); }
  };

  const getTLName = (dev) => {
    if (!dev.teamLeaderId) return 'Unassigned';
    if (typeof dev.teamLeaderId === 'object') return dev.teamLeaderId.name;
    return tls.find(tl => tl._id === dev.teamLeaderId)?.name || 'Unassigned';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Members</h1>
          <p className="page-subtitle">Assign developers to team leaders and manage their access.</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-pill">
            <Plus size={16} /> Add Developer
          </button>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}><Code2 size={22} /></div>
          <div>
            <div className="stat-value">{devs.length}</div>
            <div className="stat-label">Total Developers</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member Profile</th>
              <th>Reporting To</th>
              <th>Contact</th>
              <th>User ID</th>
              <th>Role</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devs.length === 0 ? (
              <tr><td colSpan="6">
                <div className="empty-state">
                  <div className="empty-state-icon"><UserPlus size={28} /></div>
                  <p className="empty-state-title">No Developers Registered</p>
                  <p className="empty-state-text">Start building your development team today.</p>
                </div>
              </td></tr>
            ) : devs.map(dev => (
              <tr key={dev._id}>
                <td>
                  <div className="user-pill">
                    <div className="avatar avatar-sm avatar-accent">{dev.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="user-pill-name">{dev.name}</div>
                      <div className="user-pill-sub">{dev.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="user-pill">
                    <div className="avatar avatar-xs avatar-primary">{getTLName(dev)[0]?.toUpperCase()}</div>
                    <span className="text-sm">{getTLName(dev)}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone size={12} style={{ color: 'var(--text-muted)' }} />{dev.phone || '—'}
                  </div>
                </td>
                <td><span className="code-chip">{dev.userId}</span></td>
                <td><span className="badge badge-assigned">Developer</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => deleteUser(dev._id)} className="btn btn-sm btn-danger">
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
                <div className="modal-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <Code2 size={20} />
                </div>
                <h2 className="modal-title">Onboard Developer</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            {error && <div className="alert alert-danger"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-input" required placeholder="Jane Smith"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" required placeholder="jane@company.com"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-input" placeholder="+1 987 654 321"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Assign to Team Leader *</label>
                <select className="form-select" required value={formData.teamLeaderId}
                  onChange={e => setFormData({ ...formData, teamLeaderId: e.target.value })}>
                  <option value="">Select a Team Leader</option>
                  {tls.map(tl => <option key={tl._id} value={tl._id}>{tl.name} ({tl.userId})</option>)}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">User ID *</label>
                  <input type="text" className="form-input" required placeholder="DEV001"
                    value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input type="password" className="form-input" required placeholder="••••••••"
                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageTeamMembers;
