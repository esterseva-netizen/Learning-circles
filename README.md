# Learning Circles ⭕

פלטפורמה חברתית-לימודית שמאפשרת לסטודנטים ותלמידי תיכון להקים ולהצטרף ל"מעגלי לימוד" — קבוצות ממוקדות נושא לשיתוף חומרי לימוד, פרסום פוסטים, ניהול דיונים וצ'אט קבוצתי בזמן אמת.

**קישור חי:** https://learning-circles-two.vercel.app

---

## תוכן עניינים
- [Tech Stack](#tech-stack)
- [תכונות עיקריות](#תכונות-עיקריות)
- [הרצה מקומית](#הרצה-מקומית)
- [משתני סביבה](#משתני-סביבה)
- [טבלת API Endpoints](#טבלת-api-endpoints)
- [צוות הפרויקט](#צוות-הפרויקט)

---

## Tech Stack

**Frontend:**
- React 19 (Vite)
- React Router DOM
- Redux Toolkit + React Context API
- Axios

**Backend:**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcrypt
- Joi (server-side validation)
- Multer (file/image uploads)
- Helmet + express-rate-limit (אבטחה)

**Deployment:**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## תכונות עיקריות

- הרשמה והתחברות מאובטחת (JWT + bcrypt)
- יצירת וניהול מעגלי לימוד (ציבוריים/פרטיים, עם אישור הצטרפות)
- פיד פוסטים אישי לפי המעגלים שהמשתמש חבר בהם
- תגובות על פוסטים (CRUD מלא)
- צ'אט קבוצתי בזמן אמת בתוך כל מעגל
- העלאת תמונות/מסמכים (Multer)
- דף פרופיל אישי עם תחומי עניין
- 404 page, loading states, ו-error handling בכל האפליקציה

---

## הרצה מקומית

### דרישות מוקדמות
- Node.js 18+
- חשבון MongoDB Atlas (או MongoDB מקומי)

### 1. שכפול הפרויקט
```bash
git clone https://github.com/esterseva-netizen/Learning-circles.git
cd Learning-circles
```

### 2. הרצת ה-Server
```bash
cd Server
npm install
cp .env.example .env
# ערכו את .env עם הפרטים שלכם (ראה טבלת משתני סביבה למטה)
npm run dev
```
השרת ירוץ על `http://localhost:5000`

### 3. הרצת ה-Client (בטרמינל נפרד)
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
האתר ירוץ על `http://localhost:5173`

---

## משתני סביבה

**Server/.env**
```
NODE_ENV=development
PORT=5000
MONGO_URI=<connection string מ-MongoDB Atlas>
JWT_SECRET=<מחרוזת אקראית וסודית>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

---

## טבלת API Endpoints

### Auth
| Method | Endpoint | תיאור | הרשאה |
|---|---|---|---|
| POST | `/api/auth/register` | הרשמת משתמש חדש | ציבורי |
| POST | `/api/auth/login` | התחברות | ציבורי |
| GET | `/api/auth/me` | פרטי המשתמש המחובר | מוגן |
| PUT | `/api/auth/update-profile` | עדכון פרופיל (כולל תמונה) | מוגן |

### Circles
| Method | Endpoint | תיאור | הרשאה |
|---|---|---|---|
| GET | `/api/circles` | כל המעגלים | ציבורי |
| GET | `/api/circles/my` | המעגלים שלי | מוגן |
| GET | `/api/circles/recommended` | מעגלים מומלצים | מוגן |
| GET | `/api/circles/:id` | מעגל ספציפי | ציבורי |
| POST | `/api/circles` | יצירת מעגל | מוגן |
| POST | `/api/circles/:id/join` | הצטרפות למעגל | מוגן |
| PUT | `/api/circles/:id` | עדכון מעגל | מוגן |
| DELETE | `/api/circles/:id` | מחיקת מעגל | מוגן |

### Posts
| Method | Endpoint | תיאור | הרשאה |
|---|---|---|---|
| GET | `/api/posts/feed` | פיד פוסטים אישי | מוגן |
| GET | `/api/posts/circle/:circleId` | פוסטים של מעגל | מוגן |
| POST | `/api/posts` | יצירת פוסט | מוגן |
| PUT | `/api/posts/:id` | עדכון פוסט | מוגן |
| DELETE | `/api/posts/:id` | מחיקת פוסט | מוגן |
| POST | `/api/posts/:id/like` | לייק על פוסט | מוגן |

### Comments
| Method | Endpoint | תיאור | הרשאה |
|---|---|---|---|
| GET | `/api/comments/:postId` | תגובות של פוסט | מוגן |
| POST | `/api/comments/:postId` | יצירת תגובה | מוגן |
| PUT | `/api/comments/:id` | עדכון תגובה | מוגן |
| DELETE | `/api/comments/:id` | מחיקת תגובה | מוגן |

### Messages
| Method | Endpoint | תיאור | הרשאה |
|---|---|---|---|
| GET | `/api/messages/:circleId` | הודעות של מעגל | מוגן |
| POST | `/api/messages/:circleId` | שליחת הודעה | מוגן |
| DELETE | `/api/messages/:id` | מחיקת הודעה | מוגן |

---

## צוות הפרויקט

| שם | תפקיד |
|---|---|
| Ester | Full Stack Development |

---

## הערות טכניות

- כל הסיסמאות מוצפנות עם bcrypt (12 salt rounds)
- אימות משתמשים מבוסס JWT עם תפוגה של 7 ימים
- Rate limiting: 100 בקשות/15 דק' באופן כללי, 10 ניסיונות/15 דק' ל-login/register
- וולידציה בצד השרת עם Joi על כל הנתיבים הרלוונטיים
- State management: Context API עבור מצב המשתמש המחובר, Redux Toolkit עבור מעגלים ופוסטים
