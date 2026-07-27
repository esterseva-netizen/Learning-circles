import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeed, createPost } from '../store/postsSlice';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { feed, loading } = useSelector((state) => state.posts);
  const { list: circles } = useSelector((state) => state.circles);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('general');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;
    setPosting(true);
    await dispatch(createPost({ content, postType }));
    setContent('');
    setPosting(false);
  };

  const postTypeColors = {
    general: '#5B5FEF',
    question: '#f59e0b',
    material: '#38D9A9',
    update: '#8b5cf6',
  };

  const postTypeLabels = {
    general: 'כללי',
    question: 'שאלה',
    material: 'חומר לימוד',
    update: 'עדכון',
  };

  return (
    <div style={{ fontFamily: 'Heebo, sans-serif', background: '#F7F9FC', minHeight: '100vh', direction: 'rtl' }}>
      <style>{`
        .post-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .post-card { transition: all 0.2s; }
        .action-btn:hover { background: #F1F5F9 !important; }
        .circle-item:hover { background: #F8FAFF !important; }
        .sidebar-btn:hover { background: #5B5FEF !important; color: white !important; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '1.5rem' }}>

        {/* Sidebar Right — פרופיל */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* כרטיס פרופיל */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: '700', margin: '0 auto 1rem' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: '0 0 4px', color: '#1E293B', fontSize: '16px' }}>{user?.name}</h3>
            <p style={{ margin: '0 0 8px', color: '#64748B', fontSize: '13px' }}>{user?.institution || 'לא צוין מוסד'}</p>
            {user?.userType && (
              <span style={{ background: '#EEF2FF', color: '#5B5FEF', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                {user.userType === 'student' ? 'סטודנט' : user.userType === 'highschool' ? 'תיכוניסט' : 'עצמאי'}
              </span>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '18px' }}>{circles?.length || 0}</div>
                <div style={{ color: '#64748B', fontSize: '12px' }}>מעגלים</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '18px' }}>{feed?.length || 0}</div>
                <div style={{ color: '#64748B', fontSize: '12px' }}>פוסטים</div>
              </div>
            </div>
            <Link to="/profile" style={{ display: 'block', marginTop: '1rem', padding: '8px', background: '#F8FAFF', color: '#5B5FEF', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', border: '1px solid #E2E8F0' }}>
              ✏️ ערוך פרופיל
            </Link>
          </div>

          {/* ניווט מהיר */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
            {[
              { icon: '🏠', label: 'דף הבית', path: '/' },
              { icon: '⭕', label: 'המעגלים שלי', path: '/circles' },
              { icon: '➕', label: 'מעגל חדש', path: '/circles/create' },
              { icon: '👤', label: 'פרופיל', path: '/profile' },
            ].map(item => (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px',
                textDecoration: 'none', color: '#1E293B', fontSize: '14px',
                fontWeight: '500', transition: 'background 0.2s',
                marginBottom: '4px'
              }}
                className="circle-item">
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* ברוכים הבאים */}
          <div style={{
            background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)',
            borderRadius: '16px', padding: '1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 4px 20px rgba(91,95,239,0.3)'
          }}>
            <div>
              <h2 style={{ color: 'white', margin: '0 0 6px', fontSize: '20px' }}>
                שלום, {user?.name?.split(' ')[0]}! 👋
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '14px' }}>
                {feed.length > 0 ? `יש ${feed.length} פוסטים חדשים מהמעגלים שלך` : 'הצטרף למעגלים וגלה תוכן חדש!'}
              </p>
            </div>
            <div style={{ fontSize: '50px' }}>📚</div>
          </div>

          {/* טופס פרסום */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder="על מה תרצי לשתף היום? שאלה, חומר לימוד, עדכון..."
                  rows={3}
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '15px', outline: 'none', resize: 'none', fontFamily: 'Heebo, sans-serif', color: '#1E293B', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {Object.entries(postTypeLabels).map(([key, label]) => (
                      <button key={key} onClick={() => setPostType(key)} style={{
                        padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                        fontSize: '12px', fontWeight: '500', fontFamily: 'Heebo, sans-serif',
                        background: postType === key ? postTypeColors[key] : '#F1F5F9',
                        color: postType === key ? 'white' : '#64748B',
                        transition: 'all 0.2s'
                      }}>{label}</button>
                    ))}
                  </div>
                  <button onClick={handleSubmit} disabled={posting || !content} style={{
                    padding: '8px 20px', background: content ? 'linear-gradient(135deg, #5B5FEF, #7C4DFF)' : '#E2E8F0',
                    color: content ? 'white' : '#94A3B8', border: 'none', borderRadius: '10px',
                    fontSize: '14px', fontWeight: '600', cursor: content ? 'pointer' : 'not-allowed',
                    fontFamily: 'Heebo, sans-serif', transition: 'all 0.2s'
                  }}>
                    {posting ? 'מפרסם...' : 'פרסם ✉️'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* פוסטים */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
              <div style={{ fontSize: '40px', marginBottom: '1rem' }}>⏳</div>
              <p>טוען פוסטים...</p>
            </div>
          )}

          {!loading && feed.length === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '60px', marginBottom: '1rem' }}>🌱</div>
              <h3 style={{ color: '#1E293B', marginBottom: '8px' }}>עדיין אין פוסטים</h3>
              <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>הצטרף למעגלי לימוד כדי לראות תוכן מעניין!</p>
              <button onClick={() => navigate('/circles')} style={{
                padding: '10px 24px', background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Heebo, sans-serif'
              }}>
                גלה מעגלים ⭕
              </button>
            </div>
          )}

          {feed.map((post) => (
            <div key={post._id} className="post-card" style={{
              background: 'white', borderRadius: '16px', padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '18px' }}>
                    {post.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '15px' }}>{post.author?.name}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#64748B', fontSize: '12px' }}>{new Date(post.createdAt).toLocaleDateString('he-IL')}</span>
                      {post.circle?.name && (
                        <span style={{ color: '#5B5FEF', fontSize: '12px' }}>• {post.circle.name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  background: `${postTypeColors[post.postType]}20`,
                  color: postTypeColors[post.postType]
                }}>
                  {postTypeLabels[post.postType]}
                </span>
              </div>

              <p style={{ color: '#1E293B', fontSize: '15px', lineHeight: 1.7, margin: '0 0 1rem' }}>{post.content}</p>

              <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                <button className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748B', fontSize: '14px', fontFamily: 'Heebo, sans-serif' }}>
                  ❤️ {post.likesCount}
                </button>
                <button className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748B', fontSize: '14px', fontFamily: 'Heebo, sans-serif' }}>
                  💬 {post.commentsCount}
                </button>
                <button className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748B', fontSize: '14px', fontFamily: 'Heebo, sans-serif' }}>
                  🔗 שתף
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Left — מעגלים מומלצים */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1E293B', fontSize: '16px' }}>המעגלים שלי</h3>
              <Link to="/circles" style={{ color: '#5B5FEF', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>הצג הכל</Link>
            </div>

            {circles?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '1rem' }}>עדיין לא הצטרפת למעגלים</p>
                <Link to="/circles" style={{
                  display: 'block', padding: '8px', background: '#F8FAFF',
                  color: '#5B5FEF', borderRadius: '8px', fontSize: '13px',
                  fontWeight: '600', textDecoration: 'none', border: '1px solid #E2E8F0'
                }}>
                  גלה מעגלים ⭕
                </Link>
              </div>
            ) : (
              circles?.slice(0, 5).map(circle => (
                <Link key={circle._id} to={`/circles/${circle._id}`} className="circle-item" style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px', borderRadius: '10px', textDecoration: 'none',
                  marginBottom: '6px', transition: 'background 0.2s'
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>⭕</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '14px' }}>{circle.name}</div>
                    <div style={{ color: '#64748B', fontSize: '12px' }}>👥 {circle.membersCount} חברים</div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div style={{ background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🚀</div>
            <h3 style={{ color: 'white', margin: '0 0 8px', fontSize: '16px' }}>צור מעגל חדש</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: '0 0 1rem' }}>הזמן חברים ולמד יחד!</p>
            <Link to="/circles/create" style={{
              display: 'block', padding: '10px', background: 'white',
              color: '#5B5FEF', borderRadius: '10px', fontSize: '14px',
              fontWeight: '700', textDecoration: 'none'
            }}>
              + צור מעגל
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;