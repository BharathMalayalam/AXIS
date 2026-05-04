import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, User, Clock, CheckCircle2, X, Plus, AlertCircle } from 'lucide-react';

const QueryPage = () => {
  const { currentUser, queries, addQuery, replyQuery, users } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [replyText, setReplyText] = useState('');
  const [activeQueryId, setActiveQueryId] = useState(null);

  const isDev = currentUser?.role === 'developer';
  const myQueries = queries;

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
    setReplyText('');
    setActiveQueryId(null);
  };

  const getUserName = (id) => {
    if (!id) return 'Unknown';
    if (typeof id === 'object') return id.name;
    return users.find(u => u._id === id)?.name || 'Unknown';
  };

  const resolvedCount = myQueries.filter(q => q.reply).length;
  const pendingCount  = myQueries.filter(q => !q.reply).length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isDev ? 'Raise a Query' : 'Developer Queries'}</h1>
          <p className="page-subtitle">
            {isDev
              ? 'Communicate your doubts and questions with your Team Leader.'
              : 'Respond to queries and clarify doubts from your developers.'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {myQueries.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {pendingCount > 0 && (
                <span style={{ background: '#FFFAE6', color: '#974F0C', border: '1px solid #FFE380', borderRadius: '20px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Clock size={13} /> {pendingCount} Pending
                </span>
              )}
              {resolvedCount > 0 && (
                <span style={{ background: '#E3FCEF', color: '#006644', border: '1px solid #ABF5D1', borderRadius: '20px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <CheckCircle2 size={13} /> {resolvedCount} Resolved
                </span>
              )}
            </div>
          )}
          {isDev && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={16} /> New Query
            </button>
          )}
        </div>
      </div>

      {/* Query List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myQueries.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #DFE1E6', borderRadius: '12px', padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(9,30,66,0.06)' }}>
            <div style={{ width: '64px', height: '64px', background: '#DEEBFF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#0052CC' }}>
              <MessageSquare size={32} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#172B4D', marginBottom: '0.5rem' }}>No Queries Found</h3>
            <p style={{ color: '#6B778C', fontSize: '0.9rem' }}>
              {isDev ? 'Submit your first query to get started.' : 'No queries from developers yet.'}
            </p>
          </div>
        ) : (
          [...myQueries].reverse().map(q => (
            <div key={q._id} style={{
              background: '#fff', border: '1px solid #DFE1E6', borderRadius: '10px',
              boxShadow: '0 1px 4px rgba(9,30,66,0.06)', overflow: 'hidden',
              transition: 'all 0.2s',
              borderLeft: `4px solid ${q.reply ? '#36B37E' : '#FFAB00'}`,
            }}>
              {/* Query Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F4F5F7', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    background: '#0052CC', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', fontWeight: '800',
                  }}>
                    {getUserName(q.fromId)[0]?.toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#172B4D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.subject}</h4>
                    <p style={{ fontSize: '0.775rem', color: '#6B778C', marginTop: '2px' }}>
                      From: <strong style={{ color: '#42526E' }}>{getUserName(q.fromId)}</strong>
                      {' · '}
                      {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {q.reply
                  ? <span className="badge badge-completed" style={{ flexShrink: 0 }}><CheckCircle2 size={11} /> Resolved</span>
                  : <span className="badge badge-pending"  style={{ flexShrink: 0 }}><Clock size={11} /> Pending</span>
                }
              </div>

              {/* Message Body */}
              <div style={{ padding: '1.125rem 1.5rem' }}>
                <div style={{ background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: '6px', padding: '0.875rem 1rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#42526E', lineHeight: 1.7 }}>{q.message}</p>
                </div>

                {/* Reply Panel */}
                {q.reply ? (
                  <div style={{ background: '#F0FFF8', border: '1px solid #ABF5D1', borderRadius: '6px', padding: '0.875rem 1rem', borderLeft: '3px solid #36B37E' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: '800', color: '#006644', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Response from {getUserName(q.toId)}:
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#172B4D', lineHeight: 1.7 }}>{q.reply}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B778C', marginTop: '0.5rem' }}>
                      {q.repliedAt ? new Date(q.repliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                ) : !isDev && (
                  <div>
                    {activeQueryId === q._id ? (
                      <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <textarea
                          className="form-textarea"
                          required
                          placeholder="Write a clear and helpful response…"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          style={{ minHeight: '90px' }}
                        />
                        <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setActiveQueryId(null)} className="btn btn-ghost">Cancel</button>
                          <button type="submit" className="btn btn-success">
                            <Send size={15} /> Send Response
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button onClick={() => setActiveQueryId(q._id)} className="btn btn-secondary">
                        <Send size={15} /> Reply to Query
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Query Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#DEEBFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052CC' }}>
                  <MessageSquare size={18} />
                </div>
                <h2 className="modal-title">New Query</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <div style={{ background: '#F8F9FC', border: '1px solid #EBECF0', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <AlertCircle size={15} style={{ color: '#0052CC', flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '0.8125rem', color: '#42526E', lineHeight: 1.5 }}>
                Your query will be sent to your assigned Team Leader for a response.
              </p>
            </div>
            <form onSubmit={handleAddQuery} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
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
                  style={{ minHeight: '120px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem' }}>
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
