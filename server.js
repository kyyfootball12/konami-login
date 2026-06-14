const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'users.json');

// CORS — agar bisa diakses dari Netlify atau domain lain
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
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'konami_salt_2024').digest('hex');
}

// Cek server hidup
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server berjalan dengan baik!' });
});

// Daftar akun baru
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  if (password.length < 6)
    return res.status(400).json({ message: 'Password minimal 6 karakter.' });

  const users = readDB();
  if (users.find(u => u.email === email))
    return res.status(409).json({ message: 'Email sudah terdaftar.' });

  const newUser = { id: Date.now(), name, email, password: hashPassword(password), createdAt: new Date().toISOString() };
  users.push(newUser);
  writeDB(users);

  console.log(`[REGISTER] ${name} (${email})`);
  res.json({ message: 'Akun berhasil dibuat!' });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });

  const users = readDB();
  const user = users.find(u => u.email === email && u.password === hashPassword(password));
  if (!user)
    return res.status(401).json({ message: 'Email atau password salah.' });

  console.log(`[LOGIN] ${user.name} (${email})`);
  res.json({ message: 'Login berhasil!', user: { id: user.id, name: user.name, email: user.email } });
});

// Lihat semua user (tanpa password)
app.get('/api/users', (req, res) => {
  const users = readDB().map(u => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt }));
  res.json({ total: users.length, users });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
  console.log(`🌐 Buka: http://localhost:${PORT}`);
});
