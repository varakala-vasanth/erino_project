const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');

const file = path.join(__dirname, '..', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDb(){
  if(!fs.existsSync(file)){
    await db.read();
    db.data = { users: [], leads: [] };
    const bcrypt = require('bcrypt');
    const hashed = bcrypt.hashSync('password', 10);
    db.data.users.push({ id: nanoid(), email: 'test@demo.com', password: hashed, firstName: 'Test', lastName: 'User' });
    const sources = ['website','facebook_ads','google_ads','referral','events','other'];
    const statuses = ['new','contacted','qualified','lost','won'];
    for(let i=1;i<=120;i++){
      db.data.leads.push({
        id: nanoid(),
        first_name: 'Lead'+i,
        last_name: 'Demo',
        email: `lead${i}@example.com`,
        phone: '999999' + (1000 + i),
        company: 'Example Co',
        city: ['Hyderabad','Bangalore','Mumbai','Delhi'][i%4],
        state: 'State',
        source: sources[i%6],
        status: statuses[i%5],
        score: Math.floor(Math.random()*101),
        lead_value: Math.round(Math.random()*10000)/100,
        last_activity_at: null,
        is_qualified: false,
        created_at: new Date(Date.now() - Math.floor(Math.random()*10000000000)).toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    await db.write();
    console.log('DB initialized with seed data.');
  } else {
    await db.read();
  }
}

module.exports = { db, initDb };
