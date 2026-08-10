import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontFamily: 'Heebo, sans-serif',
      direction: 'rtl',
      padding: '2rem'
    }}>
      <div style={{ fontSize: '80px', marginBottom: '0.5rem' }}>⭕</div>
      <h1 style={{ fontSize: '64px', margin: '0', color: '#5B5FEF' }}>404</h1>
      <p style={{ fontSize: '20px', color: '#555', margin: '1rem 0 2rem' }}>
        העמוד שחיפשת לא נמצא
      </p>
      <Link
        to="/"
        style={{
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)',
          color: 'white',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(91,95,239,0.35)'
        }}
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
};

export default NotFound;