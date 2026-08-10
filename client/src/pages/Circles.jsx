import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCircles, joinCircle } from '../store/circlesSlice';
import CircleCard from '../components/CircleCard';

const Circles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.circles);

  useEffect(() => {
    dispatch(fetchCircles());
  }, [dispatch]);

  // useCallback — שומר על אותה הפניית פונקציה בין רינדורים,
  // כדי ש-React.memo ב-CircleCard יוכל למנוע רינדור מיותר
  const handleOpen = useCallback((circleId) => {
    navigate(`/circles/${circleId}`);
  }, [navigate]);

  const handleJoin = useCallback((circleId) => {
    dispatch(joinCircle(circleId));
  }, [dispatch]);

  const handleOpenChat = useCallback((circleId) => {
    navigate(`/circles/${circleId}/chat`);
  }, [navigate]);

  if (loading) return <p style={{ textAlign: 'center' }}>טוען...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', direction: 'rtl' }}>
      <h2>מעגלי לימוד</h2>

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