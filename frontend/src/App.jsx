import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LeadsList from './pages/LeadsList';
import Login from './pages/Login';
import Register from './pages/Register';
import LeadForm from './pages/LeadForm';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000', withCredentials: true });

function AppWrapper(){
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=> {
    api.get('/auth/me').then(r=> setUser(r.data)).catch(()=> setUser(null));
  },[]);

  async function logout(){
    await api.post('/auth/logout');
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="container">
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Lead Management</h2>
        <nav>
          {user ? <>
            <span style={{marginRight:10}}>Hi, {user.firstName}</span>
            <Link to="/leads">Leads</Link> | <Link to="/create">Create</Link> | <button onClick={logout}>Logout</button>
          </> : <Link to="/login">Login</Link>}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={ user ? <LeadsList api={api}/> : <Login api={api} onLogin={()=>{ api.get('/auth/me').then(r=> setUser(r.data)); }} />} />
        <Route path="/login" element={<Login api={api} onLogin={()=>{ api.get('/auth.me').then(()=>{}); }} />} />
        <Route path="/register" element={<Register api={api} />} />
        <Route path="/leads" element={<LeadsList api={api} />} />
        <Route path="/create" element={<LeadForm api={api} />} />
        <Route path="/edit/:id" element={<LeadForm api={api} />} />
      </Routes>
    </div>
  );
}

export default function App(){
  return <BrowserRouter><AppWrapper /></BrowserRouter>
}
