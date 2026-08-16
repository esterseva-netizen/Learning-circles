import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCircles, joinCircle } from '../store/circlesSlice';
import CircleCard from '../components/CircleCard';

const Circles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.circles);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    dispatch(fetchCircles());
  }, [dispatch]);

  const handleOpen = useCallback((circleId) => {
    navigate(`/circles/${circleId}`);
  }, [navigate]);

  const handleJoin = useCallback(async (circleId) => {
    const result = await dispatch(joinCircle(circleId));

    if (joinCircle.fulfilled.match(result)) {
      // הצליח — מציג הודעת אישור ומרענן את מספרי החברים בכל הכרטיסים
      setFeedback({ type: 'success', text: result.payload.message || 'ההצטרפות הושלמה' });
      dispatch(fetchCircles());
    } else {
      // נכשל — למשל "כבר חבר במעגל זה" (מגיע מהשרת)
      setFeedback({ type: 'error', text: result.payload || 'שגיאה בהצטרפות למעגל' });
    }

    // ההודעה נעלמת אוטומטית אחרי 3 שניות
    setTimeout(() => setFeedback(null), 3000);
  }, [dispatch]);

  const handleOpenChat = useCallback((circleId) => {
    navigate(`/circles/${circleId}/chat`);
  }, [navigate]);

  if (loading) return <p style={{ textAlign: 'center' }}>טוען...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', direction: 'rtl' }}>
      <h2>מעגלי לימוד</h2>

      {feedback && (
        <div style={{
          padding: '10px 16px',
          marginBottom: '1rem',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          background: feedback.type === 'success' ? '#e8f5e9' : '#fdecea',
          color: feedback.type === 'success' ? '#2e7d32' : '#c62828',
          border: `1px solid ${feedback.type === 'success' ? '#a5d6a7' : '#f5c6cb'}`,
        }}>
          {feedback.type === 'success' ? '✅ ' : '⚠️ '}{feedback.text}
        </div>
      )}

      {list.length === 0 && (
        <p>
          אין מעגלים עדיין —{' '}
          <span style={{ color: '#2196F3', cursor: 'pointer' }} onClick={() => navigate('/circles/create')}>
            צור את הראשון!
          </span>
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {list.map((circle) => (
          <CircleCard
            key={circle._id}
            circle={circle}
            onOpen={handleOpen}
            onJoin={handleJoin}
            onOpenChat={handleOpenChat}
          />
        ))}
      </div>
    </div>
  );
};

export default Circles;