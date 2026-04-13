# 35 - Sistem Test ve Kabul Raporu Şablonu (54 Kriter + 5 Denetmen Kanıt Testi)

> Kaynak: ChatGPT istişaresi — Fiziksel denetim formu
> Amaç: Tüm modüllerin 54 teknik, görsel, hukuksal ve saha kriterine göre test edilmesi

---

## FORM BİLGİLERİ

- **Test Tarihi:** ..../..../2026
- **Testi Uygulayan / Denetmen:** ......................................
- **Saha Platformu:** [ ] Tablet  [ ] Telefon  [ ] Bilgisayar
- **İnternet Durumu:** [ ] Wi-Fi  [ ] Mobil Veri  [ ] Çevrimdışı

---

## KESİN TALİMAT

1. Her modül ve alt sekmeleri bu 54 kritere göre test edilecek
2. Testi yapan kişi işlemi FİZİKEN yapıp ✅ (Geçti) veya ❌ (Kaldı) işaretleyecek
3. Her bölüm sonundaki DENETMEN ZORUNLU KANIT TESTİ sorularının boş bırakılması veya yanlış cevaplanması durumunda test GEÇERSİZ sayılacak

---

## BÖLÜM 1: ARAYÜZ VE UX TESTLERİ

| No | Kriter | Açıklama | Sonuç |
|---|---|---|---|
| 01 | G1 — Okunabilirlik | Buton/yazılar 1m'den okunabiliyor mu | |
| 02 | O — Alt Sekmeler | Yenilenmeden açılıyor mu | |
| 03 | P — Hızlı Butonlar | Parmak boyutunda mı | |
| 04 | Q — Beyaz Ekran | 10 hızlı tıklamada çöküyor mu | |
| 05 | T — Sütun Genişliği | Uzun metin taşıyor mu | |
| 06 | B — Bilgi Obezitesi | Gereksiz veriler gizlenebiliyor mu | |
| 07 | A — Gereklilik | Input alanları gerçekten kullanılıyor mu | |
| 08 | E — Gösterim | Binlik ayracı ve para sembolü doğru mu | |
| 09 | L — Renk Uyumu | 47-Gold ve Emerald renkleri standart mı | |
| 10 | YY — İşçi Psikolojisi | Ekran basit ve anlaşılır mı | |

**DENETMEN KANIT TESTİ 1:** Karargâh'taki "Rakamları Gizle" ikonuna tıklanınca ne görünür?
Cevap: [ ........................................................ ]

---

## BÖLÜM 2: FONKSİYON, HIZ VE ÇÖKERTME TESTLERİ

| No | Kriter | Açıklama | Sonuç |
|---|---|---|---|
| 11 | R — Veri Ekleme | Kayıt DB'ye yazılıyor mu | |
| 12 | X — Negatif Kalkan | Eksi değer reddediliyor mu | |
| 13 | JJ — Çift Tıklama | Mükerrer kayıt oluşuyor mu | |
| 14 | DD — Telegram Alarm | Yüksek işlemde bildirim gidiyor mu | |
| 15 | W — Düzenleme | Kayıt düzenlenebiliyor mu | |
| 16 | U — Silme Onay | Onay penceresi çıkıyor mu | |
| 17 | S — Eksik Form | Boş alan hata veriyor mu | |
| 18 | N — Yönlendirmeler | Linkler doğru çalışıyor mu | |
| 19 | V — PDF Rapor | PDF/yazdırma düzgün mü | |
| 20 | FF — Realtime Veri | Cihazlar arası anlık güncelleme var mı | |

**DENETMEN KANIT TESTİ 2:** "Hızlı Görev Ekle"ye boş spam basınca çıkan hata metni nedir?
Cevap: [ ........................................................ ]

---

## BÖLÜM 3: GÜVENLİK VE KVKK TESTLERİ

| No | Kriter | Açıklama | Sonuç |
|---|---|---|---|
| 21 | AA — URL Kalkan | Pin olmadan /kasa açılabiliyor mu | |
| 22 | PP — API Güvenlik | API anahtarları görünüyor mu | |
| 23 | WW — KVKK | Operatör maaş verisine erişiyor mu | |
| 24 | Spam — Rate Limit | F5 spam engelleniyor mu | |
| 25 | Kara Kutu — Soft Delete | Silinen veri log tablosunda mı | |
| 26 | Session — Oturum | 8 saat aktif olmazsa çıkış yapıyor mu | |
| 27 | C — Pin Güncelleme | Eski pin iptal oluyor mu | |
| 28 | Storage — Dosya Sınırı | 100MB dosya reddediliyor mu | |

