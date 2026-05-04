import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, UserPlus, Mail, Phone, Shield, X, Trash2 } from 'lucide-react';

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
          <h1 className="page-title">Manage Team Leaders</h1>
          <p className="page-subtitle">Add and manage supervisors who oversee project execution.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Team Leader
        </button>
      </div>

      {/* Summary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{
          background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px',
          padding: '1.375rem', display: 'flex', alignItems: 'center', gap: '1rem',
          boxShadow: '0 1px 4px rgba(9,30,66,0.06)', borderTop: '3px solid #0052CC',
        }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: '#DEEBFF', color: '#0052CC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#172B4D', lineHeight: 1.1, fontFamily: "'Outfit', sans-serif" }}>{tls.length}</div>
            <div style={{ fontSize: '0.775rem', color: '#6B778C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Team Leaders</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>TL Profile</th>
                <th>Contact Info</th>
                <th>User ID</th>
                <th>Role</th>
                <th style={{ paddingRight: '1.5rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tls.length === 0 ? (
                <tr><td colSpan="5">
                  <div className="empty-state">
                    <UserPlus style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
                    <p className="empty-state-text">No Team Leaders Found</p>
                    <p className="empty-state-sub">Start by adding a Team Leader.</p>
                  </div>
                </td></tr>
              ) : (
                tls.map(tl => (
                  <tr key={tl._id}>
                    <td style={{ paddingLeft: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0052CC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.9rem', flexShrink: 0 }}>
                          {tl.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#172B4D', fontSize: '0.875rem' }}>{tl.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6B778C' }}>{tl.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#42526E' }}>
                          <Mail size={12} style={{ color: '#8993A4' }} /> {tl.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#42526E' }}>
                          <Phone size={12} style={{ color: '#8993A4' }} /> {tl.phone || '—'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: '#F4F5F7', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#172B4D', fontWeight: '600', border: '1px solid #EBECF0' }}>
                        {tl.userId}
                      </code>
                    </td>
                    <td><span className="badge badge-progress">Team Leader</span></td>
                    <td style={{ paddingRight: '1.5rem', textAlign: 'center' }}>
                      <button onClick={() => deleteUser(tl._id)}
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

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#DEEBFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052CC' }}>
                  <Shield size={18} />
                </div>
                <h2 className="modal-title">Register Team Leader</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            {error && <div className="alert alert-danger mb-2"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
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
                  <label className="form-label">User ID (Unique) *</label>
                  <input type="text" className="form-input" required placeholder="TL001"
                    value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Password *</label>
                  <input type="password" className="form-input" required placeholder="••••••••"
                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`.delete-btn:hover { background: #FFEBE6 !important; }`}</style>
    </div>
  );
};

export default ManageTeamLeaders;
