import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import WhiteboardRoom from './pages/WhiteboardRoom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/whiteboard/:meetingId" element={<WhiteboardRoom />} />
        {/* we'll later add whiteboard route here */}
      </Routes>
    </Router>
  );
}

export default App;
