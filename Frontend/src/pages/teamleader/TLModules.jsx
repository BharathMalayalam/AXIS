import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Layers, Calendar, X, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TLModules = () => {
  const { currentUser, projects, modules, users, addModule } = useApp();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    projectId: location.state?.projectId || '',
    name: '', description: '', assignedDev: '', deadline: ''
  });

  const myProjects   = projects.filter(p => (p.assignedTL?._id || p.assignedTL) === currentUser?._id);
  const myProjectIds = myProjects.map(p => p._id);
  const myModules    = modules.filter(m => myProjectIds.includes(m.projectId?._id || m.projectId));
  const myTeam       = users.filter(u => u.role === 'developer' && (u.teamLeaderId?._id || u.teamLeaderId) === currentUser?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addModule(formData);
    setFormData({ ...formData, name: '', description: '', assignedDev: '', deadline: '' });
    setShowModal(false);
  };

  const getDevName     = (mod) => {
    if (!mod.assignedDev) return 'Unassigned';
    if (typeof mod.assignedDev === 'object') return mod.assignedDev.name;
    return myTeam.find(d => d._id === mod.assignedDev)?.name || 'Unassigned';
  };

  const getProjectName = (mod) => {
    if (!mod.projectId) return 'Unknown';
    if (typeof mod.projectId === 'object') return mod.projectId.name;
    return myProjects.find(p => p._id === mod.projectId)?.name || 'Unknown';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Module Allocation</h1>
          <p className="page-subtitle">Divide projects into modules and distribute tasks among developers.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" disabled={myProjects.length === 0}>
          <Plus size={16} /> Assign New Module
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>Module Name</th>
                <th>Project</th>
                <th>Developer</th>
                <th>Deadline</th>
                <th style={{ paddingRight: '1.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myModules.length === 0 ? (
                <tr><td colSpan="5">
                  <div className="empty-state">
                    <Layers style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
                    <p className="empty-state-text">No Modules Assigned Yet</p>
                    <p className="empty-state-sub">Select a project and assign modules to your team.</p>
                  </div>
                </td></tr>
              ) : (
                myModules.map(mod => (
                  <tr key={mod._id}>
                    <td style={{ paddingLeft: '1.5rem' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#172B4D', fontSize: '0.875rem' }}>{mod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B778C', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {mod.description?.substring(0, 50)}{mod.description?.length > 50 ? '…' : ''}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#0052CC', background: '#DEEBFF', padding: '2px 8px', borderRadius: '4px' }}>
                        {getProjectName(mod)}
                      </span>
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
                        <Calendar size={12} style={{ color: '#8993A4' }} />
                        {mod.deadline ? new Date(mod.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </div>
                    </td>
                    <td style={{ paddingRight: '1.5rem' }}>
                      <span className={`badge badge-${mod.status}`}>{mod.status?.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Module Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#DEEBFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052CC' }}>
                  <Layers size={18} />
                </div>
                <h2 className="modal-title">New Module Assignment</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div className="form-group">
                <label className="form-label">Select Project *</label>
                <select className="form-select" required value={formData.projectId}
                  onChange={e => setFormData({ ...formData, projectId: e.target.value })}>
                  <option value="">Choose Project</option>
                  {myProjects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Module Title *</label>
                <input type="text" className="form-input" required placeholder="e.g. Login Authentication Service"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Task Description *</label>
                <textarea className="form-textarea" required placeholder="Describe what the developer needs to build…"
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Assign Developer *</label>
                  <select className="form-select" required value={formData.assignedDev}
                    onChange={e => setFormData({ ...formData, assignedDev: e.target.value })}>
                    <option value="">Select Team Member</option>
                    {myTeam.map(dev => <option key={dev._id} value={dev._id}>{dev.name} ({dev.userId})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Completion Deadline *</label>
                  <input type="date" className="form-input" required
                    value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Module</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TLModules;
