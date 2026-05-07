import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Layers, Calendar, X } from 'lucide-react';
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
        <div className="header-actions">
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-pill" disabled={myProjects.length === 0}>
            <Plus size={16} /> Assign New Module
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Project</th>
              <th>Developer</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myModules.length === 0 ? (
              <tr><td colSpan="5">
                <div className="empty-state">
                  <div className="empty-state-icon"><Layers size={28} /></div>
                  <p className="empty-state-title">No Modules Assigned Yet</p>
                  <p className="empty-state-text">Select a project and assign modules to your team.</p>
                </div>
              </td></tr>
            ) : myModules.map(mod => (
              <tr key={mod._id}>
                <td>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '.875rem' }}>{mod.name}</div>
                    <div className="text-xs text-muted truncate" style={{ maxWidth: 200 }}>
                      {mod.description?.substring(0, 50)}{mod.description?.length > 50 ? '…' : ''}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-progress">{getProjectName(mod)}</span>
                </td>
                <td>
                  <div className="user-pill">
                    <div className="avatar avatar-xs avatar-accent">{getDevName(mod)[0]?.toUpperCase()}</div>
                    <span className="text-sm">{getDevName(mod)}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                    {mod.deadline ? new Date(mod.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </div>
                </td>
                <td><span className={`badge badge-${mod.status}`}>{mod.status?.replace('_', ' ')}</span></td>
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
                  <Layers size={20} />
                </div>
                <h2 className="modal-title">New Module Assignment</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
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
                  <label className="form-label">Deadline *</label>
                  <input type="date" className="form-input" required
                    value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
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
