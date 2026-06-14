# 📱 PANDUAN LENGKAP — KONAMI LOGIN (Bisa Diakses Orang Lain)

---

## 🗂️ ISI FILE INI

```
konami-final/
├── public/
│   ├── config.js        ← ⭐ ISI URL RAILWAY DI SINI
│   ├── index.html       ← Halaman Login
│   ├── register.html    ← Halaman Daftar Akun
│   └── dashboard.html   ← Halaman setelah login
├── server.js            ← Backend (dijalankan di Railway)
├── package.json
└── PANDUAN.md           ← File ini
```

---

## STEP 1 — Buat Akun GitHub

1. Buka **github.com** di HP/laptop
2. Klik **Sign up** → isi email, password, username
3. Verifikasi email kamu
4. Login ke GitHub

---

## STEP 2 — Upload Project ke GitHub

1. Klik tombol **"+"** di pojok kanan atas → **"New repository"**
2. Nama repository: `konami-login`
3. Pilih **Public**
4. Klik **"Create repository"**
5. Di halaman repository, klik **"uploading an existing file"**
6. Upload semua file (drag & drop):
   - `server.js`
   - `package.json`
   - folder `public/` dengan semua isinya
7. Klik **"Commit changes"**

---

## STEP 3 — Deploy Backend ke Railway

1. Buka **railway.app** di browser
2. Klik **"Start a New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Login dengan akun GitHub kamu
5. Pilih repository **konami-login**
6. Railway otomatis mendeteksi Node.js dan menjalankan server
7. Tunggu sampai status **"Active"** (biasanya 1-2 menit)
8. Klik menu **"Settings"** → **"Networking"** → **"Generate Domain"**
9. Kamu dapat URL seperti:
   ```
   https://konami-login-production-xxxx.railway.app
   ```
   **Simpan URL ini!**

---

## STEP 4 — Isi URL Railway di config.js

Buka file `public/config.js` dan ubah:

```js
// SEBELUM:
API_URL: "ISI_URL_RAILWAY_KAMU_DI_SINI"

// SESUDAH (contoh):
API_URL: "https://konami-login-production-xxxx.railway.app"
```

Simpan file, lalu upload ulang `config.js` ke GitHub
(buka file di GitHub → klik ikon pensil → edit → commit).

---

## STEP 5 — Upload Frontend ke Netlify

1. Buka **netlify.com**
2. Daftar gratis (bisa pakai Google)
3. Klik **"Add new site"** → **"Deploy manually"**
4. Drag & drop folder **`public/`** ke area upload
5. Tunggu sebentar → kamu dapat URL seperti:
   ```
   https://amazing-konami-123.netlify.app
   ```

---

## STEP 6 — Bagikan ke Orang Lain! 🎉

Kirim link Netlify ke teman:
```
https://amazing-konami-123.netlify.app
```

Mereka bisa:
✅ Buka di HP atau laptop
✅ Daftar akun baru
✅ Login
✅ Lihat dashboard

---

## 🧪 Cek Server Berjalan

Buka URL ini di browser (ganti dengan URL Railway kamu):
```
https://konami-login-production-xxxx.railway.app/api/health
```

Kalau muncul `{"status":"ok"}` → server berjalan normal ✅

---

## ❓ FAQ

**Q: Gratis tidak?**
A: Ya, 100% gratis. GitHub, Railway, dan Netlify semua gratis.

**Q: Apakah data aman?**
A: Untuk belajar iya, tapi untuk produksi serius perlu database yang lebih kuat.

**Q: Bisa dari HP saja?**
A: Bisa! Semua langkah di atas bisa dilakukan dari browser HP.

**Q: Railway berhenti otomatis?**
A: Railway gratis memberikan 500 jam/bulan. Cukup untuk penggunaan normal.
