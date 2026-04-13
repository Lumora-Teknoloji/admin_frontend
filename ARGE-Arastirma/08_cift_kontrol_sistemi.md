# 08 - Çift Kontrol ve Doğrulama Sistemi

---

## ANA PRENSİP (Kullanıcının Sözleri)

> Kuracağımız bütün sistemler, sistemin temelinde ana her noktasında her işlem mutlaka yapılan tarafından değil, yapan, doğru yapıp yapmadığını kontrol eden ikinci bir nokta, bir müfettiş noktasında kayıt altına alınacak.

> Yani kısacası sistemde 1500 tane işlem mi yapılıyor? O 1500 tane işlemi yapanlar imkanlar dahilinde algoritmalar, botlar ve sistem mi? O zaman o 1500 tane sistemin algoritmasını, imkanlar dahilinde botlarını, ajanlarını kontrol edecek 1500 tane kontrol ekibimiz de olacak.

---

## NEDEN ÇİFT KONTROL (Kullanıcının Sözleri)

> Bununla ilgili yaklaşık bir buçuk senedir çalışmamla beraber, son 45 gündür gece gündüz 24 saat yeri geldiğinde 36 saat bir çalışma yürütüyorum ama makinelerin dahi yapmadığı işlemleri yaptım demesi, işin kolayına kaçması, saniyede 500 tane dosyaya bakabilen sistemin, gerçek canlı sisteme bakmayarak, medya dosyalarıyla cevap vermesi insanın hat safhasına getiriyor artık.

> Ben işi yaptım ama benim yaptığım işi ben doğru yapıp yapmadığımı kontrol edilecek.

---

## SİSTEM MİMARİSİ

### 2 KATMANLI ZORUNLU YAPI:

#### 1. KATMAN (YAPAN):
- bot / algoritma / insan
- görevi yapar

#### 2. KATMAN (KONTROL EDEN):
- farklı sistem
- aynı işi tekrar kontrol eder

### SONUÇ:
- uyuşuyorsa → kabul
- uyuşmuyorsa → RED + LOG

---

## KONTROL AKIŞI

```
İŞLEM → KONTROL → KAYIT → ONAY
```

Her görev sonunda:
- ✔ Beklenen çıktı üretildi mi?
- ✔ Test geçti mi?
- ✔ Diğer sistemleri bozdu mu?
- Geçmezse → otomatik geri döner

---

## HATA DURUMU

- uyuşmazlık → sistem durur
- rapor oluşturur
- manuel inceleme

---

## GÜVEN YAKLAŞIMI (Kullanıcının Sözleri)

> İnsan ve makine kesinlikle güven söz konusu değil. Güvenebiliriz, güveniyoruz da ama biz bir işletme, bir sistem kuruyoruz. Sistemimizin mantığı da sıfır inisiyatif. Bu inisiyatifi sıfıra indirebilmemiz için yapılacak her işlemi belirtmemiz, nasıl istediğimizi belirtmemiz gerekiyor. Bunu belirtirken de bunu yapanın bunu istediğimiz şekilde yapıp yapmadığını da kontrol etmemiz gerekiyor.

---

## GÜVENLİK SEVİYESİ (Kullanıcının Sözleri)

> Sistem güvenlik seviyesi olarak yapılan her işlem kayıt altında olacak. Sistem kendi kendini geliştirebilecek panel geliştirebilecek. Yapılan işlem kayıt altında olursa, bu kayıtlar da kim emir vermiş, kim nasıl yapmış, neden olmuş, neden sebeplenmiş kendimizi geliştirebiliriz.

---

## DÜNYA STANDARDI KARŞILIĞI (Sohbette Belirtilen)

- Aviation systems (uçak yazılımları) → her işlem ikinci sistem tarafından doğrulanır
- Financial systems (bankalar) → çift onay / audit trail
- Industrial automation (Endüstri 4.0) → sensor + validator
- AI pipelines → output validation + guardrail

Model adı: "Redundant Validation Architecture"

---

## LOG SİSTEMİ

Her işlem için zorunlu kayıt:
- kim yaptı
- ne yaptı
- ne zaman yaptı
- hangi veriyle yaptı
- neden (varsa karar sebebi)
- Kayıt silinemez, değiştirilemez (append-only)

---

## YÖNETİCİ KARARI KONTROLÜ

Yönetici sistem önerisini değiştirirse:
- karar kayıt altına alınır
- sonuçlarıyla birlikte takip edilir

Sistem:
- kendi önerisi vs yönetici kararı sonuçlarını karşılaştırır
- hangi karar daha doğru → öğrenir

---

## A4 DENETÇİ AJANI (Sohbette Kararlaştırılan)

> Dördüncü bir pencere açalım, anti-gravityden. Verdiğimiz görevi yapan, doğru yapıp yapmadığını kontrol etsin. Kesinlikle sisteme dokunmasın. Bunu bir kontrol olarak düşün. O yüzden biri yapacak, biri kontrol edecek.

A4 Görev: Denetim / Kontrol
- A1, A2, A3 çıktılarının doğruluğunu kontrol etmek
- Sisteme komut çalıştırmamak
- Sadece verilen çıktıyı incelemek
- Değiştirme / düzeltme yapmamak
- Yorum yok, sadece rapor
