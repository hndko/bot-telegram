# 🤖 Mari Partner Telegram Bot

Bot Telegram modern berbasis Node.js (ESM) dengan fitur tombol menu interaktif, auto-reply, akses API publik cuaca, dan sistem user level. Cocok untuk pengembangan bot lanjut seperti layanan informasi, admin panel, dan lainnya.

---

## ✨ Fitur Utama

- ✅ `/start` menyapa pengguna & menampilkan menu
- ✅ Tombol menu interaktif dengan `inline_keyboard`
- ✅ Menampilkan data cuaca real-time via [Open Meteo API](https://open-meteo.com/)
- ✅ Info bot & kontak developer
- ✅ Auto reply berdasarkan kata kunci
- ✅ Simpan data user yang pernah start ke database JSON
- ✅ Struktur modular & ESM modern
- ✅ Siap dikembangkan untuk fitur lanjutan (admin panel, broadcast, dll)

---

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/maripartner/telegram-bot.git
cd telegram-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Buat File `config.js`

```js
// config.js
export const TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
export const ADMINS = ["123456789"]; // ID Admin
```

### 4. Jalankan Bot

```bash
npm run dev
```

> Jika belum ada, tambahkan ke `package.json`:

```json
"scripts": {
  "dev": "nodemon bot.js"
}
```

---

## 🔧 Struktur Folder

```
📁 bot-telegram/
├── bot.js                # Entry point utama
├── config.js             # Token & Admin list
├── database.json         # Penyimpanan user lokal
├── features/
│   ├── helper.js         # Simpan user
│   └── keywords.js       # Auto reply text
├── nodemon.json          # Hot reload config
└── README.md             # Dokumentasi ini
```

---

## 📡 API yang Digunakan

- [Open-Meteo](https://open-meteo.com/) untuk cuaca real-time (tanpa API key)

---

## 🤝 Request Fitur & Kontribusi

Punya ide bot lain atau ingin request fitur?

📬 Email: **support@maripartner.com**
🌐 GitHub: [github.com/maripartner](https://github.com/maripartner)

---

## 📜 Lisensi

MIT License © 2025 Mari Partner
