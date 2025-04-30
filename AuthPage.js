import React, { useState } from 'react';
import { signup, login, verifyEmail } from '../services/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [verifyToken, setVerifyToken] = useState('');
  const [verificationMode, setVerificationMode] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (verificationMode) {
        await verifyEmail({ token: verifyToken, email: form.email });
        setMessage('Email verified! You can now log in.');
        setVerificationMode(false);
        setIsLogin(true);
      } else if (isLogin) {
        const res = await login(form);
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard';
      } else {
        const res = await signup(form);
        setMessage(res.data.message);
        setVerificationMode(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{verificationMode ? 'Verify Email' : isLogin ? 'Login' : 'Sign Up'}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && !verificationMode && (
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        )}
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        {!verificationMode && (
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        )}
        {verificationMode && (
          <input name="token" placeholder="Verification Token" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} required />
        )}
        <button type="submit">{verificationMode ? 'Verify' : isLogin ? 'Login' : 'Sign Up'}</button>
      </form>

      <p>{message}</p>

      {!verificationMode && (
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      )}
    </div>
  );
};

export default AuthPage;
