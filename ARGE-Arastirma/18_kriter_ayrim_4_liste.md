# 18 - 138 Kriter Ayrımı (Veri / Hesap / Karar / Sistem Davranışı)

> Kaynak: ChatGPT istişaresi — Tüm kriterler korunmuştur, hiçbiri silinmemiştir.

---

## AYRIM KURALI

```
VERİ      = dışarıdan gelen ham bilgi (ölçülür, toplanır, saklanır)
HESAP     = verilerden türetilen matematik (oran, skor, karşılaştırma)
KARAR     = sistemin verdiği net aksiyon (ÜRET / RED / BEKLE / ALARM)
SİSTEM    = zaman, kontrol, tekrar, güvenlik (nasıl çalıştığı)
```

---

## 1️⃣ VERİ LİSTESİ (Ham Gerçekler — Sistemin Yakıtı)

| # | Veri | Kaynak |
|---|---|---|
| 1 | Saatlik favori ivmesi | Trendyol screenshot |
| 2 | Saatlik görüntülenme | TikTok / Instagram screenshot |
| 3 | Favori / yorum oranı | Trendyol |
| 4 | Sepet deltası | Trendyol (proxy) |
| 5 | Saatlik stok eriyik hızı | Trendyol — zamanlı screenshot farkı |
| 6 | Beden bazlı stok | Trendyol ürün seçenekleri |
| 7 | Kategori sıralama | Trendyol liste |
| 8 | Arama hacmi | Google Trends screenshot |
| 9 | Google Lens hacmi | Google Lens arama sonucu |
| 10 | Bölgesel arama | Google Trends |
| 11 | İkame arama | Google Trends ilgili aramalar |
| 12 | Sosyal → satış geçiş | Çapraz doğrulama |
| 13 | URL paylaşım hızı | TikTok / Instagram |
| 14 | Cüzdan / alım gücü | Pazar segmenti |
| 15 | Kupon kullanımı | Trendyol ürün sayfası |
| 16 | Yorumlar (tüm içerik) | Trendyol yorum alanı screenshot |
| 17 | Soru sayısı | Trendyol soru-cevap |
| 18 | Takipçi sayısı | Instagram / TikTok profil |
| 19 | Pinterest kayıt | Pinterest pin save screenshot |
| 20 | TikTok izlenme | Video screenshot |
| 21 | TikTok yorum | Video yorum alanı |
| 22 | Kaydetme oranı | Instagram save |
| 23 | Bounce rate | Platform analytics (proxy) |
| 24 | Influencer veri | Profil takipçi + paylaşım |
| 25 | Reklam verisi | Meta Ad Library screenshot |
| 26 | Hashtag veri | TikTok / IG hashtag sayfası |
| 27 | Demografi veri | Yorum analizi (dolaylı) |
| 28 | Görsel veri (Vision AI input) | Ürün fotoğrafı |
| 29 | Kumaş yorumları | Trendyol yorumlar |
| 30 | Şikayet verisi | Trendyol 1-2 yıldız |
| 31 | İade verisi | Yorum + iade nedeni |
| 32 | Fiyat verisi (taban/tavan) | Trendyol arama listesi |
| 33 | Stok verisi | Trendyol ürün sayfası |
| 34 | Rekabet verisi | Trendyol satıcı sayısı |
| 35 | Kargo süresi | Trendyol ürün sayfası |
| 36 | Ürün görselleri | Ürün fotoğrafı URL referansı |
| 37 | Ürün açıklamaları | İlk 300 karakter |
| 38 | Trend verisi (Google/Pinterest) | Google Trends + Pinterest |
| 39 | Global veri | Uluslararası pazar gözlemi |
| 40 | Tedarikçi verisi | İç veri — manuel giriş |
| 41 | Maliyet verisi | İç veri — manuel |
| 42 | Üretim kapasite verisi | İç veri — atölye |
| 43 | Kur (döviz) verisi | Canlı kur — API |
| 44 | Depo verisi | İç veri — stok sistemi |

---

## 2️⃣ HESAP LİSTESİ (Türetilen — Yorumlayıcı Katman)

| # | Hesap |
|---|---|
| 1 | Favori / yorum oranı |
| 2 | Yorum / izlenme oranı |
| 3 | Sepet terk oranı (proxy) |
| 4 | Trend ivmesi (24–48 saat delta) |
| 5 | 7 gün artış hızı |
| 6 | Pazar doygunluk hesabı |
| 7 | Arz-talep farkı |
| 8 | Ortalama fiyat |
| 9 | Psikolojik fiyat analizi |
| 10 | Rekabet yoğunluk skoru |
| 11 | Yıldız kalite filtresi |
| 12 | İade oranı hesabı |
| 13 | Risk / getiri oranı |
| 14 | Break-even |
| 15 | Kâr marjı |
| 16 | CAC hesabı |
| 17 | Ölçek ekonomisi |
| 18 | Fire oranı |
| 19 | Kapasite kullanımı |
| 20 | Trend ömür tahmini |
| 21 | Global vs lokal fark |
| 22 | Veri çakışma çözümü |

---

## 3️⃣ KARAR LİSTESİ (Aksiyon — Para Kazandıran Nokta)

| # | Karar |
|---|---|
| 1 | ÜRET |
| 2 | TEST ÜRETİMİ |
| 3 | RED |
| 4 | BEKLE |
| 5 | ALARM |
| 6 | FİYAT DÜŞÜR |
| 7 | RENK EKLE |
| 8 | BEDEN GENİŞLET |
| 9 | KUMAŞ DEĞİŞTİR |
| 10 | PAZARA GİR |
| 11 | PAZARDAN ÇIK |
| 12 | STOK ARTIR |
| 13 | REKLAM AÇ |
| 14 | ÜRÜN İPTAL |
| 15 | NUMUNE ÜRET |

---

## 4️⃣ SİSTEM DAVRANIŞI LİSTESİ (Mekanik — Omurga)

| # | Davranış |
|---|---|
| 1 | 24 saat tekrar kontrol |
| 2 | 7 gün yeniden analiz |
| 3 | 15 gün yeniden analiz |
| 4 | 20 gün ölüm kararı (stop-loss) |
| 5 | Feedback loop (öğrenme) |
| 6 | Ağırlık güncelleme |
| 7 | Veri doğrulama (Zod) |
| 8 | Bot veri birleştirme |
| 9 | Çakışma çözümü |
| 10 | Hiyerarşik veri önceliği |
| 11 | Numune zorunluluğu |
| 12 | Stop-loss mekanizması |
| 13 | Log / geçmiş kayıt |
| 14 | Yeniden değerlendirme |
| 15 | Sahte veri filtreleme |
| 16 | AI son kontrol (vision) |
| 17 | Etik kontrol |
| 18 | Telif kontrol |
| 19 | Kalite blokajı |

---

## KRİTİK NOT

> Bu ayrım yapılmazsa: veri yanlış yorumlanır, hesap yanlış çalışır, karar hatalı çıkar, sistem kilitlenir.
