import { memo } from 'react';

// React.memo — מונע רינדור מחדש של הכרטיס אם ה-props שלו (circle, onJoin, onOpenChat)
// לא השתנו, גם אם הקומפוננטה האב (Circles) מתרנדרת מחדש
const CircleCard = memo(function CircleCard({ circle, onOpen, onJoin, onOpenChat }) {
  return (
    <div
      onClick={() => onOpen(circle._id)}
      style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <h3 style={{ margin: '0 0 8px' }}>{circle.name}</h3>
      <p style={{ color: '#666', fontSize: '14px', margin: '0 0 8px' }}>{circle.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', color: '#888' }}>👥 {circle.membersCount} חברים</span>
        <span style={{ fontSize: '11px', background: '#e8f5e9', padding: '2px 8px', borderRadius: '4px', color: '#2e7d32' }}>
          {circle.category}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onJoin(circle._id); }}
          style={{ flex: 1, padding: '8px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          הצטרף
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onOpenChat(circle._id); }}
          style={{ padding: '8px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
        >
          💬
        </button>
      </div>
    </div>
  );
});

export default CircleCard;