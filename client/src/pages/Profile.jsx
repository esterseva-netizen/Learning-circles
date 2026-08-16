import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const INTERESTS = ['מתמטיקה', 'תכנות', 'פיזיקה', 'ביולוגיה', 'היסטוריה', 'ספרות', 'אמנות', 'מוזיקה'];

// כתובת הבסיס של השרת (בלי /api בסוף) — כדי להציג את תמונת הפרופיל שנשמרה בשרת
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    institution: user?.institution || '',
    userType: user?.userType || 'student',
    studyYear: user?.studyYear || '',
    interests: user?.interests || [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- העלאת תמונת פרופיל — נפרד מטופס הפרטים, כדי לא לשבור את מה שכבר עובד ---
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const avatarInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selected.type)) {
      setAvatarError('ניתן להעלות רק תמונת JPEG, PNG או WebP');
      e.target.value = '';
      return;
    }

    setAvatarError('');
    setAvatarFile(selected);
    setAvatarPreview(URL.createObjectURL(selected));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setAvatarUploading(true);
    setAvatarError('');
    try {
      const avatarFormData = new FormData();
      avatarFormData.append('avatar', avatarFile);

      const res = await api.put('/auth/update-profile', avatarFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      login(res.data.user, localStorage.getItem('token'));
      setAvatarFile(null);
      setAvatarPreview(null);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    } catch (err) {
      setAvatarError(err.response?.data?.message || 'שגיאה בהעלאת התמונה');
    } finally {
      setAvatarUploading(false);
    }
  };

  const currentAvatarUrl = user?.avatar ? `${API_BASE}${user.avatar}` : null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
    } else {
      if (formData.interests.length >= 4) {
        setError('ניתן לבחור עד 4 תחומי עניין');
        return;
      }
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/update-profile', formData);
      login(res.data.user, localStorage.getItem('token'));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בעדכון הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', direction: 'rtl' }}>
      <h2>הפרופיל שלי</h2>

      {success && <p style={{ color: 'green', background: '#e8f5e9', padding: '8px', borderRadius: '4px' }}>הפרופיל עודכן בהצלחה!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* תמונת פרופיל */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{
          width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden',
          background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, border: '2px solid #2196F3'
        }}>
          {avatarPreview || currentAvatarUrl ? (
            <img
              src={avatarPreview || currentAvatarUrl}
              alt="תמונת פרופיל"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#2196F3' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <input
            ref={avatarInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleAvatarChange}
            style={{ fontSize: '13px', marginBottom: '6px' }}
          />
          {avatarFile && (
            <button
              type="button"
              onClick={handleAvatarUpload}
              disabled={avatarUploading}
              style={{ display: 'block', padding: '6px 14px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', marginTop: '6px' }}
            >
              {avatarUploading ? 'מעלה...' : 'שמור תמונה'}
            </button>
          )}
          {avatarError && <p style={{ color: 'red', fontSize: '12px', margin: '6px 0 0' }}>{avatarError}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>שם</label>
          <input name="name" value={formData.name} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>סוג לומד</label>
          <select name="userType" value={formData.userType} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}>
            <option value="highschool">תיכוניסט</option>
            <option value="student">סטודנט</option>
            <option value="independent">עצמאי</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>מוסד לימודים</label>
          <input name="institution" value={formData.institution} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>שנת לימודים</label>
          <input name="studyYear" value={formData.studyYear} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>ביוגרפיה</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>תחומי עניין (עד 4)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {INTERESTS.map(interest => (
              <button type="button" key={interest} onClick={() => toggleInterest(interest)}
                style={{
                  padding: '6px 12px', borderRadius: '20px', border: '1px solid #2196F3', cursor: 'pointer',
                  background: formData.interests.includes(interest) ? '#2196F3' : 'white',
                  color: formData.interests.includes(interest) ? 'white' : '#2196F3'
                }}>
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'שומר...' : 'שמור שינויים'}
        </button>
      </form>
    </div>
  );
};

export default Profile;