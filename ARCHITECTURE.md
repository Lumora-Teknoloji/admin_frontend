# ADMIN FRONTEND — Mimari Dokümantasyon

> Bu dosya AI asistanının ve geliştiricilerin frontend yapısını hızlıca anlaması içindir.

## Genel Bakış

Next.js 16 + React 19 + TypeScript + Tailwind CSS yönetim paneli. Bot yönetimi, ürün takibi ve sistem izleme sağlar.

**Toplam:** ~3.500+ satır TypeScript/TSX kodu

## Sayfa Yapısı (App Router)

| Sayfa | Dosya | Satır | Açıklama |
|-------|-------|------:|----------|
| **Dashboard** | `src/app/page.tsx` | 379 | Sistem sağlığı, ürün istatistikleri, veri kalitesi kartları, son kazıma tarihi |
| **Bot Kontrol** | `src/app/bots/page.tsx` | 493 | Bot oluşturma formu, bot kartları listesi, veri kalitesi istatistikleri |
| **Ürünler** | `src/app/products/page.tsx` | 449 | Ürün listesi: arama, marka/seller filtre, sıralama, pagination, fiyat/detay gösterimi |
| **Loglar** | `src/app/logs/page.tsx` | 653 | 3 sekme: Bot Logları (real-time), Detaylı Hatalar, Canlı Ürün Akışı + sistem sağlığı paneli |
| **Giriş** | `src/app/login/page.tsx` | — | JWT login formu |
| **Layout** | `src/app/layout.tsx` | — | Sidebar + main content wrapper |

## Bileşenler

### BotCard (`src/components/BotCard.tsx` — 1002 satır)

En büyük ve en karmaşık bileşen. Her bot için kart arayüzü:

**Durumlar (`bot_state`):**
| State | Görsel | Açıklama |
|-------|--------|----------|
| `scraping` | Yeşil pulse | Aktif kazıma |
| `speed_mode` | Mavi neon | Hız modu aktif |
| `waiting_ip` | Turuncu spin | IP rotasyonu bekleniyor |
| `blocked` | Kırmızı | Bot engellendi |
| `cooldown` | Mavi | Mola veriliyor |
| `queue_empty` | Gri | Kuyruk boş |
| `critical` | Kırmızı kırpma | Kritik hata |
| `error_streak` | Turuncu uyarı | Art arda hatalar |
| `context_refresh` | Mavi döngü | Browser yenileniyor |
| `idle` | Koyu | Beklemede |

**Özellikler:**
- Speed mode countdown timer
- İstatistik animasyonları (scraped, validated, errors, processed)
- Inline ayar düzenleme (keyword, start/end time, page limit)
- Mod bazlı renk temaları (linker: mor, worker: turuncu, normal: mavi)
- Start/Stop/Worker/SpeedMode/Delete aksiyonları

### Sidebar (`src/components/Sidebar.tsx` — 135 satır)

- 4 navigasyon menüsü: Genel Bakış, Ürünler, Sistem Logları, Bot Kontrol
- Lumora logo + branding
- Kullanıcı profil kartı + güvenli çıkış

### StatsCard (`src/components/StatsCard.tsx` — ~50 satır)

İstatistik kartı — ikon, başlık, değer, durum rengi

## API Katmanı

### Request Helper (`src/lib/api.ts`)

```typescript
// Tüm API istekleri bu fonksiyon üzerinden geçer
request<T>(endpoint, options) → Promise<T>
// - NEXT_PUBLIC_API_URL veya NEXT_PUBLIC_BASE_PATH üzerinden URL oluşturur
// - credentials: 'include' (HttpOnly cookie için)
// - Hata durumunda: error.detail parse eder

// Auth API
authApi.login(username, password)
authApi.register(data)
authApi.logout()
authApi.me()
```

### Bot API (`src/services/botApi.ts` — 174 satır)

Tüm scraper endpoint'lerini kapsayan API fonksiyonları:

```typescript
botApi.getAllBots()              // GET /scraper/bots/status → Bot[]
botApi.getLinkerBots()           // GET /scraper/bots/linkers → LinkerBot[]
botApi.startBot(id)              // POST /scraper/bots/{id}/start
botApi.stopBot(id)               // POST /scraper/bots/{id}/stop
botApi.startWorker(id)           // POST /scraper/bots/{id}/worker
botApi.activateSpeedMode(id, m)  // POST /scraper/bots/{id}/speed-mode?minutes=m
botApi.updateSettings(id, s)     // PATCH /scraper/bots/{id}/settings
botApi.deleteBot(id)             // DELETE /scraper/bots/{id}
botApi.createBot(data)           // POST /scraper/tasks
botApi.getLogs(limit, botId)     // GET /scraper/logs?limit=&bot_id=
botApi.getSystemStatus()         // GET /scraper/status
botApi.getSystemHealth()         // GET /scraper/system/health
botApi.getLiveProducts(limit)    // GET /scraper/live-products
botApi.getDataQuality()          // GET /products/quality
botApi.getBackendLogs(limit)     // GET /scraper/logs/backend
botApi.deleteLog(id)             // DELETE /scraper/logs/{id}
botApi.clearErrorLogs()          // DELETE /scraper/logs/errors
botApi.monitorCheck()            // GET /scraper/monitor/check
```

## Tip Tanımları

```typescript
interface Bot {
  id, name, platform, keyword, mode: "linker"|"worker"|"normal"
  status: "running"|"stopped"|"error"|"idle"|"worker_running"
  bot_state?: "scraping"|"waiting_ip"|"blocked"|"cooldown"|"queue_empty"|
              "critical"|"error_streak"|"context_refresh"|"speed_mode"|"idle"
  stats: { scraped, validated, errors, processed }
  start_time, end_time, page_limit, is_active, pending_links
  state_message?, state_countdown?, last_error?, last_product_url?
}

interface DataQuality {
  total_products
  seller_filled, seller_pct
  attributes_filled, attributes_pct
  image_filled, image_pct
  review_summary_filled, review_summary_pct
  sizes_filled, sizes_pct
  avg_rating_filled, avg_rating_pct
  cart_filled, cart_pct
  favorite_filled, favorite_pct
}
```

## Backend Proxy

`next.config.ts` — `/api/*` istekleri backend'e proxy edilir:

```
Frontend isteği:  /bot-admin/api/scraper/bots/status
  ↓ (Next.js Rewrite)
Backend'e gider:  http://backend:8000/api/scraper/bots/status
```

`BACKEND_URL` env değişkeni ile hedef ayarlanır (Docker: `http://backend:8000`, local: `http://127.0.0.1:8000`).

## Polling & Güncelleme

- Dashboard: 30sn aralıkla sistem sağlığı + istatistikler
- Bots: 5sn aralıkla bot durumları
- Logs: 10sn aralıkla loglar + canlı ürünler

## Çalıştırma

```bash
# Docker
docker-compose up -d admin-frontend

# Manuel
npm install
npm run dev  # http://localhost:3000/bot-admin
# Varsayılan giriş: admin / admin123
```
