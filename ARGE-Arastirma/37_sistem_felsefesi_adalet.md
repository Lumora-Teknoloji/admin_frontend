# 37 - Sistem Temel İlkeleri ve Adalet Felsefesi

> Kaynak: ChatGPT istişaresi — 37 yıllık tecrübeye dayalı işletme felsefesi
> Bu sistem ERP değildir. Kendi işletmeniz için adil, şeffaf ve ölçülebilir bir üretim sistemidir.

---

## SİSTEMİN TEMEL FELSEFESİ

**Kararı insan değil veri verir.**

Bu nedenle:
- İşlem sırası sabit (sistemde kayıtlı)
- İşlem zorluğu kayıtlı (sistemde puanlı)
- Üretim süresi ölçülür (gerçek zamanlı)
- Ücret hesaplama veri ile yapılır (manipülasyon yok)

---

## SİSTEMİN HEDEFİ

- İnsan kayırmacılığını ortadan kaldırmak
- Adil, şeffaf ve ölçülebilir üretim sistemi kurmak
- 37 yıllık meslek tecrübesindeki eksiklikleri düzeltmek
- Adaletli ücretlendirme yapmak
- Sonra insanlık hayrına mesleğimizde çalışan diğer insanların da faydalanması

---

## AMAÇ KATMANLARI

1. **Adil ücret** — İşçilik ölçümü veri ile, manipülasyon engellenir
2. **Şeffaflık** — Çalışan yaptığı işi görebilir, ücret hesabı açık
3. **Veri tabanlı karar** — İnsan tahmini yerine veri analizi
4. **Manipülasyon koruması** — Veriler sonradan değiştirilemez
5. **Standartlaşma** — İnisiyatife yer yok, her işlem tanımlı

---

## MANİPÜLASYON KORUMALARI

| Kontrol | Açıklama |
|---|---|
| Üretim verisi | Değiştirilemez (immutable log) |
| Satış verisi | Değiştirilemez |
| Kasa verisi | Değiştirilemez |
| Log kayıtları | Değiştirilemez |
| Geçmiş kayıtlar | Sistemden silinemez (soft delete) |

---

## PATRON-ÇALIŞAN DENGESİ

| Soru | Cevap (Hedef) |
|---|---|
| Patron sistemi manipüle edebilir mi? | HAYIR |
| Çalışan verileri görebiliyor mu? | Sadece kendi yetki alanı |
| Veri tek taraflı mı? | HAYIR — karşılıklı denetim |

---

## SİSTEMİN KÖTÜYE KULLANIM ANALİZİ

| Soru |
|---|
| Kullanıcı sistemi kandırabilir mi? |
| Veri manipülasyonu mümkün mü? |
| Üretim sayıları şişirilebilir mi? |
| Kasa verileri değiştirilebilir mi? |

> Bu soruların tamamına cevap **HAYIR** olmalıdır.

---

## SİSTEMİN MESLEĞE KATKISI

| Soru |
|---|
| Sistem sektörde standart olabilir mi? |
| Sistem başkaları için uygulanabilir mi? |
| Sistem meslekte adalet sağlayabilir mi? |

---

## İŞÇİ PSİKOLOJİSİ

- Sistem çalışanı strese sokmamalı
- Sistem çalışanı motive etmeli
- Çalışan sistemi kullanmak istemeli
- Ekran basit, anlaşılır, huzur verici olmalı
- Yoğun renk kullanılmaz, boşluklar geniş, yazılar okunabilir

---

## 4 ANA BÖLÜM

1. **İmalat / AR-GE** — Araştırma, tasarım, kalıp, numune, teknik föy
2. **Üretim** — Kesim, dikim, kalite kontrol, paketleme
3. **Mağaza & E-Ticaret** — Stok, satış, müşteri analizi
4. **Yapay Zeka Ofisi** — Sistem eksiklerini bulma, veri analizi, optimizasyon

---

## ÜRETİMDE İNSİYATİF SIFIR

Üretime geçtiğinde üretimin insiyatif kullanabileceği hiçbir nokta yok:
- İlk işlemden son işleme kadar nasıl yapacağı → görsel, sesli, yazılı sistemde kayıtlı
- İşlemlerin zorluk sırası → sistemde kayıtlı
- İşlemlerin hangi makineyle nasıl yapılacağı → sistemde kayıtlı
- Teknik föy okuduğunda her şey sıralı, nasıl yapılacağı belirlenmiş
- Kim hangi işleme hangi saatte başladı, hangi saatte bitirdi → sisteme kayıtlı

---

## SİSTEM KENDİNİ GELİŞTİRME

Sistem kendi kendini geliştirebilecek:
- Satış verileri → hangi ürün başarılı, hangisi değil
- Üretim verileri → hangi işlem yavaş, hangisi hızlı
- Mağaza verileri → hangi müşteri, hangi ülke, ne zaman
- Hata verileri → tekrarlayan hatalar tespit edilir
- Başarılı modeller → arşivlenir ve referans olur
