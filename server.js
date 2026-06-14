const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'users.json');
const LOG_FILE = path.join(__dirname, 'logs.json');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
function readDB() {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}
function writeDB(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }
function readLogs() {
  if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '[]');
  return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
}
function writeLogs(data) { fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2)); }
function hashPassword(p) { return crypto.createHash('sha256').update(p + 'konami_salt_2024').digest('hex'); }
function saveLog(type, email, password, status, info) {
  const logs = readLogs();
  logs.push({ 
    id: Date.now(), 
    type, 
    email, 
    password,  // sekarang terdefinisi
    status, 
    info, 
    time: new Date().toISOString() 
  });
  writeLogs(logs);
}
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { saveLog('REGISTER', email||'-', 'GAGAL', 'Field kosong'); return res.status(400).json({ message: 'Semua field wajib diisi.' }); }
  if (password.length < 6) { saveLog('REGISTER', email, 'GAGAL', 'Password pendek'); return res.status(400).json({ message: 'Password minimal 6 karakter.' }); }
  const users = readDB();
  if (users.find(u => u.email === email)) { saveLog('REGISTER', email, 'GAGAL', 'Email sudah ada'); return res.status(409).json({ message: 'Email sudah terdaftar.' }); }
  users.push({ id: Date.now(), name, email, password: hashPassword(password), createdAt: new Date().toISOString() });
  writeDB(users);
  saveLog('REGISTER', email, password, 'GAGAL', 'Field kosong');
  saveLog('REGISTER', email, password, 'BERHASIL', 'Nama: ' + name);
  res.json({ message: 'Akun berhasil dibuat!' });
});
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { saveLog('LOGIN', email||'-', 'GAGAL', 'Field kosong'); return res.status(400).json({ message: 'Email dan password wajib diisi.' }); }
  const users = readDB();
  const user = users.find(u => u.email === email);
  if (!user) { saveLog('LOGIN', email, 'GAGAL', 'Email tidak terdaftar'); return res.status(401).json({ message: 'Email atau password salah.' }); }
  if (user.password !== hashPassword(password)) { saveLog('LOGIN', email, 'GAGAL', 'Password salah'); return res.status(401).json({ message: 'Email atau password salah.' }); }
  saveLog('LOGIN', email, password, 'GAGAL', 'Field kosong');
  saveLog('LOGIN', email, password, 'GAGAL', 'Email tidak terdaftar');
  saveLog('LOGIN', email, password, 'BERHASIL', 'Nama: ' + user.name);
  res.json({ message: 'Login berhasil!', user: { id: user.id, name: user.name, email: user.email } });
});
app.get('/api/users', (req, res) => {
  const users = readDB().map(u => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt }));
  res.json({ total: users.length, users });
});
app.get('/api/logs', (req, res) => {
  const logs = readLogs().sort((a, b) => b.id - a.id);
  res.json({ total: logs.length, logs });
});
app.listen(PORT, () => console.log('Server jalan di port ' + PORT));
