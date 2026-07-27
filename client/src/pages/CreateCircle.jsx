import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = [
  { value: 'mathematics', label: 'מתמטיקה' },
  { value: 'programming', label: 'תכנות' },
  { value: 'physics', label: 'פיזיקה' },
  { value: 'biology', label: 'ביולוגיה' },
  { value: 'economics', label: 'כלכלה' },
  { value: 'languages', label: 'שפות' },
  { value: 'history', label: 'היסטוריה' },
  { value: 'literature', label: 'ספרות' },
  { value: 'art', label: 'אמנות' },
  { value: 'music', label: 'מוזיקה' },
  { value: 'psychology', label: 'פסיכולוגיה' },
  { value: 'other', label: 'אחר' },
];

const CreateCircle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'mathematics',
    customCategory: '',
    isPrivate: false,
    maxMembers: 50,
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) { setError('שם המעגל הוא חובה'); return; }
    setLoading(true);
    try {
      const data = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };
      await api.post('/circles', data);
      navigate('/circles');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה ביצירת המעגל');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', direction: 'rtl' }}>
      <h2>יצירת מעגל לימוד חדש</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>שם המעגל</label>
          <input name="name" value={formData.name} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>תיאור</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>קטגוריה</label>
          <select name="category" value={formData.category} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {formData.category === 'other' && (
          <div style={{ marginBottom: '1rem' }}>
            <label>שם קטגוריה מותאמת</label>
            <input name="customCategory" value={formData.customCategory} onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label>תגיות (מופרדות בפסיקים)</label>
          <input name="tags" value={formData.tags} onChange={handleChange}
            placeholder="למשל: אלגברה, גיאומטריה"
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>מקסימום חברים</label>
          <input name="maxMembers" type="number" min="2" max="200" value={formData.maxMembers} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input name="isPrivate" type="checkbox" checked={formData.isPrivate} onChange={handleChange} />
          <label>מעגל פרטי (דורש אישור להצטרפות)</label>
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'יוצר...' : 'צור מעגל'}
        </button>
      </form>
    </div>
  );
};

export default CreateCircle;