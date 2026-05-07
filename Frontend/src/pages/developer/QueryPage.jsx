import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Clock, CheckCircle2, X, Plus, AlertCircle } from 'lucide-react';

const QueryPage = () => {
  const { currentUser, queries, addQuery, replyQuery, users } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [replyText, setReplyText] = useState('');
  const [activeQueryId, setActiveQueryId] = useState(null);

  const isDev = currentUser?.role === 'developer';
  const myQueries = queries;
  const resolvedCount = myQueries.filter(q => q.reply).length;
  const pendingCount  = myQueries.filter(q => !q.reply).length;

  const handleAddQuery = async (e) => {
    e.preventDefault();
    const tlId = currentUser.teamLeaderId?._id || currentUser.teamLeaderId;
    if (!tlId) { alert('No Team Leader assigned to you.'); return; }
    await addQuery({ ...formData, toId: tlId });
    setFormData({ subject: '', message: '' });
    setShowModal(false);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    await replyQuery(activeQueryId, replyText);
    setReplyText(''); setActiveQueryId(null);
  };

  const getUserName = (id) => {
    if (!id) return 'Unknown';
    if (typeof id === 'object') return id.name;
    return users.find(u => u._id === id)?.name || 'Unknown';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isDev ? 'My Queries' : 'Developer Queries'}</h1>
          <p className="page-subtitle">
            {isDev ? 'Communicate your doubts and questions with your Team Leader.' : 'Respond to queries and clarify doubts from your developers.'}
          </p>
        </div>
        <div className="header-actions">
          {myQueries.length > 0 && (
            <>
              {pendingCount > 0 && <span className="status-pill status-pill-pending"><Clock size={13} />{pendingCount} Pending</span>}
              {resolvedCount > 0 && <span className="status-pill status-pill-success"><CheckCircle2 size={13} />{resolvedCount} Resolved</span>}
            </>
          )}
          {isDev && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary btn-pill">
              <Plus size={16} /> New Query
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myQueries.length === 0 ? (
          <div className="glass-card">
            <div className="empty-state">
              <div className="empty-state-icon"><MessageSquare size={28} /></div>
              <p className="empty-state-title">No Queries Found</p>
              <p className="empty-state-text">
                {isDev ? 'Submit your first query to get started.' : 'No queries from developers yet.'}
              </p>
            </div>
          </div>
        ) : [...myQueries].reverse().map(q => (
          <div key={q._id} className="glass-card" style={{
            borderLeft: `4px solid ${q.reply ? 'var(--success)' : 'var(--warning)'}`,
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div className="card-header">
              <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
                <div className="avatar avatar-sm avatar-primary">{getUserName(q.fromId)[0]?.toUpperCase()}</div>
                <div style={{ minWidth: 0 }}>
                  <h4 className="truncate" style={{ fontSize: '.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{q.subject}</h4>
                  <p className="text-xs text-muted">
                    From: <strong style={{ color: 'var(--text-secondary)' }}>{getUserName(q.fromId)}</strong>
                    {' · '}
                    {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {q.reply
                ? <span className="badge badge-completed"><CheckCircle2 size={11} /> Resolved</span>
                : <span className="badge badge-pending"><Clock size={11} /> Pending</span>}
            </div>

            {/* Body */}
            <div style={{ padding: '1.125rem 1.5rem' }}>
              <div style={{ background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: 6, padding: '.875rem 1rem', marginBottom: '1rem' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{q.message}</p>
              </div>

              {q.reply ? (
                <div style={{ background: '#F0FFF8', border: '1px solid #ABF5D1', borderLeft: '3px solid var(--success)', borderRadius: 6, padding: '.875rem 1rem' }}>
                  <p className="text-xs" style={{ fontWeight: 800, color: '#006644', marginBottom: '.375rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    Response from {getUserName(q.toId)}:
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)', lineHeight: 1.7 }}>{q.reply}</p>
                  <p className="text-xs text-muted" style={{ marginTop: '.5rem' }}>
                    {q.repliedAt ? new Date(q.repliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              ) : !isDev && (
                activeQueryId === q._id ? (
                  <form onSubmit={handleReply} className="modal-form">
                    <textarea className="form-textarea" required
                      placeholder="Write a clear and helpful response…"
                      value={replyText} onChange={e => setReplyText(e.target.value)}
                      style={{ minHeight: 90 }} />
                    <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => setActiveQueryId(null)} className="btn btn-ghost">Cancel</button>
                      <button type="submit" className="btn btn-success"><Send size={14} /> Send Response</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setActiveQueryId(q._id)} className="btn btn-secondary">
                    <Send size={14} /> Reply to Query
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Query Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="modal-icon" style={{ background: 'var(--primary-xlight)', color: 'var(--primary)' }}>
                  <MessageSquare size={20} />
                </div>
                <h2 className="modal-title">New Query</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <p className="text-sm">Your query will be sent to your assigned Team Leader for a response.</p>
            </div>
            <form onSubmit={handleAddQuery} className="modal-form">
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input type="text" className="form-input" required
                  placeholder="e.g. Doubts regarding API integration"
                  value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Message / Details *</label>
                <textarea className="form-textarea" required
                  placeholder="Explain your query in detail. Include any relevant context or error messages…"
                  value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ minHeight: 120 }} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Query</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default QueryPage;
