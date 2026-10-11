import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { setSession } from './services/session';
import './App.css';

const App = () => {
  const [session, setCurrent] = useState(null);

  const handleLogin = (s) => {
    setSession(s);
    setCurrent(s);
  };

  const handleSignOut = () => {
    setSession(null);
    setCurrent(null);
  };

  if (!session) return <LoginPage onLogin={handleLogin} />;
  return <Dashboard session={session} onSignOut={handleSignOut} />;
};

export default App;