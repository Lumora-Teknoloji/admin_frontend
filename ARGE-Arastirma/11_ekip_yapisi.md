# 11 - Ekip Yapısı ve Ajan Görev Dağılımı

---

## EKİP MANTIĞI (Kullanıcının Sözleri)

> Bunu yaparken de sadece bir antigravit ajansıyla değil, 10 tane ekiple yaptırıp o zamanı da kısaltmak istiyorum. Yani bir tane adam yaptığında 10 saatte yapacaksa iş planını hazırlayalım, eksiksiz o iş planında ona bölelim. Birbirleriyle çakışmayacak şekilde 10 ekibe verelim. 10 ekip yapsın, entegre edelim, bitmiş olsun.

> Ekip 12 denden fazda veya eksik olabilir sadece süre uzatmamak adına kaç kişilik ekip gerekliyse o kadar

---

## ÇALIŞMA MODELİ (Kullanıcının Sözleri)

> Sen bunu yaptırırken neyi en ince ayrıntısına kadar söyle, inisiyatife payı bırakma ki yapılan işlem doğru olsun. Hata olmasın, yaptığımız işlemi tekrardan yapmak zorunda kalmayalım.

> Sen komutu ver, yapılacak işlemi belirle, teknolojiyi belirle, yapılacak işi belirle. Ben bunu antigraviteye kendi bilgisayarımın masaüstüne kurdurayım.

---

## ORKESTRA ŞEFİ MODELİ (Kullanıcının Sözleri)

> Orkestra şefi olarak beni yardımcı olarak çalıştır. Ben sen bunu yaparken bilgisayarın tarayıcısına ulaşamadığın için sen komutu ver, yapılacak işlemi belirle, teknolojiyi belirle, yapılacak işi belirle. Ben bunu antigraviteye kendi bilgisayarımın masaüstüne kurdurayım.

---

## AJAN TANIMLARI (Sohbette Kararlaştırılan)

### 🔴 A1 (SİSTEM AJANI)
```
AJAN ADI: A1
GÖREV: Sistem Kontrol

SORUMLULUK:
- Bilgisayarda kurulu programları kontrol etmek
- Sadece verilen komutları çalıştırmak

KURALLAR:
- Sıfır inisiyatif
- Ekstra işlem yok
- Sadece çıktı ver
- Hata varsa aynen yaz
```

### 🟢 A2 (BACKEND AJANI)
```
AJAN ADI: A2
GÖREV: Backend Geliştirme

SORUMLULUK:
- API ve sistem kodları
- Backend işlemleri

KURALLAR:
- Bekle
- Komut verilmeden işlem yapma
- Sıfır inisiyatif
```

### 🔵 A3 (FRONTEND AJANI)
```
AJAN ADI: A3
GÖREV: Frontend + i18n

SORUMLULUK:
- Panel arayüzü
- Türkçe / Arapça dil sistemi

KURALLAR:
- Bekle
- Komut verilmeden işlem yapma
- Sıfır inisiyatif
```

### ⚫ A4 (DENETÇİ AJAN)
```
AJAN ADI: A4
GÖREV: Denetim / Kontrol

SORUMLULUK:
- A1, A2, A3 çıktılarının doğruluğunu kontrol etmek
- Sisteme komut çalıştırmamak

KURALLAR:
- Sıfır inisiyatif
- Hiçbir komut çalıştırma (read-only)
- Sadece verilen çıktıyı incele
- Değiştirme / düzeltme yapma
- Yorum yok, sadece rapor
```

---

## TÜM AJANLARA YAPIŞTIRILACAK GENEL KURALLAR

```
GENEL KURALLAR (ZORUNLU)

1) Sıfır inisiyatif:
   Sadece verilen komutu uygula. Ekstra işlem yapma.

2) Tek komut:
   Verilen komutu aynen çalıştır. Değiştirme.

3) Tam çıktı:
   Çıktıyı kesmeden, değiştirmeden ver.

4) Hata:
   Hata varsa aynen yaz. Düzeltmeye çalışma.

5) Ek kurulum:
   İzin verilmeden hiçbir şey kurma.

6) Sıra:
   Komut sırasını bozma.

7) Açıklama:
   Yorum yapma. Sadece çıktı ver.

8) Tekrar:
   Komut başarısızsa kendi kendine tekrar etme.

9) Dil:
   Çıktı olduğu gibi kalacak.

10) Dur:
    Komut bittiğinde dur ve sonucu ver.
```

---

## KONTROL AKIŞI

```
A1 → komutu çalıştırır
↓
A4 → çıktıyı kontrol eder
↓
SONUÇ → geç / kal
```

---

## ÇIKTI FORMATI (Kullanıcının İsteği)

> Görev emri verdiğinde çıktıları tek tıkla kopyalanabilir versinler ki ben kopyalayayım, A4'e verip kontrol ettireyim.

---

## AJAN AÇMA DÜZENİ (Kullanıcının Sözleri)

> Antigravity sayfalarını açtım. Bir tanesi Antigravity, bir tanesi de Open iAgent Manager o sayfaları da açtım. Artı bir tane sayfa daha şimdi açıyorum.

> Antigravitelerin de bir tanesini normal tarayıcıdan açacağım, bir tanesini de dronserdan açacağım.

---

## 10 KİŞİLİK EKİP YAPISI (Panelin Genel Kullanımı İçin)

Sohbette belirlenen roller:
1) Sistem mimarı
2) Backend (1)
3) Backend (2)
4) Frontend
5) Data / AI
6) DevOps
7) Test / validation
8) Entegrasyon
9) i18n
10) Kontrol (denetçi)

---

## EKİP KURALLARI

- Her kişinin rolü net ve çakışmasız olacak
- Her rolün sorumluluğu ayrı tanımlanacak
- Her rol kendi çıktısını test etmekle yükümlü olacak
- Bir üst kontrol mekanizması olacak (quality gate)
- Bir kişi birden fazla kritik rolde olmayacak
