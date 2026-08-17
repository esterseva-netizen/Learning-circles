import { useState, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// כתובת הבסיס של השרת (בלי /api בסוף) — להצגת קבצים מצורפים לתגובות
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const CommentSection = ({ postId, initialCount = 0, onCountChange }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(selected.type)) {
      setError('ניתן לצרף רק קובץ PDF או Word');
      e.target.value = '';
      return;
    }
    setError('');
    setFile(selected);
  };

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

    if (!content.trim() && !file) {
      setError('יש להזין תוכן או לצרף קובץ');
      return;
    }

    setSending(true);
    try {
      let res;
      if (file) {
        const formData = new FormData();
        if (content.trim()) formData.append('content', content);
        formData.append('document', file);
        res = await api.post(`/comments/${postId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post(`/comments/${postId}`, { content });
      }
      setComments([...comments, res.data.data]);
      setContent('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        aria-label={open ? 'הסתר תגובות' : 'הצג תגובות'}
        aria-expanded={open}
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
              {comment.content && <p style={{ margin: '2px 0 0' }}>{comment.content}</p>}

              {comment.mediaUrl && (
                <a
                  href={`${API_BASE}${comment.mediaUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', marginTop: '4px',
                    background: '#f0f4ff', color: '#1976D2', borderRadius: '6px',
                    fontSize: '12px', textDecoration: 'none', border: '1px solid #d0dcf5'
                  }}
                >
                  📎 {comment.mediaName || 'קובץ מצורף'}
                </a>
              )}
            </div>
          ))}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={content}
                onChange={(e) => { setContent(e.target.value); setError(''); }}
                placeholder="הוסף תגובה..."
                aria-label="תוכן התגובה"
                style={{ flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="צרף קובץ PDF או Word"
                style={{ padding: '6px 10px', background: file ? '#e8f5e9' : '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
              >
                📎
              </button>
              <button
                type="submit"
                disabled={sending}
                style={{ padding: '6px 14px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
              >
                {sending ? '...' : 'שלח'}
              </button>
            </div>
            {file && (
              <span style={{ fontSize: '12px', color: '#4CAF50' }}>📎 מצורף: {file.name}</span>
            )}
          </form>

          {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CommentSection;