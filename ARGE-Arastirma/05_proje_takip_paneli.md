# 05 - Proje Takip Paneli — Kesinleşmiş Plan

---

## 1. AMAÇ (Kullanıcının Sözleri)

> Sürekli bilgisayar başında kalmak istemiyorum. Bir proje yöneticisi paneli yapacağım. Görevleri yazacağım, sistem yapacak, kontrol edecek, Telegram'la bana bildirecek. Dışarıdan da görev verebileceğim.

> Yarım değil, tam, net. Sahte sistem yok. Yapılan her işlem kanıtlı olacak.

---

## 2. SİSTEM SEÇİMİ (Kesinleşmiş)

**Karar: C — Tam Bağımsız Sistem (Self-Hosted)**

| Seçenek | Artı | Eksi | Karar |
|---|---|---|---|
| A) Antigravity'ye bağlı | Hazır, hızlı | Süre limiti, kanıt yok, kontrol kısıtlı | ❌ |
| B) Hibrit | Hızlı başlangıç | Yine limit bağımlılığı | ❌ |
| **C) Tam bağımsız** | **Sınırsız, tam kontrol, kanıt sistemi** | Kurulum süresi | ✅ |

**Gerekçe:** Antigravity/Clio süre limitli. Kanıt zorunluluğu yok. "Yaptım" diyebiliyor, doğrulama yok. Bağımsız sistem bu sorunların tamamını çözer.

---

## 3. PANELİN TANIMI

> Sadece arayüz değil:
> **KOMUTA MERKEZİ + DENETİM MERKEZİ + KAYIT MERKEZİ**

---

## 4. DEĞİŞTİRİLEMEZ KURALLAR

1. **Dosya bazlı görev** — Görev = dosya, çıktı = dosya
2. **Kanıt zorunlu** — Kanıt yoksa tamamlanmadı sayılır
3. **"Yaptım" demek yeterli değil** — Hash + log + çıktı dosyası şart
4. **MD/geçmiş yasak** — Sadece gerçek dosya okunur, MD referans olamaz
5. **Validator bağımsız** — Agent'tan ayrı çalışır
6. **Kurallar AI'ya değil, AI'nın geçmek zorunda olduğu kapıya yazılır**

---

## 5. GÖREV YAPISI (14 Alan — Kesinleşmiş)

| # | Alan | Ne Veri Üretir |
|---|---|---|
| 1 | **ID** | Benzersiz görev kimliği |
| 2 | **Öncelik** | P0/P1/P2 — Hangi iş önce |
| 3 | **Amaç (goal)** | Nihai hedef |
| 4 | **Neden (reason)** | Neden yapılıyor |
| 5 | **Kapsam** | Ne dahil / ne hariç |
| 6 | **Girdi** | Giriş dosyaları + parametreler |
| 7 | **İşlem (type)** | code / exec / analysis / monitor |
| 8 | **Çıktı** | Beklenen dosyalar + testler |
| 9 | **Kısıtlar** | Süre, teknik limitler |
| 10 | **Test kriteri** | Ölçülebilir başarı kuralları |
| 11 | **Risk** | Bu görev neyi bozabilir |
| 12 | **Onay noktası** | Nerede durup kontrol edilecek |
| 13 | **Sorumlu** | Kim yapacak, kim kontrol edecek |
| 14 | **Durum** | pending → running → validation → done / rejected |

---

## 6. 3 KATMANLI DOĞRULAMA (DONE Tanımı)

Bir görev **DONE** sayılır **sadece** 3 katman birden geçerse:

```
Katman 1: EXECUTION    → Kod çalıştı mı? Dosya üretildi mi?
Katman 2: TEKNİK       → Test geçti mi? Hata var mı?
Katman 3: MİSYON       → Hedef karşılandı mı? Amaç gerçekleşti mi? Neden çözüldü mü?

Hepsi EVET → DONE
1 tanesi HAYIR → RED
```

---

## 7. ONAY SİSTEMİ

| Mod | Davranış |
|---|---|
| **auto** | Confidence ≥ %85 + testler geçti → otomatik onay |
| **manual** | Panelde "Onay Bekliyor" + Telegram bildirim |
| **hybrid** | Kritik iş → manual, basit iş → auto |

**Varsayılan:** hybrid

---

## 8. SİSTEM MİMARİSİ (Çekirdek Bileşenler)

```
[Desktop Panel / Telegram]
        ↓
[Backend Core (API)]
        ↓
[Task Engine — görev dosya okuma/yazma]
        ↓
[Agent — plan çıkar + karar ver]
        ↓
[Worker — gerçek işi çalıştır]
        ↓
[Validator — 3 katmanlı doğrulama]
        ↓
[DB + Log]
        ↓
[Telegram Bildirim]
```

---

## 9. KANIT SİSTEMİ (Zorunlu)

Her tamamlanan görev için:
- Oluşturulan dosyalar
- Dosya hash'leri (SHA256)
- İşlem logu (komut + çıktı)
- Çalıştırılan komut çıktısı
- Mission doğrulama sonucu

---

## 10. ÇALIŞMA AKIŞI

```
Sen (görev.json verir)
  ↓
Panel/Telegram → Backend
  ↓
Task Engine → görevi parse et
  ↓
Agent → plan çıkar
  ↓
Worker → çalıştır (kod/komut/dosya)
  ↓
Validator → 3 katman kontrol
  ↓
Rapor.json üret (kanıtlı)
  ↓
Telegram → sana bildir
```

---

## 11. MALİYET STRATEJİSİ

| Bileşen | Seçim | Maliyet |
|---|---|---|
| Sunucu | Kendi PC | 0 |
| DB | SQLite / PostgreSQL local | 0 |
| AI | Ollama (lokal model) | 0 |
| Bot | Telegram | 0 |
| Panel | Electron / Web | 0 |

---

## 12. DOĞRU SIRA

1. ✅ İstişare + yol belirleme (bu dosya)
2. ⬜ Sistem mimarisi detaylandırma
3. ⬜ Çekirdek kurulum (backend + agent + validator)
4. ⬜ Panel (kontrol arayüzü)
5. ⬜ Telegram entegrasyonu
6. ⬜ Test + doğrulama

---

## 13. PANEL SAYFALARI

1. Dashboard — genel durum
2. Task List — görev listesi + filtre
3. Task Detail — tekil görev + log + kanıt
4. Validation — doğrulama ekranı
5. Logs — adım adım kayıt
6. Reports — raporlar

---

## 14. KRİTİK KURALLAR (Kullanıcının Sözleri)

> "Yaptım diyorsun, kontrol ediyorum, yapmamışsın. Çok büyük zaman ve emek hırsızlığı."

> "Güvene dayalı değil. Herkes görevini icra ettiği şekilde raporlu, kanıtlı."

> "Yapılan her işlem en üst seviyede yetkilendirilmiş olacak. Özet değil, gerçek sistem yapacağız."

> "Kurallar AI'ya değil, AI'nın geçmek zorunda olduğu kapıya yazılır."
