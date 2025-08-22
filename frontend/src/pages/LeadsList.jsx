import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LeadsList({ api }){
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterEmail, setFilterEmail] = useState('');
  const navigate = useNavigate();

  useEffect(()=> { fetchPage(); }, [page]);

  async function fetchPage(){
    try{
      const q = new URLSearchParams();
      q.set('page', page);
      q.set('limit', 20);
      if(filterEmail) q.set('email_contains', filterEmail);
      const res = await api.get('/leads?' + q.toString());
      setLeads(res.data.data);
      setTotalPages(res.data.totalPages);
    }catch(err){
      if(err.response && err.response.status===401){
        navigate('/login');
      }
    }
  }

  async function del(id){
    if(!confirm('Delete?')) return;
    await api.delete('/leads/' + id);
    fetchPage();
  }

  return (
    <div>
      <h3>Leads</h3>
      <div style={{display:'flex', gap:10}}>
        <input placeholder="email contains" value={filterEmail} onChange={e=>setFilterEmail(e.target.value)} />
        <button onClick={()=>{ setPage(1); fetchPage(); }}>Filter</button>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Status</th><th>Score</th><th>Actions</th></tr></thead>
        <tbody>
          {leads.map(l=> <tr key={l.id}>
            <td>{l.first_name} {l.last_name}</td>
            <td>{l.email}</td>
            <td>{l.company}</td>
            <td>{l.status}</td>
            <td>{l.score}</td>
            <td>
              <Link to={'/edit/' + l.id}>Edit</Link> | <button onClick={()=>del(l.id)}>Delete</button>
            </td>
          </tr>)}
        </tbody>
      </table>

      <div style={{marginTop:10}}>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {page} / {totalPages}</span>
        <button onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}
