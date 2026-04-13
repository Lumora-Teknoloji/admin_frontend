# 27 - Sayfa Bazlı İçerik Planı (25 Sayfa)

> Her sayfanın: amacı, ana alanı, alt panelleri, paylaştığı modüller ve olması gereken bilgiler

---

## 1. KARARGÂH (`/karargah`)

| Alan | Detay |
|---|---|
| **Amaç** | Tüm sistemi izleme ve yönetme |
| **Ana alan** | Merkez dashboard — üretim zinciri canlı akış |
| **Kartlar** | Üretim, satış, stok, sipariş, maliyet, personel |
| **Sağ panel** | Trend radar, risk analizi, kritik uyarılar |
| **Paylaşım** | Tüm modüllerle |
| **Detay** | Bkz. `25_karargah_sayfa_duzeni.md` |

---

## 2. AR-GE & TASARIM (`/arge`)

| Alan | Detay |
|---|---|
| **Amaç** | Satılabilir ürün araştırması |
| **Ana alan** | Trend araştırma paneli |
| **Alt pencereler** | Trend listesi, ürün fikirleri, rakip analiz, trend grafikleri |
| **Sağ panel** | Trend puanı, satış ihtimali |
| **Sorular** | Bu ürün nerede satılıyor? Fiyat bandı? Yaş grubu? Sezon? |
| **Paylaşım** | Modelhane, Kumaş, Tasarım |

---

## 3. KUMAŞ ARŞİVİ (`/kumas`)

| Alan | Detay |
|---|---|
| **Amaç** | Tüm kumaş verisi |
| **Ana alan** | Kumaş listesi tablosu |
| **Tablo kolonları** | Kumaş adı, gramaj, içerik, esneklik, stok, fiyat, tedarikçi |
| **Sağ panel** | Kumaş özellikleri, teknik detaylar |
| **Paylaşım** | Modelhane, Kalıp, Maliyet |

---

## 4. MODELHANE (`/modelhane`)

| Alan | Detay |
|---|---|
| **Amaç** | İlk prototip üretim |
| **Ana alan** | Model kartı |
| **Alt pencereler** | Ölçü tablosu, prova kayıtları, revizyon geçmişi |
| **Bilgiler** | Model adı, sezon, kumaş, beden ölçüleri, numune foto/video |
| **Kayıt** | Görsel + sesli kayıt zorunlu |
| **Paylaşım** | Kalıp, İmalat |

---

## 5. KALIP (`/kalip`)

| Alan | Detay |
|---|---|
| **Amaç** | Ürün kalıp sistemi |
| **Ana alan** | Kalıp listesi |
| **Alt pencereler** | Kalıp çizimi, beden serisi, dikiş payı, kesim planı |
| **Dosyalar** | DXF kalıp, ölçü tablosu |
| **Paylaşım** | Kesim, Modelhane |

---

## 6. KESİMHANE (`/kesim`)

| Alan | Detay |
|---|---|
| **Amaç** | Kumaş kesimi |
| **Ana alan** | Kesim planı |
| **Alt pencereler** | Pastal yerleşim, kumaş tüketimi |
| **Bilgiler** | Kesim verimi, fire oranı |
| **Paylaşım** | İmalat, Stok |

---

## 7. İMALAT (`/imalat`)

| Alan | Detay |
|---|---|
| **Amaç** | Dikiş üretimi |
| **Ana alan** | Üretim hattı — iş emri takibi |
| **Alt pencereler** | Operasyon listesi, üretim takibi, kalite kontrol |
| **Bilgiler** | Operasyon süresi, üretim miktarı, hata oranı |
| **Kayıt** | Her aşamada görsel/sesli kayıt |
| **Paylaşım** | Stok, Maliyet, Kalite |

---

## 8. MALİYET (`/maliyet`)

| Alan | Detay |
|---|---|
| **Amaç** | Ürün maliyeti hesaplama |
| **Ana alan** | Ürün maliyet tablosu |
| **Alt pencereler** | Ham maliyet, işçilik maliyeti, genel gider |
| **Paylaşım** | Muhasebe, Karargâh |

---

## 9. MUHASEBE (`/muhasebe`)

| Alan | Detay |
|---|---|
| **Amaç** | Finans kayıtları |
| **Ana alan** | Gelir-gider tablosu |
| **Alt pencereler** | Faturalar, vergi |
| **Paylaşım** | Kasa, Maliyet |

---

## 10. KASA (`/kasa`)

| Alan | Detay |
|---|---|
| **Amaç** | Nakit kontrol |
| **Ana alan** | Nakit hareketleri |
| **Alt pencereler** | Günlük kasa, ödeme kayıtları |
| **Paylaşım** | Muhasebe |

---

## 11. STOK (`/stok`)

| Alan | Detay |
|---|---|
| **Amaç** | Ürün stok yönetimi |
| **Ana alan** | Stok listesi |
| **Alt pencereler** | Depo stok, mağaza stok, kritik stok uyarısı |
| **Paylaşım** | Sipariş, Katalog, Karargâh |

