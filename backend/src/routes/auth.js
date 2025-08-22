const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const TOKEN_NAME = 'token';

router.post('/register', async (req, res) => {
  await db.read();
  const { email, password, firstName, lastName } = req.body;
  if(db.data.users.find(u=>u.email===email)) return res.status(400).json({ error: 'Email exists' });
  const hashed = await bcrypt.hash(password, 10);
  const { nanoid } = require('nanoid');
  const user = { id: nanoid(), email, password: hashed, firstName, lastName };
  db.data.users.push(user);
  await db.write();
  res.status(201).json({ id: user.id, email: user.email });
});

router.post('/login', async (req, res) => {
  await db.read();
  const { email, password } = req.body;
  const user = db.data.users.find(u=>u.email===email);
  if(!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.cookie(TOKEN_NAME, token, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'ok' });
});

router.post('/logout', (req, res) => {
  res.clearCookie(TOKEN_NAME);
  res.json({ message: 'logged out' });
});

router.get('/me', async (req, res) => {
  const token = req.cookies[TOKEN_NAME];
  if(!token) return res.status(401).json({ error: 'Unauthorized' });
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    await db.read();
    const user = db.data.users.find(u=>u.id===payload.id);
    if(!user) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
  }catch(e){
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;
