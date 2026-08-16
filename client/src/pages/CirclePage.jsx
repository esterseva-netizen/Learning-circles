import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

// כתובת הבסיס של השרת (בלי /api בסוף) — משמשת לבניית קישור להורדת קבצים מצורפים
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const CirclePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('general');
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [circleRes, postsRes] = await Promise.all([
          api.get(`/circles/${id}`),
          api.get(`/posts/circle/${id}`)
        ]);
        setCircle(circleRes.data.data);
        setPosts(postsRes.data.data);
      } catch (err) {
        setError('שגיאה בטעינת המעגל');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // בדיקה בסיסית בצד הלקוח — מותר רק PDF או Word (בדיקה מלאה חוזרת גם בשרת)
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

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content) return;
    setPosting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('postType', postType);
      formData.append('circle', id);
      if (file) formData.append('document', file);

      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts([res.data.data, ...posts]);
      setContent('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בפרסום');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      setPosts(posts.map(p =>
        p._id === postId
          ? { ...p, likesCount: p.likes?.includes(user._id) ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentCountChange = (postId, delta) => {
    setPosts(posts.map(p =>
      p._id === postId ? { ...p, commentsCount: p.commentsCount + delta } : p
    ));
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>טוען...</p>;
  if (error && !circle) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem', direction: 'rtl' }}>
      <div style={{ padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>{circle?.name}</h2>
        <p style={{ color: '#555', margin: '8px 0' }}>{circle?.description}</p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '14px', color: '#888' }}>
          <span>👥 {circle?.membersCount} חברים</span>
          <span>📚 {circle?.category}</span>
          {circle?.isPrivate && <span>🔒 פרטי</span>}
        </div>
      </div>

      <form onSubmit={handlePost} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>פרסם פוסט</h3>
        <select value={postType} onChange={(e) => setPostType(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}>
          <option value="general">כללי</option>
          <option value="question">שאלה</option>
          <option value="material">חומר לימוד</option>
          <option value="update">עדכון</option>
        </select>
        <textarea value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="מה תרצה לשתף עם המעגל?" rows={3}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px' }}>
            📎 צרף קובץ (PDF / Word) — לא חובה
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ fontSize: '13px' }}
          />
          {file && <span style={{ fontSize: '12px', color: '#4CAF50', marginRight: '8px' }}>נבחר: {file.name}</span>}
        </div>

        {error && <p style={{ color: 'red', fontSize: '13px', margin: '0 0 8px' }}>{error}</p>}

        <button type="submit" disabled={posting}
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {posting ? 'מפרסם...' : 'פרסם'}
        </button>
      </form>

      <h3>פוסטים</h3>
      {posts.length === 0 && <p>אין פוסטים עדיין — היה הראשון לפרסם!</p>}

      {posts.map(post => (
        <div key={post._id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong>{post.author?.name}</strong>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>
                {post.postType}
              </span>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {new Date(post.createdAt).toLocaleDateString('he-IL')}
              </span>
            </div>
          </div>
          <p style={{ margin: '0 0 8px' }}>{post.content}</p>

          {post.mediaUrl && (
            <a
              href={`${API_BASE}${post.mediaUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', marginBottom: '10px',
                background: '#f0f4ff', color: '#1976D2', borderRadius: '6px',
                fontSize: '13px', textDecoration: 'none', border: '1px solid #d0dcf5'
              }}
            >
              📎 {post.mediaName || 'קובץ מצורף'}
            </a>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleLike(post._id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e91e63' }}>
              ❤️ {post.likesCount}
            </button>
          </div>
          <CommentSection
            postId={post._id}
            initialCount={post.commentsCount}
            onCountChange={(delta) => handleCommentCountChange(post._id, delta)}
          />
        </div>
      ))}
    </div>
  );
};

export default CirclePage;