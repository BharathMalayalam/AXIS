import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, UserPlus, Mail, Phone, Code2, X, Trash2, User } from 'lucide-react';

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
          <h1 className="page-title">Manage Team Members</h1>
          <p className="page-subtitle">Assign developers to team leaders and manage their access.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Developer
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', padding: '1.375rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', borderTop: '3px solid #6554C0' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: '#EAE6FF', color: '#6554C0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#172B4D', lineHeight: 1.1, fontFamily: "'Outfit', sans-serif" }}>{devs.length}</div>
            <div style={{ fontSize: '0.775rem', color: '#6B778C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Developers</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>Member Profile</th>
                <th>Reporting To</th>
                <th>Contact</th>
                <th>User ID</th>
                <th>Role</th>
                <th style={{ paddingRight: '1.5rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devs.length === 0 ? (
                <tr><td colSpan="6">
                  <div className="empty-state">
                    <UserPlus style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
                    <p className="empty-state-text">No Developers Registered</p>
                    <p className="empty-state-sub">Start building your development team today.</p>
                  </div>
                </td></tr>
              ) : (
                devs.map(dev => (
                  <tr key={dev._id}>
                    <td style={{ paddingLeft: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6554C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.9rem', flexShrink: 0 }}>
                          {dev.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#172B4D', fontSize: '0.875rem' }}>{dev.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6B778C' }}>{dev.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0052CC', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '800', flexShrink: 0 }}>
                          {getTLName(dev)[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.8125rem', color: '#42526E' }}>{getTLName(dev)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#42526E' }}>
                        <Phone size={12} style={{ color: '#8993A4' }} /> {dev.phone || '—'}
                      </div>
                    </td>
                    <td>
                      <code style={{ background: '#F4F5F7', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#172B4D', fontWeight: '600', border: '1px solid #EBECF0' }}>
                        {dev.userId}
                      </code>
                    </td>
                    <td><span className="badge badge-assigned">Developer</span></td>
                    <td style={{ paddingRight: '1.5rem', textAlign: 'center' }}>
                      <button onClick={() => deleteUser(dev._id)}
                        style={{ background: '#FFF5F5', border: '1px solid #FFBDAD', color: '#DE350B', borderRadius: '5px', padding: '0.35rem 0.625rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '600', transition: 'all 0.15s' }}
                        className="delete-btn">
                        <Trash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Developer Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#EAE6FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6554C0' }}>
                  <Code2 size={18} />
                </div>
                <h2 className="modal-title">Onboard Developer</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            {error && <div className="alert alert-danger mb-2"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`.delete-btn:hover { background: #FFEBE6 !important; }`}</style>
    </div>
  );
};

export default ManageTeamMembers;
