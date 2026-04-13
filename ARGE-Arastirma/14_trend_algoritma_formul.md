# 14 - Trend Tahmin Algoritması ve Karar Formülü

---

## 1. TREND SKOR FORMÜLÜ (Kesinleşmiş)

```
TrendScore =
  ( SatışBüyümesi    × 0.35 ) +
  ( SosyalBüyüme     × 0.30 ) +
  ( RakipKullanım     × 0.20 ) +
  ( SezonUyumu        × 0.15 )
```

**Skor aralığı:** 0–100

---

## 2. TALEP TAHMİNİ

```
Talep = TrendScore × PazarBüyüklüğü × FiyatUygunluğu
```

---

## 3. RİSK SKORU

```
RiskScore = ÜretimZorluğu + TedarikRiski + TrendÖmrü
```

---

## 4. FIRSAT SKORU (Nihai)

```
FırsatScore = TrendScore + KarMarjı − RiskScore
```

---

## 5. KARAR TABLOSU

| Skor | Karar | Aksiyon |
|---|---|---|
| 85–100 | **ÜRET** | Seri üretim |
| 70–85 | **TEST** | 50 adet test üretim, 3 gün takip |
| 50–70 | **BEKLE** | İzlemeye al |
| 0–50 | **RED** | Üretme |

---

## 6. TREND YAŞI MODELİ

| Trend Tipi | Süre | Risk |
|---|---|---|
| Mikro trend | 1–3 ay | Yüksek (hızlı gir-çık) |
| Orta trend | 6–12 ay | Orta |
| Mega trend | 2–5 yıl | Düşük |

---

## 7. STOP-LOSS KURALI

- 20 gün satış yok → üretim otomatik durdurulur
- Düşük satış → adet azaltılır

---

## 8. TEST ÜRETİM MODELİ (Shein Modeli Uyarlaması)

```
İlk üretim: 50 adet
  ↓
3 gün satış takibi
  ↓
Satış var → seri büyüt
Satış yok → durdur
```

---

## 9. FEEDBACK LOOP (Öğrenen Sistem)

```
Satış sonucu → model ağırlıklarını güncelle
  ↓
Yanlış tahmin → ceza (skor düşür)
Doğru tahmin → ödül (ağırlık artır)
  ↓
Sistem zamanla doğru tahmin oranı artar
```

**Hedef:** 6 ay → sistem oturur, 12 ay → tahmin başlar

---

## 10. BAŞARI KRİTERLERİ

| Metrik | Başlangıç | Hedef (12 ay) |
|---|---|---|
| Ürün başarı oranı | %20 | %65+ |
| Stok riski | %40–50 | %15–20 |
| Koleksiyon doğruluğu | 1x | 2–3x |
