const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const TOKEN_NAME = 'token';

function authMiddleware(req, res, next){
  const token = req.cookies[TOKEN_NAME];
  if(!token) return res.status(401).json({ error: 'Unauthorized' });
  try{
    jwt.verify(token, JWT_SECRET);
    return next();
  }catch(e){
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

router.post('/', authMiddleware, async (req, res) => {
  await db.read();
  const { nanoid } = require('nanoid');
  const lead = {
    id: nanoid(),
    first_name: req.body.first_name || '',
    last_name: req.body.last_name || '',
    email: req.body.email || '',
    phone: req.body.phone || '',
    company: req.body.company || '',
    city: req.body.city || '',
    state: req.body.state || '',
    source: req.body.source || 'other',
    status: req.body.status || 'new',
    score: Number(req.body.score)||0,
    lead_value: Number(req.body.lead_value)||0,
    last_activity_at: req.body.last_activity_at || null,
    is_qualified: Boolean(req.body.is_qualified)||false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.data.leads.unshift(lead);
  await db.write();
  res.status(201).json(lead);
});

function applyFilters(list, q){
  let res = list;
  if(q.email) res = res.filter(l => l.email === q.email);
  if(q.email_contains) res = res.filter(l => l.email.includes(q.email_contains));
  if(q.company) res = res.filter(l => l.company === q.company);
  if(q.company_contains) res = res.filter(l => l.company.includes(q.company_contains));
  if(q.city) res = res.filter(l => l.city === q.city);
  if(q.city_contains) res = res.filter(l => l.city.includes(q.city_contains));
  if(q.status) res = res.filter(l => q.status.split(',').includes(l.status));
  if(q.source) res = res.filter(l => q.source.split(',').includes(l.source));
  if(q.score_eq) res = res.filter(l => l.score === Number(q.score_eq));
  if(q.score_gt) res = res.filter(l => l.score > Number(q.score_gt));
  if(q.score_lt) res = res.filter(l => l.score < Number(q.score_lt));
  if(q.lead_value_gt) res = res.filter(l => l.lead_value > Number(q.lead_value_gt));
  if(q.lead_value_lt) res = res.filter(l => l.lead_value < Number(q.lead_value_lt));
  if(q.is_qualified) res = res.filter(l => String(l.is_qualified) === String(q.is_qualified));
  if(q.created_after) res = res.filter(l => new Date(l.created_at) >= new Date(q.created_after));
  if(q.created_before) res = res.filter(l => new Date(l.created_at) <= new Date(q.created_before));
  return res;
}

router.get('/', authMiddleware, async (req, res) => {
  await db.read();
  let list = db.data.leads.slice();
  list = applyFilters(list, req.query);
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20')));
  const total = list.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);
  res.json({ data, page, limit, total, totalPages });
});

router.get('/:id', authMiddleware, async (req, res) => {
  await db.read();
  const lead = db.data.leads.find(l => l.id === req.params.id);
  if(!lead) return res.status(404).json({ error: 'Not found' });
  res.json(lead);
});

router.put('/:id', authMiddleware, async (req, res) => {
  await db.read();
  const idx = db.data.leads.findIndex(l => l.id === req.params.id);
  if(idx === -1) return res.status(404).json({ error: 'Not found' });
  db.data.leads[idx] = { ...db.data.leads[idx], ...req.body, updated_at: new Date().toISOString() };
  await db.write();
  res.json(db.data.leads[idx]);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await db.read();
  const idx = db.data.leads.findIndex(l => l.id === req.params.id);
  if(idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = db.data.leads.splice(idx,1)[0];
  await db.write();
  res.json({ message: 'deleted', id: removed.id });
});

module.exports = router;
