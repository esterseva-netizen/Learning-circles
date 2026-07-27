import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Chat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [circle, setCircle] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [circleRes, messagesRes] = await Promise.all([
          api.get(`/circles/${id}`),
          api.get(`/messages/${id}`)
        ]);
        setCircle(circleRes.data.data);
        setMessages(messagesRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/messages/${id}`);
        setMessages(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      const res = await api.post('/messages', { circle: id, content });
      setMessages([...messages, res.data.data]);
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>טוען צ'אט...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem', direction: 'rtl', display: 'flex', flexDirection: 'column', height: '80vh' }}>
      
      <div style={{ padding: '1rem', background: '#1976D2', color: 'white', borderRadius: '8px 8px 0 0' }}>
        <h3 style={{ margin: 0 }}>💬 צ'אט — {circle?.name}</h3>
        <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.8 }}>תאמו פגישות וזום עם חברי המעגל</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', border: '1px solid #ddd', background: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>אין הודעות עדיין — התחילו לתאם!</p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender?._id === user?._id;
          return (
            <div key={msg._id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMe ? 'flex-start' : 'flex-end',
            }}>
              <span style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>
                {msg.sender?.name} · {new Date(msg.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div style={{
                padding: '8px 12px',
                borderRadius: '12px',
                maxWidth: '70%',
                background: isMe ? '#1976D2' : 'white',
                color: isMe ? 'white' : 'black',
                border: isMe ? 'none' : '1px solid #ddd',
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', padding: '1rem', border: '1px solid #ddd', borderTop: 'none', background: 'white', borderRadius: '0 0 8px 8px' }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="כתוב הודעה... (למשל: נפגש ביום ג' בזום?)"
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button type="submit" disabled={sending}
          style={{ padding: '8px 16px', background: '#1976D2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {sending ? '...' : 'שלח'}
        </button>
      </form>
    </div>
  );
};

export default Chat;