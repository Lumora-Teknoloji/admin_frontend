# LUMORA Admin Frontend

Lumora Analiz Motoru'nun yönetim paneli. Bot yönetimi, sistem izleme, ürün takibi ve canlı logları tek bir arayüzden kontrol eder.

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Kurun

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_BASE_PATH=/admin
NEXT_PUBLIC_API_URL=
BACKEND_URL=http://127.0.0.1:8000
```

> **Not:** Windows'ta `localhost` IPv6 çözümlemesi sorunu yaşanabilir. `127.0.0.1` kullanmanız önerilir.

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcıda http://localhost:3000/admin adresine gidin.

**Güvenlik:** Authentication işlemi Next.js Middleware üzerinden backend API'ye proxy edilerek HTTP-Only çerezlerle (JWT/Token) güvenli bir şekilde yönetilir.

## 📋 Özellikler

- **Genel Bakış Dashboard** — Toplam ürün, aktif bot, sistem sağlığı, sunucu kaynakları
- **Bot Kontrol** — Scraper botlarını oluştur, başlat, durdur, ayarla
- **Canlı Terminal** — Gerçek zamanlı bot logları ve hata takibi
- **Ürün Yönetimi** — Kazınan ürünlerin listesi ve detayları
- **Sistem Logları** — Hata kayıtları ve geçmiş

## 🏗️ Mimari

```
admin_frontend/
├── src/
│   ├── app/              # Next.js App Router sayfaları
│   │   ├── login/        # Giriş sayfası
│   │   ├── page.tsx      # Dashboard (Genel Bakış)
│   │   ├── bots/         # Bot Kontrol
│   │   ├── products/     # Ürün listesi
│   │   └── logs/         # Sistem logları
│   ├── components/       # React bileşenleri
│   │   ├── BotCard.tsx   # Bot kartı bileşeni
│   │   ├── Sidebar.tsx   # Navigasyon paneli
│   │   └── ...
│   └── lib/
│       └── api.ts        # Backend API client
├── .env.local            # Ortam değişkenleri (oluşturmanız gerekir)
├── next.config.ts        # Next.js + Backend proxy ayarları
└── package.json
```

## 🔌 Backend Proxy

Next.js, `/api/*` isteklerini otomatik olarak backend'e proxy eder:

```
Frontend: /api/scraper/bots/status
   ↓ (Next.js Rewrite)
Backend:  http://127.0.0.1:8000/api/scraper/bots/status
```

`BACKEND_URL` değişkeni ile hedef backend adresini ayarlayabilirsiniz.

## 📚 Teknolojiler

- **Next.js 16** (Turbopack)
- **React 19** + TypeScript
- **Tailwind CSS** — Stil sistemi

## 🆘 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| Dashboard `...` gösteriyor | `BACKEND_URL`'yi `http://127.0.0.1:8000` yapın |
| Port 3000 kullanımda | `npx kill-port 3000` veya farklı port: `npm run dev -- -p 3002` |
| Backend bağlantı hatası | Backend'in çalıştığını kontrol edin: `curl http://127.0.0.1:8000/docs` |
