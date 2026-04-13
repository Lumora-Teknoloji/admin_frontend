# 10 - Mobil Erişim ve Telegram Entegrasyonu

---

## MOBİL ERİŞİM GEREKSİNİMİ (Kullanıcının Sözleri)

> Panele mobil telefonundan erişebilip mobil telefondan panele talimat verebileceğimiz kapasitede olsun.

> Çünkü ben 24 saat, 36 saat veya 48 saat artık bilgisayar başında ailemi ve çoluk çocuğumdan uzak kalmak istemiyorum. Bu işlemleri bu şekilde yapacağız.

> Panede biz uzaktan mobil telefonumuzla yetkilendirilmiş mobil telefonumuza bağlanabilir, ona talimat verebilir, o talimatın gidişatını kontrol edebileceğimiz düzeyde olacak. Becerili olacak.

---

## MOBİL PANEL ÖZELLİKLERİ

- Panel web tabanlı olacak (mobil uyumlu)
- Telefondan:
  - giriş yapılır
  - görev verilir
  - süreç izlenir
  - rapor görülür

---

## YETKİLİ ERİŞİM

- Sadece tanımlı cihazlar / kullanıcılar erişebilir
- Yetki seviyesine göre işlem yapılır

---

## UZAKTAN TALİMAT

- Kullanıcı mobil üzerinden:
  - görev oluşturur
  - görev başlatır / durdurur
  - öncelik değiştirir

---

## ANLIK TAKİP

- Verilen görevin:
  - durumu (başladı / devam / bitti / hata)
  - kim yapıyor
  - ne aşamada
  mobil panelden görülür

---

## DURUM RENKLERİ

- kırmızı = hata
- sarı = işlem
- yeşil = tamam

---

## TELEGRAM ENTEGRASYONU (Kullanıcının Sözleri - TAM YETKİLİ)

> Telegram bot bize mesaj atsın, atabilece kapasitesi olsun ama biz mobil telefondan panele ulaşabilir, panelimize talimat verip panelimizde yapılan işlemleri görebileceğimiz şekilde olsun.

> Telegram basit konum almasın ya. Telegramdan da verebilirim. Telefondan ulaşamamışsak Telegramdan verelim. Basit konum değil. Her şey üst seviyede olacak.

---

## TELEGRAM TAM YETKİLİ KONTROL

Telegram bot sadece bildirim değil:
- görev oluşturabilir
- görev başlatabilir
- görev durdurabilir
- görev durumu sorgulayabilir
- rapor çekebilir
- Panelde yapılan her işlem Telegramdan da yapılabilir

---

## TELEGRAM KOMUT YAPISI

- Serbest mesaj yok
- Standart komut formatı:
  - /task_create
  - /task_status
  - /task_stop
  - /task_report
- Yanlış / eksik komut → sistem reddeder

---

## YETKİ KONTROLÜ

- Telegram kullanıcıları: rol bazlı yetkilendirilir
- Her komut: kim gönderdi, yetkisi var mı kontrol edilir

---

## ÇİFT YÖNLÜ SENKRON

- Panel ↔ Telegram aynı veri
- Telegramdan verilen komut: panelde anında görünür
- Panelde yapılan işlem: Telegrama yansır

---

## KANITLI SİSTEM

- Her işlem: loglanır
- Kim yaptı / ne zaman / ne yaptı kayıtlı
- Silinemez, değiştirilemez kayıt

---

## HATA VE RİSK KONTROLÜ

- Sistem: kritik komutlarda uyarı verir, risk bildirir
- Onay mekanizması (gerekirse çift onay)

---

## BİLDİRİM SİSTEMİ

Sistem şu durumlarda bildirim gönderir:
- görev tamamlandı
- hata oluştu
- gecikme var

---

## OFFLINE DURUM

- İnternet yoksa: sistem lokal çalışır, veri cihazda tutulur
- İnternet geldiğinde: otomatik senkronizasyon yapılır
