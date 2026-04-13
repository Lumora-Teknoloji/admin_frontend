# 33 - Kalıp + Numune + Teknik Föy Modülü

> Kaynak: ChatGPT istişaresi — Üretim sisteminin en kritik modülü
> Amaç: Tasarım çıktısını üretilebilir ürüne dönüştürmek

---

## MODÜL AKIŞI

```
Tasarım → Kalıp → Numune → Numune Testi → Teknik Föy → Kesim → Üretim
```

---

## MODÜL YAPISI

| # | Ana Sekme | Alt Sekme Sayısı |
|---|---|---|
| 1 | Kalıp Oluşturma | 4 |
| 2 | Kalıp Parça Yapısı | 4 |
| 3 | Beden Serisi (Grading) | 3 |
| 4 | Kumaş Tüketim Hesabı | 3 |
| 5 | Marker Planlama | 3 |
| 6 | Numune Üretimi | 3 |
| 7 | Numune Test Analizi | 3 |
| 8 | Numune Revizyon Sistemi | 3 |
| 9 | Teknik Föy (Tech Pack) | 5 |
| 10 | Üretim Fizibilite | 3 |
| 11 | Kalite Standartları | 3 |
| 12 | Üretim Talimatı | 3 |
| 13 | Teknik Föy Medya Arşivi | 3 |
| **Toplam** | **13 ana sekme** | **43 alt sekme** |

---

## 1. KALIP OLUŞTURMA

Alt Sekmeler: kalıp bilgisi, kalıp dosyası, kalıp ölçü sistemi, kalıp sorumlusu

Sorular: kalıp adı, kodu, versiyonu, sorumlusu, oluşturma tarihi, kalıp yazılımı (CLO/Gerber/Optitex)

## 2. KALIP PARÇA YAPISI

Alt Sekmeler: parça listesi, parça ölçüleri, parça ilişkileri, parça görselleri

Sorular: ürün kaç parçadan oluşuyor, parça isimleri/ölçüleri, birleşme sırası, parça tipi (ana/yardımcı)

## 3. BEDEN SERİSİ (GRADING)

Alt Sekmeler: ana beden, beden aralığı, ölçü toleransı

Sorular: ana beden, beden aralığı, ölçü büyüme oranı, ölçü toleransı

## 4. KUMAŞ TÜKETİM HESABI

Alt Sekmeler: kumaş tüketimi, aksesuar tüketimi, fire oranı

Sorular: kumaş tüketimi (metre), aksesuar tüketimi, tahmini fire oranı, kumaş yerleşim planı

## 5. MARKER PLANLAMA (KESİM HAZIRLIK)

Alt Sekmeler: marker planı, kumaş eni, yerleşim planı

Sorular: kumaş eni, marker uzunluğu, marker verim oranı, parça yerleşimi

## 6. NUMUNE ÜRETİMİ

Alt Sekmeler: numune üretim planı, numune sorumlusu, numune tarihi

Sorular: üretim tarihi, sorumlusu, süre, maliyet

## 7. NUMUNE TEST ANALİZİ

Alt Sekmeler: numune kalite, numune hata, numune iyileştirme

Sorular: numune sonucu, hata listesi, iyileştirme önerileri, onay durumu

## 8. NUMUNE REVİZYON SİSTEMİ

Alt Sekmeler: revizyon listesi, revizyon nedeni, revizyon tarihi

Sorular: revizyon nedeni, tarihi, sorumlusu, açıklaması

## 9. TEKNİK FÖY (TECH PACK)

Alt Sekmeler: işlem listesi, işlem sırası, makine türü, işlem zorluk puanı, işlem videosu

Sorular: toplam işlem sayısı, işlem sırası, işlem makinesi, zorluk puanı, işlem süresi

## 10. ÜRETİM FİZİBİLİTE ANALİZİ

Alt Sekmeler: üretim süresi, üretim maliyeti, üretim kapasitesi

Sorular: toplam üretim süresi, tahmini maliyet, bant kapasitesi, işçilik süresi

## 11. KALİTE STANDARTLARI

Alt Sekmeler: kalite kriterleri, kontrol noktaları, hata toleransı

Sorular: dikiş toleransı, ölçü toleransı, görsel kalite kriterleri, paketleme standardı

## 12. ÜRETİM TALİMATI

Alt Sekmeler: iş akışı, operasyon sırası, makine listesi

Sorular: işlem sırası, kullanılacak makine, operatör beceri seviyesi, operasyon süresi

## 13. TEKNİK FÖY MEDYA ARŞİVİ

Alt Sekmeler: işlem fotoğrafları, işlem videoları, referans görseller

Sorular: işlem fotoğrafı var mı, işlem videosu var mı, referans görsel var mı

---

## MODÜL ÇIKTISI

1. Kalıp dosyası
2. Beden serisi
3. Marker planı
4. Numune onayı
5. Teknik föy (Tech Pack)
6. Üretim talimatı

---

## VERİTABANI TABLOLARI

patterns, pattern_parts, pattern_sizes, pattern_consumption, markers, samples, sample_tests, sample_revisions, techpacks, operations, operation_media, production_feasibility, quality_standards

---

## TEKNOLOJİ ALTYAPISI

- CAD kalıp yazılımı (Gerber / Optitex / CLO)
- Veritabanı (PostgreSQL / Supabase)
- Medya depolama (S3 uyumlu storage)
- Video arşiv sistemi
- İş akışı motoru
- Analiz sistemi

---

## KRİTİK KURAL

> **Bu modül yanlış kurulursa tüm üretim sistemi çöker.**
> Çünkü ücret sistemi, üretim planı ve işlem sırası buradan çıkar.
