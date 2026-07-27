import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Circles from './pages/Circles';
import Profile from './pages/Profile';
import CreateCircle from './pages/CreateCircle';
import CirclePage from './pages/CirclePage';
import Chat from './pages/Chat';
import About from './pages/About';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/about';

  if (isAuthPage) return null;

  const navLinks = [
    { path: '/', label: 'דף הבית', icon: '🏠' },
    { path: '/circles', label: 'מעגלים', icon: '⭕' },
    { path: '/circles/create', label: '+ מעגל חדש', icon: null },
    { path: '/profile', label: 'פרופיל', icon: '👤' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 2rem', height: '64px',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)',
      boxShadow: '0 4px 20px rgba(91,95,239,0.3)',
      fontFamily: 'Heebo, sans-serif'
    }}>
      <Link to="/" style={{
        position: 'absolute', right: '2rem',
        display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none'
      }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', border: '1px solid rgba(255,255,255,0.3)'
        }}>⭕</div>
        <span style={{ fontWeight: '700', fontSize: '18px', color: 'white' }}>Learning Circles</span>
      </Link>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              textDecoration: 'none', color: 'white',
              fontSize: '14px', fontWeight: isActive(link.path) ? '700' : '400',
              background: isActive(link.path) ? 'rgba(255,255,255,0.25)' : 'transparent',
              borderBottom: isActive(link.path) ? '2px solid white' : '2px solid transparent',
              transition: 'all 0.2s'
            }}>
              {link.icon && <span>{link.icon}</span>}
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {user && (
        <div style={{
          position: 'absolute', left: '2rem',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700', fontSize: '16px',
              border: '2px solid rgba(255,255,255,0.4)'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ color: 'white', fontSize: '14px' }}>{user.name?.split(' ')[0]}</span>
          </Link>

          <button onClick={logout} style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            color: 'white', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
            fontFamily: 'Heebo, sans-serif'
          }}>
            התנתק
          </button>
        </div>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <div style={{ fontFamily: 'Heebo, sans-serif', background: '#F7F9FC', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/circles" element={<ProtectedRoute><Circles /></ProtectedRoute>} />
          <Route path="/circles/create" element={<ProtectedRoute><CreateCircle /></ProtectedRoute>} />
          <Route path="/circles/:id" element={<ProtectedRoute><CirclePage /></ProtectedRoute>} />
          <Route path="/circles/:id/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;