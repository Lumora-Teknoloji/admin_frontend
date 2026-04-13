# 21 - 5 Çapraz Analiz Sistemi ve Veri Hiyerarşisi

---

## PLATFORM HİYERARŞİSİ (Veri Güç Sırası)

```
1. Pazar verisi (Trendyol) → GERÇEK (ağırlık en yüksek)
2. Sosyal veri (TikTok/IG) → SİNYAL
3. Yorum verisi → SEBEP (neden alıyor/almıyor)
```

> Satış kararı sadece pazardan çıkar. Sosyal medya erken sinyal verir ama **tek başına karar vermez.**

---

## 5 ÇAPRAZ ANALİZ

### 1. TREND ANALİZİ
- **Soru:** Bugün ne yükseliyor?
- **Kaynak:** TikTok, Instagram, Pinterest
- **Veri:** İzlenme artışı, beğeni artışı, içerik çoğalması
- **Çıktı:** Yükselen ürün listesi

### 2. SATIŞ ANALİZİ
- **Soru:** Gerçekten satıyor mu?
- **Kaynak:** Trendyol
- **Veri:** Yorum artışı, stok erime, fiyat bandı
- **Çıktı:** Satılan ürün listesi

### 3. ZAMAN ANALİZİ
- **Soru:** Devam ediyor mu?
- **Veri:** T-3 gün / T-1 gün / bugün karşılaştırma
- **Çıktı:** Artış mı, düşüş mü, balon mu?

### 4. MODEL ANALİZİ
- **Soru:** Ortak özellik ne?
- **Veri:** Kalıp, renk, form, siluet
- **Çıktı:** Üretilecek modelin özellikleri

### 5. FIRSAT ANALİZİ
- **Soru:** Boşluk nerede?
- **Veri:** Eksik beden, eksik renk, kötü kalite, yüksek fiyat
- **Çıktı:** Giriş noktası

---

## VERİ KALİTESİ SINIFLANDIRMASI

| Sınıf | Açıklama | Kullanım |
|---|---|---|
| **%100 Güvenilir** | Fiyat, stok, yorum sayısı, kargo süresi, kur | Çekirdek karar verisi |
| **Güvenilir + temizleme** | TikTok izlenme, beğeni, hashtag, influencer | Oran + çapraz doğrulama ile kullan |
| **Dolaylı** | Sepet deltası, dark social, bounce rate | Hesap katmanına taşınmalı |
| **Riskli / manipüle edilebilir** | Influencer etkisi, sponsorlu reklam, "çok satan" badge | Tek başına karar vermez |
| **AI bağımlı** | Kumaş kalitesi (görsel), kalıp duruşu, estetik | Final kontrol olarak kullan |

---

## SALDIRGAN STRATEJİ (Fırsat Yakalama)

> Rakibi kopyalama yok. Rakibin açığını vur.

| Fırsat Tipi | Aksiyon |
|---|---|
| Kötü yorum → fırsat | Aynı ürün daha iyi kalitede |
| Eksik renk → üret | Pazardaki boşluğu doldur |
| Pahalı → optimize et | Uygun fiyatlı alternatif |
| Eksik beden → genişlet | Talep var ama ürün yok |

---

## ÇAPRAZ KONTROL TABLOSU

| Platform Sayısı | Sonuç |
|---|---|
| 3 platformda var (TikTok + IG + Trendyol) | ✅ Güçlü sinyal |
| 2 platformda var | ⚠ Dikkatli ol |
| 1 platformda var | ❌ Riskli |

---

## EN GÜÇLÜ SATIN ALMA SİNYALLERİ

| Sinyal | Güç |
|---|---|
| Hızlı favori artışı | 🔥 Çok güçlü |
| Düşük yorum + yüksek ilgi | 🔥 Erken trend |
| Kötü yorum fırsatı | 🔥 Rakip açığı |
| Rakipte eksik varyant | 🔥 Direkt giriş |
| Stok hızlı erime | 🔥 Talep kanıtı |

---

## EKSİK VERİ (İstişarede Tespit Edilen)

| Eksik Veri | Neden Önemli |
|---|---|
| Zaman katmanı (delta) | Trend yönü olmadan karar verilemez |
| Tahmini satış hızı | İzlenme ≠ satış |
| Trend ömrü tahmini | Yanlış zamanda üretim = zarar |
| Trend sebebi | Sebebi bilmezsen yanlış ürün üretirsin |
| Almama sebebi | Rakibin açığı = senin fırsatın |
| Fiyat elastikiyeti | Maksimum kâr noktası |
| Üretim süresi vs trend süresi | Üretim > trend ise RED |
