import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'שם הוא שדה חובה';
    if (!formData.email) newErrors.email = 'אימייל הוא שדה חובה';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'סיסמה חייבת להיות לפחות 8 תווים';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'הסיסמאות לא תואמות';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: formData.name, email: formData.email, password: formData.password,
      });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'שגיאה בהרשמה' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'שם מלא', type: 'text', icon: '👤', placeholder: 'השם שלך' },
    { name: 'email', label: 'אימייל', type: 'email', icon: '✉️', placeholder: 'your@email.com' },
    { name: 'password', label: 'סיסמה', type: 'password', icon: '🔒', placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'אימות סיסמה', type: 'password', icon: '🔒', placeholder: '••••••••' },
  ];

  const features = [
    { icon: '📚', text: 'מעגלי לימוד' },
    { icon: '💬', text: "צ'אט בזמן אמת" },
    { icon: '🎓', text: 'סטודנטים מכל הארץ' },
    { icon: '📄', text: 'שיתוף חומרי לימוד' },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Heebo, sans-serif', direction: 'rtl' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .register-card { animation: fadeIn 0.6s ease forwards; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(91,95,239,0.5) !important; }
        .submit-btn:active { transform: scale(0.98); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0.9rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px'
          }}>⭕</div>
          <span style={{ fontWeight: '700', fontSize: '18px', color: '#1E293B' }}>Learning Circles</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/login" style={{ color: '#64748B', fontSize: '15px', textDecoration: 'none' }}>התחבר</Link>
          <Link to="/register" style={{ color: '#64748B', fontSize: '15px', textDecoration: 'none' }}>הירשם</Link>
          <Link to="/about" style={{ color: '#64748B', fontSize: '15px', textDecoration: 'none' }}>אודות</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '70px' }}>

        {/* Left Side */}
        <div style={{
          flex: 1, padding: '4rem 3rem',
          background: `linear-gradient(rgba(91,95,239,0.75), rgba(124,77,255,0.75)), url(https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260) center/cover no-repeat`,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ color: 'white', fontSize: '2.8rem', fontWeight: '900', margin: '0 0 1rem', lineHeight: 1.2 }}>
              הצטרף לקהילה<br />הלומדת! 🎓
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, margin: '0 0 3rem', maxWidth: '420px' }}>
              הירשם עכשיו והתחל ללמוד יחד עם אלפי סטודנטים מכל הארץ.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '14px', padding: '1rem 1.2rem',
                  border: '1px solid rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <span style={{ fontSize: '26px' }}>{f.icon}</span>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#F7F9FC' }}>
          <div className="register-card" style={{
            width: '100%', maxWidth: '420px',
            background: 'white', borderRadius: '24px', padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, color: '#1E293B', fontSize: '1.8rem', fontWeight: '700' }}>יצירת חשבון 🚀</h2>
              <p style={{ margin: '8px 0 0', color: '#64748B', fontSize: '15px' }}>הצטרף לקהילת הלומדים שלנו</p>
            </div>

            {errors.general && (
              <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '10px', padding: '10px', marginBottom: '1rem', color: '#c62828', fontSize: '14px', textAlign: 'center' }}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {fields.map(field => (
                <div key={field.name} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>{field.label}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>{field.icon}</span>
                    <input
                      name={field.name} type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name]} onChange={handleChange}
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused('')}
                      style={{
                        width: '100%', padding: '12px 44px 12px 14px',
                        border: `2px solid ${focused === field.name ? '#5B5FEF' : errors[field.name] ? '#ef4444' : '#E2E8F0'}`,
                        borderRadius: '12px', fontSize: '15px', outline: 'none',
                        transition: 'all 0.2s', boxSizing: 'border-box',
                        background: focused === field.name ? '#fafbff' : 'white',
                        boxShadow: focused === field.name ? '0 0 0 4px rgba(91,95,239,0.1)' : 'none',
                        color: '#1E293B', fontFamily: 'Heebo, sans-serif'
                      }} />
                  </div>
                  {errors[field.name] && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors[field.name]}</p>}
                </div>
              ))}

              <button type="submit" disabled={loading} className="submit-btn" style={{
                width: '100%', padding: '13px', marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(91,95,239,0.35)',
                transition: 'all 0.2s', fontFamily: 'Heebo, sans-serif'
              }}>
                {loading ? 'נרשם...' : 'הירשם עכשיו →'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#64748B' }}>
                כבר יש לך חשבון?{' '}
                <Link to="/login" style={{ color: '#5B5FEF', fontWeight: '700', textDecoration: 'none' }}>התחבר</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;