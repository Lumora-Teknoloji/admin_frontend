# 06 - Veri Yönetimi ve Saklama Politikası

---

## ANA PRENSİP (Kullanıcının Sözleri)

> Burada şunu demek istiyorum. Veriyi aldık, analizini yapalım, analiz sonucunu kaydedelim. Veriyi de kendi bilgisayarımızda, kendi sistemimizde kaydetmeyelim. Çünkü o veriyi biz aldığımızda, örnek diyorum, şu an veriye kamuya açık verileri kullanacağız. Kesinlikle zerre kadar kamuya açık olmayan hiçbir veriyi kullanmak istemiyoruz.

> Ama bu veriyi biz kullandıktan sonra bu veriyle ilgili olan süreci kendi işletmemizdeki, kendi server bilgisayarımızda yavaşlatmamıza gerek yok. Alalım veriyi, görselini kontrol edelim, bize gerekli bilgiyi alalım, kendi sistemimize kaydedelim.

---

## VERİ SINIFI AYRIMI

### A) DIŞ VERİ (kamuya açık):
- Kullanım: görüntülenir, analiz edilir
- KURAL: sisteme KAYDEDİLMEZ, lokal serverda tutulmaz, sadece geçici kullanılır (ephemeral)

### B) İÇ VERİ (orijinal):
- Kullanım: sisteme kaydedilir
- Kaydedilen: analiz sonuçları, kararlar, performans verileri

---

## ANALİZ AKIŞI

> Sizin kendi sisteminize bugün kaydettiğiniz veriyi yarın aynı veriyle analiz edelim, analiz sonucunu kaydedelim. Çünkü başkasının verdiği, kamuya açık bilgiye, veriye kendi sistemimize kaydettiğimizde o bizim kendi orijinal verimiz, bilgimiz olmayacak. Kendi orijinal bilgiye ve verimiz oluşması adına dünya standartlarında farklı bir bakış açısı yaratmak istiyoruz.

---

## HUKUKİ YAKLAŞIM (Kullanıcının Sözleri)

> Başkasının verisini kendi sistemimize kaydetmemize ve başkasının bundan ilerleyen süreçte hak talep etmesine müsaade ve hukuki süreç işte haksız durumuna düşmek istemiyoruz. Ama bunun için en doğru yol, en mantıklı ve yeni bir veri saklama mantığı geliştirmek istiyoruz.

---

## TREND BAZLI KAYIT MODELİ (Kullanıcının Sözleri)

> Bu noktada dışarıdan aldığımız kamuya açık verileri baktık, bir gün tuttuk, ertesi günle karşılaştırdık, ertesi günle o günün analizini kaydettik. Elimizde ne oldu? Dününle bugünün analiz sunucu oldu. Yarının sonuçlarını aldığımızda, baktığımızda, dünle bugünle analiz edebiliriz. O zaman o veri saklamamızdan, dışarıda başkasının verisini saklamamıza ihtiyacımız kalmamış olacak.

---

## VERİ SAKLAMA KURALI (KESİN)

- ham veri → KAYIT YOK
- analiz sonucu → KAYIT VAR

### TEKNİK YAKLAŞIM:
- dış veri: RAM'de işlenir, işlem bitince silinir
- sistem: sadece sonuçları DB'ye yazar

---

## ANALİZ KANIT KAYDI (Doğrulanabilirlik İçin)

- veri kaynağı (URL / sistem)
- veri zamanı (timestamp)
- veri özeti (hash / fingerprint)
- kullanılan metot
- Veri saklanmaz ama kanıtı saklanır

---

## GÖRSEL SORUNU VE ÇÖZÜMÜ (Kullanıcının Sözleri)

> Bu analiz sonuçlarına nasıl ulaştığımızın bilgisi de olsun. Ama onun sadece bilgi olarak bir sonucu olduğumuzda, görsel olarak sunmadığımızda eksik kalmış oluruz. Görselle beraber bunu nasıl sunabiliriz?

> Görseli aldığımızda nasıl bir hukuki süreçle karşılaşmış oluruz? Ya da görseli kendi görselimizi mi oluşturalım? Orijinal. O veriler analizler dahilinde, orijinal görseli baz alarak oluşturduğumuz görsel ondan esinlenmiş olabilir ama bizim ürettiğimiz orijinal görsel olacak. O zaman ne olmuş olacak? Görsel de bizim analiz sonucu da bizim.

---

## HİBRİT MODEL (Sohbette Karar Verilen)

### %90 DİNAMİK (yeniden üretim):
- analiz sonucu kaydedilir
- görsel TARİFİ kaydedilir
- görsel saklanmaz
- Panel açıldığında grafik anlık üretilir

### %10 SNAPSHOT (kanıt anı):
Ne zaman?
- model ilk işlendiğinde
- büyük değişim olduğunda
- yönetici kararı olduğunda

- sistem: o anki görseli üretir, HASH alır (kanıt), düşük boyutlu snapshot kaydeder
- Bu: "referans görsel" olur, sürekli değil → sadece kritik an

---

## KARŞILAŞTIRMA MODELİ (Kullanıcının Sözleri)

> Bu fotoğrafa baktık, veriyi aldık, analizimizi yaptık, kaydettik, üreteceğimiz fotoğrafı o an hemen üretip, o ürettiğimiz fotoğrafla orijinal fotoğrafı karşılaştırıp kıyasladıysa o veri analizlerini o fotoğrafın altına, o dosyaya mı kaydedip de her dosyanın kendi adımızda fotoğrafı, analiz sonuçları, her şeyini görmek mantıklı, daha karar verme noktasında sağlıklı olur.

```
ORİJİNAL (geçici)
↓
ANALİZ
↓
SİSTEM GÖRSELİ (üretilmiş)
↓
KARŞILAŞTIRMA SKORU (% benzerlik / fark)
↓
SONUÇ KAYDI
```

Kaydedilen: skor, farklar, analiz sonucu
Kaydedilmeyen: dış veri, orijinal görsel

---

## VERİ KATMANI AYRIMI

### A) OPERASYONEL VERİ (aktif sistem):
- Sadece gerekli veri tutulur
- Amaç: sistemi çalıştırmak
- Süre: kısa (örn: 7–10 gün)

### B) ANALİZ VERİSİ (özet):
- Günlük analiz yapılır
- Sonuçlar kaydedilir: performans, verim, hata oranı
- Ham veri tutulmaz, sadece sonuç

### C) ARŞİV (ham veri – dış sistem):
- Detaylı veri dış depoya aktarılır: Supabase (veya benzeri)
- Amaç: geçmiş inceleme, denetim / kanıt

---

## GEREKSİZ VERİ YASAĞI (Kullanıcının Sözleri)

> Gereksiz zerre kadar tek kelime, nokta, virgül kadar bir veri boşuna sisteme dahil edilmesin. Sisteme yük edilmesin, sistemin ağırlaştırılmasına sebep olmasın.

> Gerekiyorsa istenilen gerekli bilgi bir yerde kaydedilsin, istenmeyen gereksiz çöp bilgiler başka bir Subabata gibi bir platformda depolansın.

---

## DEPOLAMA STRATEJİSİ

- Lokal server (mevcut makine): aktif sistem
- Supabase (veya alternatifleri): arşiv / log / yedek

---

## SONUÇ PRENSİBİ

> veri ≠ bilgi
> veri alınır, bilgi üretilir
> sadece bilgi saklanır
