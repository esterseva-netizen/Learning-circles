import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, initialCount = 0, onCountChange }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadComments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/comments/${postId}`);
      setComments(res.data.data);
      setLoaded(true);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בטעינת התגובות');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !loaded) loadComments();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('תוכן התגובה הוא שדה חובה');
      return;
    }

    setSending(true);
    try {
      const res = await api.post(`/comments/${postId}`, { content });
      setComments([...comments, res.data.data]);
      setContent('');
      onCountChange?.(1);
    } catch (err) {
      // תופס גם שגיאות ולידציה מהשרת (JOI) וגם שגיאות אחרות
      const serverErrors = err.response?.data?.errors;
      setError(serverErrors?.[0] || err.response?.data?.message || 'שגיאה בשליחת התגובה');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      onCountChange?.(-1);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה במחיקת התגובה');
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <button
        onClick={handleToggle}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '14px', padding: 0 }}
      >
        💬 {initialCount} תגובות {open ? '▲' : '▼'}
      </button>

      {open && (
        <div style={{ marginTop: '10px', paddingRight: '12px', borderRight: '2px solid #eee' }}>
          {loading && <p style={{ fontSize: '13px', color: '#888' }}>טוען תגובות...</p>}

          {!loading && loaded && comments.length === 0 && (
            <p style={{ fontSize: '13px', color: '#888' }}>אין תגובות עדיין — היה הראשון להגיב!</p>
          )}

          {comments.map(comment => (
            <div key={comment._id} style={{ marginBottom: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px' }}>{comment.author?.name}</strong>
                {comment.author?._id === user?._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e57373', fontSize: '12px' }}
                  >
                    מחק
                  </button>
                )}
              </div>
              <p style={{ margin: '2px 0 0' }}>{comment.content}</p>
            </div>
          ))}

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <input
              type="text"
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(''); }}
              placeholder="הוסף תגובה..."
              style={{ flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
            <button
              type="submit"
              disabled={sending}
              style={{ padding: '6px 14px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
            >
              {sending ? '...' : 'שלח'}
            </button>
          </form>

          {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CommentSection;