import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedRepos");
    if (stored) setSelectedRepos(JSON.parse(stored));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing selectedRepos={selectedRepos} />} />
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/admin" element={<Admin isAuthenticated={isAuthenticated} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App
