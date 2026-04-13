# 32 - Tasarım Modülü Mimarisi

> Kaynak: ChatGPT istişaresi — Tasarım modülü kurulum mimarisi
> Amaç: Araştırma modülünden gelen veriyi satılabilir ürüne dönüştürmek ve üretime hazır hale getirmek

---

## MODÜL YAPISI

| # | Ana Sekme | Alt Sekme Sayısı |
|---|---|---|
| 1 | Trend → Model Eşleştirme | 3 |
| 2 | Model Tanımlama | 6 |
| 3 | Model Versiyon Yönetimi | 3 |
| 4 | Parça Yapı Analizi | 4 |
| 5 | Ölçü Tablosu | 3 |
| 6 | Kalıp Sistemi | 3 |
| 7 | Kumaş ve Malzeme Seçimi | 5 |
| 8 | Tüketim Analizi | 3 |
| 9 | Görsel Tasarım | 4 |
| 10 | Numune Planlama | 3 |
| 11 | Numune Test Analizi | 3 |
| 12 | Teknik Föy Hazırlık | 5 |
| 13 | Üretim Fizibilite Analizi | 3 |
| 14 | Tasarım Onay Süreci | 3 |
| 15 | Tasarım Arşivi | 3 |
| **Toplam** | **15 ana sekme** | **54 alt sekme** |

---

## 1. TREND → MODEL EŞLEŞTİRME

Alt Sekmeler: trend seçimi, referans model, hedef müşteri

Sorular: trend kaynağı, referans model, model kategorisi, hedef müşteri, sezon

## 2. MODEL TANIMLAMA

Alt Sekmeler: model bilgisi, ürün kategorisi, stil, sezon, hedef pazar, fiyat segmenti

Sorular: model adı, model kodu, ürün kategorisi, stil türü, sezon, hedef müşteri, hedef satış fiyatı, tahmini üretim maliyeti

## 3. MODEL VERSİYON YÖNETİMİ

Alt Sekmeler: versiyon numarası, versiyon geçmişi, değişiklik nedeni

Sorular: model versiyon numarası, değişiklik tarihi, değişiklik açıklaması, önceki versiyon

## 4. PARÇA YAPI ANALİZİ

Alt Sekmeler: parça listesi, parça sayısı, parça ilişkisi, parça görselleri

Sorular: ürün kaç parçadan oluşuyor, parça isimleri, parça birleşme sırası, parça türü

## 5. ÖLÇÜ TABLOSU

Alt Sekmeler: ölçü tablosu, beden serisi, ölçü toleransı

Sorular: ana beden, beden aralığı, ölçü toleransı

## 6. KALIP SİSTEMİ

Alt Sekmeler: kalıp dosyası, kalıp versiyonu, kalıp sorumlusu

Sorular: kalıp türü, kalıp versiyonu, kalıp ölçüsü, kalıp tarihi

## 7. KUMAŞ VE MALZEME SEÇİMİ

Alt Sekmeler: kumaş seçimi, aksesuar seçimi, malzeme listesi, tedarikçi, alternatif malzeme

Sorular: kumaş türü/kodu/gramajı/renk, aksesuar türü/kodu, tedarikçi, alternatif kumaş, alternatif aksesuar

## 8. TÜKETİM ANALİZİ

Alt Sekmeler: kumaş tüketimi, aksesuar tüketimi, fire oranı

Sorular: kumaş tüketim miktarı, aksesuar tüketimi, fire oranı

## 9. GÖRSEL TASARIM

Alt Sekmeler: model çizimi, 3D model, referans foto, teknik not

Sorular: model çizimi var mı, referans foto var mı, 3D model var mı, model açıklaması

## 10. NUMUNE PLANLAMA

Alt Sekmeler: numune planı, numune sorumlusu, numune süresi

Sorular: numune üretim tarihi, numune sorumlusu, numune üretim süresi, numune maliyeti

## 11. NUMUNE TEST ANALİZİ

Alt Sekmeler: numune kalite, numune hata, numune iyileştirme

Sorular: numune sonucu, numune hata listesi, iyileştirme önerileri

## 12. TEKNİK FÖY HAZIRLIK

Alt Sekmeler: işlem listesi, işlem sırası, makine türü, işlem zorluk puanı, işlem videosu

Sorular: toplam işlem sayısı, işlem sırası, işlem makinesi, işlem zorluk puanı, işlem süresi

## 13. ÜRETİM FİZİBİLİTE ANALİZİ

Alt Sekmeler: üretim süresi, üretim maliyeti, üretim kapasitesi

Sorular: toplam üretim süresi, tahmini üretim maliyeti, bant kapasitesi

## 14. TASARIM ONAY SÜRECİ

Alt Sekmeler: tasarım onayı, kesim onayı, üretim onayı

Sorular: tasarım onaylandı mı, kesim onayı verildi mi, üretim onayı verildi mi

## 15. TASARIM ARŞİVİ

Alt Sekmeler: tasarım arşivi, satış performansı, başarı analizi

Sorular: model satış başarısı, model performansı, tasarım notları

---

## VERİTABANI TABLOLARI

models, model_parts, model_materials, model_accessories, model_images, model_versions, model_notes, model_measurements, model_approvals

---

## TEKNOLOJİ ALTYAPISI

- Görsel arşiv sistemi
- 3D modelleme
- AI görsel analiz
- Veritabanı (PostgreSQL / Supabase)
- Arama motoru
- İş akışı motoru
