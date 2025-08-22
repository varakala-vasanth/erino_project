import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register({ api }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      await api.post('/auth/register', { email, password, firstName, lastName });
      alert('Registered. Please login.');
      navigate('/login');
    }catch(err){
      alert('Register failed');
    }
  }

  return (
    <div style={{maxWidth:400}}>
      <h3>Register</h3>
      <form onSubmit={submit}>
        <label>First name</label>
        <input value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <label>Last name</label>
        <input value={lastName} onChange={e=>setLastName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
