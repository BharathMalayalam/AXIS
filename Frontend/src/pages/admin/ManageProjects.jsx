import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Trash2, Calendar, FileText, X, Briefcase } from 'lucide-react';

const ManageProjects = () => {
  const { projects, addProject, deleteProject, getUsersByRole } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', assignedTL: '', deadline: '' });

  const tls = getUsersByRole('teamleader');
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProject(formData);
    setFormData({ name: '', description: '', assignedTL: '', deadline: '' });
    setShowModal(false);
  };
  const filtered = projects.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
  const getTLName = (proj) => {
    if (!proj.assignedTL) return 'Unassigned';
    if (typeof proj.assignedTL === 'object') return proj.assignedTL.name;
    return tls.find(tl => tl._id === proj.assignedTL)?.name || 'Unassigned';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Projects</h1>
          <p className="page-subtitle">Oversee and organize all team-based projects.</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-pill">
            <Plus size={16} /> Create Project
          </button>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={15} />
          <input type="text" className="search-input" placeholder="Search projects…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="search-count">{filtered.length} of {projects.length} projects</span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Team Leader</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Created</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6">
                <div className="empty-state">
                  <div className="empty-state-icon"><FileText size={28} /></div>
                  <p className="empty-state-title">No projects found</p>
                  <p className="empty-state-text">
                    {search ? 'Try a different search term.' : 'Click "Create Project" to launch your first initiative.'}
                  </p>
                </div>
              </td></tr>
            ) : filtered.map(proj => (
              <tr key={proj._id}>
                <td>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '.875rem' }}>{proj.name}</div>
                    <div className="text-xs text-muted truncate" style={{ maxWidth: 220 }}>{proj.description || '—'}</div>
                  </div>
                </td>
                <td>
                  <div className="user-pill">
                    <div className="avatar avatar-xs avatar-primary">{getTLName(proj)[0]?.toUpperCase()}</div>
                    <span className="text-sm">{getTLName(proj)}</span>
                  </div>
                </td>
                <td>
                  {proj.deadline ? (
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                      {new Date(proj.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  ) : <span className="text-muted text-sm">—</span>}
                </td>
                <td><span className={`badge badge-${proj.status}`}>{(proj.status || 'unknown').replace('_', ' ')}</span></td>
                <td className="text-sm text-muted">
                  {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => deleteProject(proj._id)} className="btn btn-sm btn-danger">
                    <Trash2 size={13} /> Delete
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
                  <Briefcase size={20} />
                </div>
                <h2 className="modal-title">Launch New Project</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input type="text" className="form-input" required placeholder="e.g. Banking App Redesign"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Outline the project goals and scope…"
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Assign Team Leader *</label>
                  <select className="form-select" required value={formData.assignedTL}
                    onChange={e => setFormData({ ...formData, assignedTL: e.target.value })}>
                    <option value="">Select Team Leader</option>
                    {tls.map(tl => <option key={tl._id} value={tl._id}>{tl.name} ({tl.userId})</option>)}
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
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageProjects;
