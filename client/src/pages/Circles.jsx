import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCircles, joinCircle } from '../store/circlesSlice';

const Circles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.circles);

  useEffect(() => {
    dispatch(fetchCircles());
  }, [dispatch]);

  const handleJoin = (e, circleId) => {
    e.stopPropagation();
    dispatch(joinCircle(circleId));
  };

  if (loading) return <p style={{ textAlign: 'center' }}>טוען...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', direction: 'rtl' }}>
      <h2>מעגלי לימוד</h2>

      {list.length === 0 && <p>אין מעגלים עדיין — <span style={{ color: '#2196F3', cursor: 'pointer' }} onClick={() => navigate('/circles/create')}>צור את הראשון!</span></p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {list.map((circle) => (
          <div key={circle._id}
            onClick={() => navigate(`/circles/${circle._id}`)}
            style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <h3 style={{ margin: '0 0 8px' }}>{circle.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 8px' }}>{circle.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>👥 {circle.membersCount} חברים</span>
              <span style={{ fontSize: '11px', background: '#e8f5e9', padding: '2px 8px', borderRadius: '4px', color: '#2e7d32' }}>
                {circle.category}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={(e) => handleJoin(e, circle._id)}
                style={{ flex: 1, padding: '8px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                הצטרף
              </button>
              <button onClick={() => navigate(`/circles/${circle._id}/chat`)}
                style={{ padding: '8px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                💬
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Circles;