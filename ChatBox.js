import React, { useState, useEffect } from 'react';
import { socket } from '../services/socket';

const ChatBox = () => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!msg.trim()) return;
    socket.emit('chat-message', msg);
    setMessages((prev) => [...prev, { self: true, text: msg }]);
    setMsg('');
  };

  useEffect(() => {
    socket.on('chat-message', (text) => {
      setMessages((prev) => [...prev, { self: false, text }]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, []);

  return (
    <div style={{ border: '1px solid gray', padding: 10, maxHeight: 300, overflowY: 'auto', width: 300 }}>
      <div>
        {messages.map((m, i) => (
          <p key={i} style={{ color: m.self ? 'blue' : 'black' }}>
            {m.self ? 'You' : 'Other'}: {m.text}
          </p>
        ))}
      </div>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message" />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