**DENETMEN KANIT TESTİ 3:** "Üretim" pini kapatılınca /imalat'a gidince ne olur?
Cevap: [ ........................................................ ]

---

## BÖLÜM 4: FİZİKSEL DÜNYA VE OFFLINE TESTLERİ

| No | Kriter | Açıklama | Sonuç |
|---|---|---|---|
| 29 | XX — Stok Sayım Farkı | Sayım düzeltme çalışıyor mu | |
| 30 | Offline 1 — Kalkan | İnternet kesilince ekran çıkıyor mu | |
| 31 | Offline 2 — Senkron | İnternet gelince otomatik aktarım var mı | |
| 32 | Barkod 1 — QR Yazdır | QR etiket yazıcıya sığıyor mu | |
| 33 | Barkod 2 — QR Okuma | Kamera QR hızlı okuyor mu | |
| 34 | Y — Yük Testi | 100 cihazda yavaşlama var mı | |
| 35 | M — Sorgu Ekonomisi | Gereksiz API çağrısı var mı | |
| 36 | PWA — Mobil Kurulum | Ana ekrana ekle çalışıyor mu | |

**DENETMEN KANIT TESTİ 4:** Wi-Fi kesilince offline kalkan başlığında ne yazıyor?
Cevap: [ ........................................................ ]

---

## BÖLÜM 5: YAPAY ZEKA TESTLERİ

| No | Kriter | Açıklama | Sonuç |
|---|---|---|---|
| 37 | AI-1 — Foto Analiz | Hatalı ürün fotoğrafı analiz ediliyor mu | |
| 38 | AI-2 — Trend Analiz | Moda trend analizi çalışıyor mu | |
| 39 | AI-3 — Prompt Güvenlik | SQL/DDOS injection engelleniyor mu | |
| 40 | AI-4 — Speech-to-Text | Ses komutu metne dönüşüyor mu | |

**DENETMEN KANIT TESTİ 5:** Mikrofona tıklanınca yanıp sönen ışık rengi nedir?
Cevap: [ ........................................................ ]

---

## BÖLÜM 6: DEPARTMAN BAZLI SİSTEMATİK TESTLER

| No | Modül | Kontrol | Sonuç |
|---|---|---|---|
| 41 | Karargah (M0) | Paneller canlı mı, yetki çalışıyor mu | |
| 42 | Ar-Ge (M1) | Tasarım yükleme çalışıyor mu | |
| 43 | Modelhane (M3) | Kalıp kayıtları hatasız mı | |
| 44 | Kumaş (M2) | Negatif metraj engelleniyor mu | |
| 45 | Kalıphane (M4) | Reçete kaydı doğru mu | |
| 46 | Kesim (M5) | Fason statü değişimi çalışıyor mu | |
| 47 | İmalat (M5) | Bant sayıları doğru mu | |
| 48 | Stok/Sevk (M6) | QR sevkiyat çalışıyor mu | |
| 49 | Katalog (M10) | Kur hesaplaması doğru mu | |
| 50 | Sipariş (M12) | Kapora kasaya düşüyor mu | |
| 51 | Kasa (M7) | Realtime hareket var mı | |
| 52 | Personel (M9) | Maaş gizliliği korunuyor mu | |
| 53 | Muhasebe (M8) | Zarar uyarısı çalışıyor mu | |
| 54 | Yönetim | Tüm modüller tek panelden izleniyor mu | |

---

## SONUÇ ONAYI

**BÜTÜN 54 KRİTER VE KANITLAR OLUMLUDUR:**
- [ ] EVET — Sistem üretime/canlıya tamamen hazırdır
- [ ] HAYIR — Eksikler ve hatalar var (aşağıya yazınız)

**Açıklamalar:**
.........................................................................................................

**İMZA (Denetmen / Testi Yapan Kişi):**
*(Tarih ve saatli olarak atılacaktır)*