---

## 12. KATALOG (`/katalog`)

| Alan | Detay |
|---|---|
| **Amaç** | Satış kataloğu |
| **Ana alan** | Ürün görselleri + açıklamaları |
| **Paylaşım** | Stok, Sipariş |

---

## 13. SİPARİŞLER (`/siparisler`)

| Alan | Detay |
|---|---|
| **Amaç** | Sipariş yönetimi |
| **Ana alan** | Sipariş tablosu |
| **Alt pencereler** | Sipariş listesi, üretim durumu, kargo takibi |
| **Paylaşım** | Stok, İmalat, Müşteri |

---

## 14. MÜŞTERİLER (`/musteriler`)

| Alan | Detay |
|---|---|
| **Amaç** | Müşteri verisi |
| **Ana alan** | Müşteri listesi |
| **Alt pencereler** | Müşteri kartı, satın alma geçmişi, iletişim |
| **Paylaşım** | Sipariş, Raporlar |

---

## 15. PERSONEL (`/personel`)

| Alan | Detay |
|---|---|
| **Amaç** | Çalışan yönetimi |
| **Ana alan** | Personel kartları |
| **Alt pencereler** | Çalışan profili, performans, günlük/haftalık/aylık rapor |
| **Kural** | Herkes sadece kendi yetki alanındaki bilgiye erişir |
| **Paylaşım** | Görevler, İmalat |

---

## 16. GÖREVLER (`/gorevler`)

| Alan | Detay |
|---|---|
| **Amaç** | İş yönetimi |
| **Ana alan** | Görev listesi |
| **Alt pencereler** | Aktif görevler, tamamlanan, geciken |
| **Paylaşım** | Personel, Karargâh |

---

## 17. KAMERALAR (`/kameralar`)

| Alan | Detay |
|---|---|
| **Amaç** | Üretim izleme |
| **Ana alan** | Canlı kamera görüntüsü |
| **Alt pencereler** | Kamera listesi, kayıt arşivi |
| **Paylaşım** | İmalat, Güvenlik |

---

## 18. AJANLAR (`/ajanlar`)

| Alan | Detay |
|---|---|
| **Amaç** | AI agent yönetimi |
| **Ana alan** | Ajan listesi |
| **Alt pencereler** | Trend agent, stok agent, satış agent, üretim agent, maliyet agent |
| **Bilgiler** | Agent durumu, son rapor, öneriler |
| **Paylaşım** | Karargâh, AR-GE |

---

## 19. DENETMEN (`/denetmen`)

| Alan | Detay |
|---|---|
| **Amaç** | Sistem kontrol ve denetim |
| **Ana alan** | İşlem denetimi |
| **Alt pencereler** | Hata raporu, düzeltme geçmişi, uygunluk kontrolü |
| **Paylaşım** | Tüm modüller (read-only) |

---

## 20. RAPORLAR (`/raporlar`)

| Alan | Detay |
|---|---|
| **Amaç** | Analiz ve raporlama |
| **Ana alan** | Rapor grafikleri |
| **Alt pencereler** | Satış raporu, üretim raporu, maliyet raporu, performans raporu |
| **Paylaşım** | Karargâh |

---

## 21. TASARIM (`/tasarim`)

| Alan | Detay |
|---|---|
| **Amaç** | Ürün çizimi |
| **Ana alan** | Çizim editörü |
| **Alt pencereler** | Desen sistemi, renk paleti, stil referansları |
| **Paylaşım** | AR-GE, Modelhane |

---

## 22. ÜRETİM (`/uretim`)

| Alan | Detay |
|---|---|
| **Amaç** | Tüm üretim planı |
| **Ana alan** | Üretim takvimi |
| **Alt pencereler** | Kapasite planı, hat yükleme, gecikme takibi |
| **Paylaşım** | İmalat, Kesim, Karargâh |

---

## 23. GÜVENLİK (`/guvenlik`)

| Alan | Detay |
|---|---|
| **Amaç** | Sistem güvenliği |
| **Ana alan** | Yetki listesi |
| **Alt pencereler** | Kullanıcı yetkileri, erişim logları, güvenlik olayları |
| **Paylaşım** | Karargâh |

---

## 24. AYARLAR (`/ayarlar`)

| Alan | Detay |
|---|---|
| **Amaç** | Sistem yapılandırması |
| **Ana alan** | Ayar kategorileri |
| **Alt pencereler** | Dil ayarı, modül ayarı, bildirim ayarı, tema ayarı |
| **Paylaşım** | — |

---

## 25. GİRİŞ (`/giris`)

| Alan | Detay |
|---|---|
| **Amaç** | Kimlik doğrulama |
| **Ana alan** | Kullanıcı giriş ekranı |
| **Alt pencereler** | 2FA doğrulama |
| **Paylaşım** | Güvenlik |
