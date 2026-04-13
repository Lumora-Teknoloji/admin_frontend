# 24 - Sayfa Tasarım Standardı ve Renk Sistemi

---

## GENEL SAYFA GRID YAPISI (Tüm Sayfalar İçin)

```
┌─────────────────────────────────────────────────────┐
│  ÜST BİLGİ BAR                                     │
├────────┬──────────────────────────┬─────────────────┤
│  SOL   │  ANA ÇALIŞMA ALANI      │  SAĞ YARDIM     │
│  MENÜ  │                          │  PANELİ         │
│        │                          │                 │
│        │                          │                 │
├────────┴──────────────────────────┴─────────────────┤
│  ALT DURUM BAR                                      │
└─────────────────────────────────────────────────────┘
```

---

## ÜST BİLGİ BAR

| Alan | İçerik |
|---|---|
| Sol | Sayfa adı + breadcrumb |
| Orta | Hızlı arama |
| Sağ | Bildirimler, dil seçimi, kullanıcı bilgisi, tarih/saat |
| Renk | Koyu zümrüt yeşili arka plan, altın ikonlar |

---

## SOL MENÜ

| Özellik | Detay |
|---|---|
| İçerik | Tüm sistem modülleri (25 sayfa) |
| Görünüm | İkon + isim |
| Hover | Açık yeşil |
| Durum ışığı | Yeşil (normal) / Sarı (dikkat) / Kırmızı (sorun) |

---

## ANA ÇALIŞMA ALANI

- Sayfaya göre değişen içerik
- Kart sistemli tasarım
- Tablo / grafik / form alanları

---

## SAĞ YARDIM PANELİ

| İçerik |
|---|
| Hızlı bilgiler |
| Kısa raporlar |
| Yardımcı notlar |
| Bağlantılı sayfalar |

---

## ALT DURUM BAR

| Alan | İçerik |
|---|---|
| Sol | Sistem durumu (çevrimiçi/çevrimdışı) |
| Orta | Aktif kullanıcı sayısı |
| Sağ | Veri senkronizasyon durumu |

---

## RENK SİSTEMİ

| Kullanım | Renk | Kod |
|---|---|---|
| **Ana renk** | Zümrüt Yeşili | `#046A38` |
| **Vurgu** | Koyu Gold | `#C8A951` |
| **Destek** | Yumuşak Mavi | `#4F7CAC` |
| **Arka plan** | Açık Gri | `#F4F6F7` |
| **Metin** | Koyu gri | `#2D3436` |
| **Başarı** | Yeşil | `#27AE60` |
| **Uyarı** | Sarı | `#F39C12` |
| **Hata** | Kırmızı | `#E74C3C` |

---

## PSİKOLOJİK TASARIM PRENSİPLERİ

| Prensip | Açıklama |
|---|---|
| Sakinlik | Yoğun renk kullanılmaz |
| Temizlik | Ekran kalabalık olmaz |
| Netlik | İkonlar sade olur |
| Okunabilirlik | Veri blokları büyük olur |
| Boşluk | Geniş padding/margin |
| Stres azaltma | Pastel tonlar + yumuşak geçişler |

> **Amaç:** Çalışanlar günlük yoğun iş temposunda bu ekranlara baktığında sakinlik ve güven hissetmeli.

---

## DİL SİSTEMİ

| Dil | Rol | Yön |
|---|---|---|
| Türkçe | Ana dil | LTR |
| Arapça | İkinci dil | RTL |
| İngilizce+ | Opsiyonel | LTR |

---

## ERİŞİM SEVİYELERİ

| Seviye | Yetki |
|---|---|
| Karargâh | Tüm sisteme erişim + yetki yönetimi |
| Yönetici | Departman bazlı tam erişim |
| Departman | Kendi modülü + paylaşılan veriler |
| Operatör | Kendi görev alanı |
| İzleyici | Sadece okuma |

---

## KAYIT KURALLARI

1. Tüm işlemler kayıt altına alınır
2. Ses + video kayıt zorunlu (üretim bölümü)
3. İşlem geçmişi silinemez
4. Yetki tabanlı erişim
5. Tüm loglar merkezi sistemde saklanır
