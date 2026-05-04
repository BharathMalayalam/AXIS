import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Trash2, Calendar, User, FileText, X, Briefcase } from 'lucide-react';

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

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

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
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Create Project
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        background: '#fff', border: '1px solid #DFE1E6', borderRadius: '8px',
        padding: '1rem 1.25rem', marginBottom: '1.25rem',
        boxShadow: '0 1px 4px rgba(9,30,66,0.06)',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '380px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8993A4', pointerEvents: 'none' }} />
          <input
            type="text" placeholder="Search projects…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.5rem 0.875rem 0.5rem 2.25rem',
              background: '#F4F5F7', border: '1px solid #DFE1E6', borderRadius: '5px',
              fontSize: '0.875rem', color: '#172B4D', outline: 'none',
              transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
            }}
            className="project-search"
          />
        </div>
        <span style={{ fontSize: '0.8125rem', color: '#6B778C', fontWeight: '500' }}>
          {filtered.length} of {projects.length} projects
        </span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px', boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>Project Details</th>
                <th>Team Leader</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ paddingRight: '1.5rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6">
                  <div className="empty-state">
                    <FileText style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, color: '#6B778C', marginBottom: '0.75rem' }} />
                    <p className="empty-state-text">No projects found</p>
                    <p className="empty-state-sub">
                      {search ? 'Try a different search term.' : 'Click "Create Project" to launch your first initiative.'}
                    </p>
                  </div>
                </td></tr>
              ) : (
                filtered.map(proj => (
                  <tr key={proj._id}>
                    <td style={{ paddingLeft: '1.5rem' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#172B4D', fontSize: '0.875rem' }}>{proj.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B778C', marginTop: '2px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {proj.description || '—'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0052CC', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800', flexShrink: 0 }}>
                          {getTLName(proj)[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#42526E' }}>{getTLName(proj)}</span>
                      </div>
                    </td>
                    <td>
                      {proj.deadline ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#42526E' }}>
                          <Calendar size={12} style={{ color: '#8993A4' }} />
                          {new Date(proj.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      ) : <span style={{ color: '#C1C7D0', fontSize: '0.8125rem' }}>—</span>}
                    </td>
                    <td>
                      <span className={`badge badge-${proj.status}`}>{(proj.status || 'unknown').replace('_', ' ')}</span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: '#6B778C' }}>
                      {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td style={{ paddingRight: '1.5rem', textAlign: 'center' }}>
                      <button
                        onClick={() => deleteProject(proj._id)}
                        style={{
                          background: '#FFF5F5', border: '1px solid #FFBDAD', color: '#DE350B',
                          borderRadius: '5px', padding: '0.35rem 0.625rem',
                          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          fontSize: '0.75rem', fontWeight: '600', transition: 'all 0.15s',
                        }}
                        className="delete-btn"
                        title="Delete project"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#DEEBFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052CC' }}>
                  <Briefcase size={18} />
                </div>
                <h2 className="modal-title">Launch New Project</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .project-search:focus { background: #fff !important; border-color: #0052CC !important; box-shadow: 0 0 0 3px rgba(0,82,204,0.1) !important; }
        .delete-btn:hover { background: #FFEBE6 !important; transform: translateY(-1px); }
      `}</style>
    </div>
  );
};

export default ManageProjects;
