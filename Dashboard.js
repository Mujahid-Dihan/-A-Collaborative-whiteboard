import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [meetingId, setMeetingId] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser(res.data);
    }).catch(() => {
      navigate('/');
    });
  }, [navigate]);

  const handleCreateMeeting = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/meetings/create', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetingId(res.data.meetingId);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating meeting');
    }
  };

  const handleJoinMeeting = () => {
    if (!meetingId.trim()) return alert('Enter a meeting ID!');
    navigate(`/whiteboard/${meetingId}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/whiteboard/${meetingId}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ padding: 30, maxWidth: 500, margin: 'auto' }}>
      <h2>Welcome {user?.name || 'User'} 👋</h2>

      <button onClick={handleCreateMeeting}>Start a New Meeting</button>

      {meetingId && (
        <div style={{ marginTop: 20 }}>
          <p><b>Meeting Link:</b> {window.location.origin}/whiteboard/{meetingId}</p>
          <button onClick={handleCopyLink}>
            {linkCopied ? 'Copied!' : 'Copy Invite Link'}
          </button>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <input
          type="text"
          placeholder="Enter Meeting ID"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
        />
        <button onClick={handleJoinMeeting}>Join Meeting</button>
      </div>

      <button style={{ marginTop: 30 }} onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
