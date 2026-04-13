# 25 - Karargâh Sayfa Düzeni (Merkezi Yönetim)

---

## AMAÇ

Tüm sistemin tek ekranda izlenmesi, yönetilmesi ve yetkilendirilmesi.
Karargâh **tüm modüllere erişir** ve **yetki verme/alma** işlemlerini yönetir.

---

## EKRAN YAPISI (5 Bölge)

```
┌─────────────────────────────────────────────────────┐
│  1. ÜST KONTROL BAR                                │
├────────┬──────────────────────────┬─────────────────┤
│ 2. SOL │  3. MERKEZ OPERASYON    │ 4. SAĞ ANALİZ   │
│ PANEL  │     PANELİ              │    PANELİ        │
│        │                          │                 │
├────────┴──────────────────────────┴─────────────────┤
│  5. ALT CANLI SİSTEM DURUMU                         │
└─────────────────────────────────────────────────────┘
```

---

## 1. ÜST KONTROL BAR

| Alan | İçerik |
|---|---|
| Global arama | Tüm sistemde ürün/kumaş/müşteri/sipariş/çalışan ara |
| Sistem durumu | Aktif / Pasif gösterge |
| Aktif kullanıcı | Kaç kişi çevrimiçi |
| Bildirimler | Kritik uyarılar |
| Acil durum butonu | Sistem kilitle / aç |
| Kullanıcı yönetimi | Yetki ver / al |

**Renk:** Koyu zümrüt yeşili arka plan, altın ikonlar

---

## 2. SOL PANEL (Sistem Navigasyon)

25 modül listelenir:

| # | Modül | Durum Işığı |
|---|---|---|
| 1 | Karargâh | 🟢 |
| 2 | Ar-Ge | 🟢/🟡/🔴 |
| 3 | Kumaş | 🟢/🟡/🔴 |
| 4 | Modelhane | 🟢/🟡/🔴 |
| 5 | Kalıp | 🟢/🟡/🔴 |
| 6 | Kesimhane | 🟢/🟡/🔴 |
| 7 | İmalat | 🟢/🟡/🔴 |
| 8 | Maliyet | 🟢/🟡/🔴 |
| 9 | Muhasebe | 🟢/🟡/🔴 |
| 10 | Kasa | 🟢/🟡/🔴 |
| 11 | Stok | 🟢/🟡/🔴 |
| 12 | Katalog | 🟢/🟡/🔴 |
| 13 | Siparişler | 🟢/🟡/🔴 |
| 14 | Müşteriler | 🟢/🟡/🔴 |
| 15 | Personel | 🟢/🟡/🔴 |
| 16 | Görevler | 🟢/🟡/🔴 |
| 17 | Kameralar | 🟢/🟡/🔴 |
| 18 | Ajanlar | 🟢/🟡/🔴 |
| 19 | Denetmen | 🟢/🟡/🔴 |
| 20 | Raporlar | 🟢/🟡/🔴 |
| 21 | Tasarım | 🟢/🟡/🔴 |
| 22 | Üretim | 🟢/🟡/🔴 |
| 23 | Güvenlik | 🟢/🟡/🔴 |
| 24 | Ayarlar | 🟢/🟡/🔴 |
| 25 | Giriş | — |

> 🟢 Normal / 🟡 Dikkat / 🔴 Sorun

---

## 3. MERKEZ OPERASYON PANELİ

### Üretim Zinciri (Canlı Akış)

```
AR-GE → TASARIM → MODELHANE → KALIP → KESİM → İMALAT → STOK → SATIŞ
```

Her aşama için kartlar:

| Bilgi | Açıklama |
|---|---|
| Aktif iş sayısı | Kaç ürün bu aşamada |
| Bekleyen iş | Sırada ne var |
| Geciken iş | Süre aşımı olanlar |
| Kalite durumu | Hata oranı |

> Tıklanınca ilgili modül açılır.

### Dashboard Kartları

| Kart | Gösterilen |
|---|---|
| Üretim | Günlük üretim adedi / hat kapasitesi |
| Satış | Satış miktarı / satış trendi |
| Stok | Ürün stok / kritik stok uyarısı |
| Sipariş | Bekleyen / yeni sipariş |
| Maliyet | Birim maliyet / değişim |
| Personel | Aktif çalışan / performans |

---

## 4. SAĞ ANALİZ PANELİ

| Panel | İçerik |
|---|---|
| **Trend Radar** | Hangi ürün yükseliyor / düşüyor |
| **Satış Analizi** | Günlük / haftalık satış |
| **Stok Analizi** | Hızlı dönen / yavaş ürün |
| **Risk Analizi** | Maliyet artışı / üretim gecikmesi |
| **Kritik Uyarılar** | Stok bitiyor, gecikme, kalite hatası |

---

## 5. ALT CANLI SİSTEM DURUMU

| Bilgi | Detay |
|---|---|
| Üretim | Aktif makine / çalışan sayısı |
| Sipariş | Yeni sipariş / bekleyen sipariş |
| Stok | Kritik stok uyarısı |
| Maliyet | Ürün maliyet değişimi |

---

## POPUP PENCERELER

| Pencere | İçerik |
|---|---|
| Kullanıcı yetki yönetimi | Kullanıcı adı, rol, erişim modülleri |
| Sistem uyarıları | Kritik hatalar, gecikmeler |
| Hızlı görev atama | Görev, sorumlu, teslim tarihi |
| Ajan kontrol | Agent durumu, raporları, önerileri |

---

## AJAN KONTROL PANELİ

| Agent | Görev |
|---|---|
| Trend Agent | Trend takibi |
| Satış Agent | Satış analizi |
| Stok Agent | Stok optimizasyonu |
| Üretim Agent | Üretim planlama |
| Maliyet Agent | Maliyet takibi |

---

## YETKİ YÖNETİM PANELİ

| İşlev |
|---|
| Kullanıcı ekleme / silme |
| Rol tanımlama |
| Yetki verme / alma |
| Erişim logları görüntüleme |

---

## KARARGÂH VERİ PAYLAŞIMI

Karargâh **tüm modüllerle** veri paylaşır:
- Tüm verileri okuyabilir
- Tüm verileri değiştirebilir
- Tüm yetkileri yönetebilir
