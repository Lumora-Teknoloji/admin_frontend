# 15 - AR-GE Ajan Mimarisi (12 Ajan — Optimum)

---

## SİSTEM KATMANLARI

```
Katman 1: VERİ TOPLAMA (4 ajan)
Katman 2: ÜRÜN TANIMA (3 ajan)
Katman 3: ANALİZ (3 ajan)
Katman 4: RİSK + KARAR (2 ajan)
```

---

## A. VERİ TOPLAMA DAİRESİ (4 Ajan)

### Ajan 1 — Sosyal Trend Tarayıcı
- **Kaynak:** TikTok, Instagram, Pinterest
- **Çıktı:** Viral ürün, hashtag büyüme oranı, influencer kullanımı
- **Sınır:** Sadece gözlem — veri çekmez, analiz sonucu kaydeder

### Ajan 2 — E-Ticaret Pazar Tarayıcı
- **Kaynak:** Trendyol, Amazon, Zara, Shein
- **Çıktı:** Fiyat, yorum sayısı, satış sinyali, ürün tipi
- **Sınır:** Kamuya açık veri gözlemi

### Ajan 3 — Rakip Koleksiyon İzleyici
- **Görev:** Rakip markaların yeni ürünlerini izleme, koleksiyon değişim tespiti
- **Sınır:** Yorum yapmaz, sadece veri kaydeder

### Ajan 4 — Görsel Analiz Ajanı
- **Görev:** Siluet, model kesimi, dikiş tipi, kumaş dökümü analizi
- **Teknoloji:** CLIP / YOLO

---

## B. ÜRÜN TANIMA DAİRESİ (3 Ajan)

### Ajan 5 — Ürün Kimliği Tanımlayıcı
- **Çıktı:** Kategori, ürün tipi, stil, kullanım alanı

### Ajan 6 — Kumaş Analiz Ajanı
- **Çıktı:** Kumaş türü, gramaj, elastan oranı, üretim uygunluğu

### Ajan 7 — Stil & Renk Analiz
- **Çıktı:** Renk trendi, desen, sezon uyumu

---

## C. ANALİZ DAİRESİ (3 Ajan)

### Ajan 8 — Trend Skor Motoru
- **Formül:** Bkz. `14_trend_algoritma_formul.md`
- **Çıktı:** TrendScore (0–100)

### Ajan 9 — Talep Tahmin Motoru
- **Hesap:** TrendScore × Pazar × Fiyat
- **Çıktı:** Tahmini satış potansiyeli

### Ajan 10 — Maliyet Tahmin Motoru
- **Hesap:** Kumaş + işçilik + üretim süresi
- **Çıktı:** Birim maliyet, kâr marjı

---

## D. RİSK + KARAR DAİRESİ (2 Ajan)

### Ajan 11 — Risk Analiz Motoru
- **Analiz:** Üretim riski, tedarik riski, trend ömrü, stok riski
- **Çıktı:** RiskScore

### Ajan 12 — Strateji Motoru (Baş Stratejist)
- **Görev:** Tüm verileri birleştir, FırsatScore hesapla
- **Çıktı:** ÜRET / TEST / BEKLE / RED
- **Kural:** AI önerir → insan onaylar (AI tek başına karar vermez)

---

## AJAN ÇALIŞMA KURALLARI

1. Her ajan **sadece kendi görevini** yapar
2. Kendi görev alanı dışında **yorum yapmaz**
3. **Log zorunlu** — log yoksa işlem yok sayılır
4. **Test geçmeden** çıktı kabul edilmez
5. Ajanlar **birbirine veri üzerinden** konuşur (direkt iletişim yok)

---

## BOT vs AGENT AYRIMI

| Tip | Görev | Karar verir mi? |
|---|---|---|
| **Bot** | Veri alma, temizleme, pipeline | Hayır (deterministik) |
| **Agent** | Trend analiz, yorum analiz, risk, karar önerisi | Evet (AI tabanlı) |
