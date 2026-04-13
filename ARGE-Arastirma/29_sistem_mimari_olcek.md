# 29 - Sistem Mimari Ölçek Analizi

> Kaynak: ChatGPT istişaresi — Sistemde kaç sayfa, buton, API, DB tablosu olması gerektiği

---

## GENEL MİMARİ ÖLÇEK

| Kategori | Gerekli Ortalama | Açıklama |
|---|---|---|
| Toplam Modül / Sayfa | 17–22 | Departman bazlı sayfa yapısı |
| Alt Sayfa / Sekme | 60–90 | Her modül içinde işlem sekmeleri |
| Toplam İşlem Butonu | 450–650 | Ekle / Sil / Düzenle / Filtre / Export |
| API Endpoint | 120–180 | CRUD + servis API |
| Veritabanı Tablosu | 45–70 | Ana tablolar + log + audit |
| Realtime Kanal | 8–15 | Kasa, üretim, stok gibi canlı veri |
| Arka Plan Servisi | 10–20 | Agent, cron, analiz görevleri |
| AI Servisi | 3–6 | Vision, analiz, speech |

---

## MODÜL BAZLI DAĞILIM

| Modül | Sayfa | Buton | API | DB Tablo |
|---|---|---|---|---|
| Karargah | 3 | 30 | 10 | 4 |
| Ar-Ge | 4 | 40 | 12 | 5 |
| Kumaş | 4 | 35 | 10 | 4 |
| Modelhane | 5 | 45 | 14 | 6 |
| Kalıp | 3 | 30 | 9 | 4 |
| Kesim | 4 | 35 | 11 | 4 |
| İmalat | 4 | 38 | 12 | 4 |
| Stok / Depo | 4 | 35 | 11 | 4 |
| Kasa | 3 | 40 | 12 | 4 |
| Muhasebe | 3 | 30 | 10 | 4 |
| Personel | 4 | 42 | 13 | 5 |
| Katalog | 3 | 35 | 10 | 4 |
| Müşteriler | 3 | 30 | 9 | 4 |
| Sipariş | 4 | 40 | 12 | 5 |
| Denetmen | 2 | 25 | 8 | 3 |
| Agent Sistemi | 2 | 20 | 8 | 3 |
| Raporlar | 3 | 28 | 9 | 3 |
| Ayarlar | 2 | 18 | 7 | 3 |

---

## TOPLAM MİMARİ

| Ölçüm | Değer |
|---|---|
| **Toplam Modül** | 18 |
| **Toplam Sayfa** | 61 |
| **Toplam Buton** | ~596 |
| **Toplam API** | ~177 |
| **Toplam DB Tablosu** | ~69 |

---

## VERİTABANI TABLO YAPISI

### Ana İş Tabloları
kullanicilar, roller, personel, musteriler, siparisler, siparis_urunleri, urunler, stoklar, kumaslar, model_kaliplari, uretim_isleri, fasonlar, sevkiyatlar, kasa_hareketleri, maliyetler

### Sistem Tabloları
b0_sistem_loglari, b0_hata_loglari, b0_islem_gecmisi, b0_performans_metrikleri, b0_retry_queue, b0_offline_queue

### AI / Agent Tabloları
ai_analizler, agent_gorevleri, agent_loglari

---

## FİNANSAL ALTYAPI

| Teknoloji | Aylık Ortalama |
|---|---|
| Supabase | 25–150 $ |
| Vercel | 20–100 $ |
| Cloudflare | 0–20 $ |
| AI servisleri | 10–200 $ |
| **Toplam** | **55–470 $/ay** |

---

## TEKNOLOJİ ALTERNATİFLERİ

| Sistem | Artı | Eksi |
|---|---|---|
| Supabase | Hızlı geliştirme | Vendor bağımlılığı |
| Firebase | Stabil | Maliyet artabilir |
| Self-host PostgreSQL | Ucuz | Yönetim zor |

---

## SİSTEMİN İŞLETMEYE FAYDASI

| Alan | Kazanç |
|---|---|
| Üretim kontrolü | +%30 verim |
| Hata azaltma | −%40 |
| Stok kontrolü | +%60 doğruluk |
| Finans kontrolü | +%50 şeffaflık |
| Operasyon hızı | +%35 |
