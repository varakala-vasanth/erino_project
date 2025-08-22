import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function LeadForm({ api }){
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name:'', last_name:'', email:'', phone:'', company:'', city:'', state:'', source:'website', status:'new', score:0, lead_value:0, is_qualified:false
  });

  useEffect(()=> {
    if(id){
      api.get('/leads/' + id).then(r=> setForm(r.data)).catch(()=>{});
    }
  },[id]);

  async function submit(e){
    e.preventDefault();
    try{
      if(id) await api.put('/leads/' + id, form);
      else await api.post('/leads', form);
      navigate('/leads');
    }catch(err){
      alert('Save failed');
    }
  }

  return (
    <div style={{maxWidth:600}}>
      <h3>{id ? 'Edit' : 'Create'} Lead</h3>
      <form onSubmit={submit}>
        <div className="row">
          <div className="col"><label>First name</label><input value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} /></div>
          <div className="col"><label>Last name</label><input value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} /></div>
        </div>
        <label>Email</label><input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <label>Phone</label><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <label>Company</label><input value={form.company} onChange={e=>setForm({...form, company:e.target.value})} />
        <div className="row">
          <div className="col"><label>City</label><input value={form.city} onChange={e=>setForm({...form, city:e.target.value})} /></div>
          <div className="col"><label>State</label><input value={form.state} onChange={e=>setForm({...form, state:e.target.value})} /></div>
        </div>
        <label>Source</label>
        <select value={form.source} onChange={e=>setForm({...form, source:e.target.value})}>
          <option value="website">website</option><option value="facebook_ads">facebook_ads</option><option value="google_ads">google_ads</option><option value="referral">referral</option><option value="events">events</option><option value="other">other</option>
        </select>
        <label>Status</label>
        <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option value="new">new</option><option value="contacted">contacted</option><option value="qualified">qualified</option><option value="lost">lost</option><option value="won">won</option>
        </select>
        <label>Score</label><input type="number" value={form.score} onChange={e=>setForm({...form, score:Number(e.target.value)})} />
        <label>Lead Value</label><input type="number" value={form.lead_value} onChange={e=>setForm({...form, lead_value:Number(e.target.value)})} />
        <label><input type="checkbox" checked={form.is_qualified} onChange={e=>setForm({...form, is_qualified:e.target.checked})} /> Is Qualified</label>
        <br/>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
