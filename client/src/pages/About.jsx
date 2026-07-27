import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Heebo, sans-serif', direction: 'rtl', background: '#F7F9FC' }}>
      <style>{`
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(91,95,239,0.15) !important; }
        .feature-card { transition: all 0.2s; }
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

      {/* Hero */}
      <div style={{
        background: `linear-gradient(rgba(91,95,239,0.85), rgba(124,77,255,0.85)), url(https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260) center/cover no-repeat`,
        padding: '8rem 2rem 5rem', textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '1rem' }}>⭕</div>
        <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: '900', margin: '0 0 1rem' }}>
          Learning Circles
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
          פלטפורמת הלמידה החברתית המובילה לסטודנטים ותלמידים בישראל
        </p>
        <Link to="/register" style={{
          display: 'inline-block', padding: '14px 32px',
          background: 'white', color: '#5B5FEF',
          borderRadius: '12px', fontSize: '16px', fontWeight: '700',
          textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          הצטרף עכשיו בחינם 🚀
        </Link>
      </div>

      {/* מה זה Learning Circles */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ color: '#1E293B', fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
            מה זה Learning Circles? 🤔
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto' }}>
            Learning Circles היא רשת חברתית ללמידה קבוצתית. אנחנו מאמינים שלומדים טוב יותר ביחד — ולכן בנינו פלטפורמה שמחברת בין סטודנטים ותלמידים, מאפשרת יצירת מעגלי לימוד, שיתוף חומרים, ותיאום פגישות.
          </p>
        </div>

        {/* פיצ'רים */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {[
            { icon: '⭕', title: 'מעגלי לימוד', desc: 'צור או הצטרף למעגלי לימוד לפי נושא, קטגוריה ותחום עניין.' },
            { icon: '💬', title: "צ'אט בזמן אמת", desc: "תאם פגישות, זום ושיתופי פעולה עם חברי המעגל בצ'אט חי." },
            { icon: '📄', title: 'שיתוף חומרים', desc: 'העלה ושתף חומרי לימוד, סיכומים ומסמכים עם הקבוצה.' },
            { icon: '🎓', title: 'קהילה לומדת', desc: 'הצטרף לאלפי סטודנטים ותלמידים מכל הארץ.' },
            { icon: '🔒', title: 'מעגלים פרטיים', desc: 'צור מעגלים פרטיים עם אישור הצטרפות לקבוצות סגורות.' },
            { icon: '📱', title: 'נגיש מכל מקום', desc: 'גלוש מהמחשב, הטאבלט או הסמארטפון בכל עת.' },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: 'white', borderRadius: '16px', padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ color: '#1E293B', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* צוות */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ color: '#1E293B', fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>הצוות שלנו 👩‍💻</h2>
          <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Learning Circles נבנתה על ידי סטודנטיות מלאות תשוקה לטכנולוגיה וחינוך, במסגרת פרויקט גמר בקורס Full Stack מתקדמים.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {['אסתר', 'טל'].map((name, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '70px', height: '70px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '28px', fontWeight: '700',
                  margin: '0 auto 8px'
                }}>
                  {name.charAt(0)}
                </div>
                <div style={{ fontWeight: '700', color: '#1E293B' }}>{name}</div>
                <div style={{ color: '#64748B', fontSize: '13px' }}>Full Stack Developer</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #5B5FEF, #7C4DFF)',
          borderRadius: '20px', padding: '3rem', textAlign: 'center'
        }}>
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 1rem' }}>
            מוכן להתחיל? 🚀
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', margin: '0 0 2rem' }}>
            הצטרף לאלפי סטודנטים שכבר לומדים יחד
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              padding: '12px 28px', background: 'white', color: '#5B5FEF',
              borderRadius: '12px', fontSize: '15px', fontWeight: '700', textDecoration: 'none'
            }}>הירשם חינם</Link>
            <Link to="/login" style={{
              padding: '12px 28px', background: 'rgba(255,255,255,0.15)', color: 'white',
              borderRadius: '12px', fontSize: '15px', fontWeight: '600', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>יש לי חשבון</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;