import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ api, onLogin }){
  const [email, setEmail] = useState('test@demo.com');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      await api.post('/auth/login', { email, password });
      if(onLogin) onLogin();
      navigate('/leads');
    }catch(err){
      alert('Login failed');
    }
  }

  return (
    <div style={{maxWidth:400}}>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
