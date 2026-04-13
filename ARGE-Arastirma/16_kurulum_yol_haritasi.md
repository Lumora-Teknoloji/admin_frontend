# 16 - AR-GE Departmanı Kurulum Yol Haritası

---

## KURULUM PRENSİBİ

```
Önce sistem kurulur → sonra ekip devreye alınır.
Sistem hazır olmadan hiçbir ekip çalışmaz.
Test geçmeden sonraki aşamaya geçilmez.
```

---

## FAZ-0: ALTYAPI (Ekipsiz — Sadece Kurulum)

### A. Veritabanı + Şema (Gün 1–2)
- PostgreSQL 15 kurulumu
- Tablolar: `products, raw_data, cleaned_data, features, predictions, decisions, logs`
- **Test:** CRUD çalışıyor mu?

### B. Log Sistemi (Gün 2)
- structlog + logging
- Her modüle logger bağla
- **Test:** Her işlem kayıtlı mı?

### C. Validation Motoru (Gün 3–4)
- Null check, duplicate check, format check, z-score outlier
- **Test:** Hatalı veri bloklanıyor mu?

### D. Pipeline (Gün 4–5)
- RAW → CLEAN → FEATURES → MODEL → DECISION → OUTPUT
- **Test:** Uçtan uca veri akıyor mu?

### E. Feature Motoru (Gün 6–8)
- 40+ feature (rolling, growth, momentum, velocity, rank)
- **Test:** %100 doluluk

### F. Model Entegrasyonu (Gün 9–11)
- CatBoost + scikit-learn
- **Test:** Backtest doğruluk ≥ %70

### G. Karar Motoru (Gün 12–13)
- Skor → etiket → aksiyon (ÜRET/TEST/BEKLE/RED)
- **Test:** Kural seti tutarlı mı?

### H. Üretim Bağlantısı (Gün 14–16)
- Maliyet/kapasite inputları
- **Test:** Teklif çıktısı oluşuyor mu?

### I. Feedback (Gün 17–18)
- Satış → model güncelle
- **Test:** Hata sonrası ağırlık değişiyor mu?

### J. Uçtan Uca Test (Gün 19–21)
- Senaryo: veri → karar → üretim → satış → feedback
- **Test:** Kopma yok, log tam

### **FAZ-0 BİTİŞ ŞARTI:** 10/10 test geçmeden ekip açılmaz

---

## FAZ-1: EKİP AKTİVASYONU (Dalga Dalga)

### Dalga 1 — Veri (Gün 22–26)
- EKİP 1: Veri Toplama (200+ ürün/gün)
- EKİP 2: Veri Doğrulama (duplicate=0, null<%5)
- EKİP 12: QA kontrol
- **Geçiş şartı:** Veri temiz

### Dalga 2 — Analiz (Gün 27–33)
- EKİP 3: Feature Engineering
- EKİP 4: Trend Modeli
- **Geçiş şartı:** Doğruluk ≥ %70

### Dalga 3 — Öğrenme (Gün 34–36)
- EKİP 5: Feedback loop
- **Geçiş şartı:** Model adapte oluyor

### Dalga 4 — Veri Genişletme (Gün 37–44)
- EKİP 6: Sosyal medya analiz
- EKİP 7: Rekabet analiz
- EKİP 8: Müşteri/yorum analiz
- **Geçiş şartı:** Doğruluk ≥ %75

### Dalga 5 — Üretim (Gün 45–52)
- EKİP 9: Üretim analiz (maliyet sapması <%15)
- EKİP 10: Karar motoru
- **Geçiş şartı:** Yanlış üretim oranı düşüyor

### Dalga 6 — Entegrasyon (Gün 53–60)
- EKİP 11: Trend → Karar → Üretim → Satış akışı
- **Geçiş şartı:** Veri kopması yok

---

## FAZ-2: CANLI TEST (Gün 61–75)

- 50 adet mikro üretim
- 3 gün satış takibi
- **Başarılı:** Büyüt
- **Başarısız:** Durdur

---

## FAZ-3: OPTİMİZASYON (Gün 76+)

- Model ağırlık güncelle
- Veri bankasını büyüt
- Hata oranı düşür
- Günlük hedef: 200–300 ürün analiz

---

## KABUL KRİTERLERİ (GATE)

| Kontrol Noktası | Kriter |
|---|---|
| Veri | null <%5, duplicate=0 |
| Feature | %100 dolu |
| Model | Doğruluk ≥ %70 (backtest) |
| Pipeline | Kesintisiz |
| Log | %100 kapsama |
| Karar | Tutarlılık (aynı veri → aynı sonuç) |

---

## HATA YÖNETİMİ

| Hata Tipi | Aksiyon |
|---|---|
| Veri hatası | Blok |
| Model sapması | Yeniden eğitim |
| Karar hatası | Kural revizyon |
| Üretim sapması | İptal/azalt |
| 20 gün satış yok | Stop-loss |
