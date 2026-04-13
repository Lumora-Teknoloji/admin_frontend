# 20 - Veri Toplama Yöntemi ve Yasal Çerçeve

---

## TEMEL KURAL (DEĞİŞMEZ)

```
Veri çekmiyoruz. Gözle kamuya açık olan her veriyi görüyoruz.
Verinin görselini alıyoruz. Görselden bize lazım olan bilgiyi alıyoruz.
Kendi beynimizi oluşturuyoruz.
```

> **Yöntem:** Competitive Intelligence — gözlem, analiz, yorum.

---

## ERİŞİM YÖNTEMİ: Screenshot + AI Okuma

| Adım | İşlem |
|---|---|
| 1 | Sayfayı aç (kamuya açık) |
| 2 | Screenshot al |
| 3 | OCR / Vision AI ile oku |
| 4 | Analiz sonucunu kaydet |

> Fotoğraf veya veri kopyalanmaz. **Sadece analiz sonucu kaydedilir.**

---

## PLATFORM BAZLI TOPLAMA

### TikTok
| Veri | Yöntem |
|---|---|
| İzlenme | Video screenshot → sayı oku |
| Beğeni | Video screenshot → sayı oku |
| Yorum | Yorum alanı screenshot |
| Viral hız | Aynı video 2 zaman screenshot → fark hesapla |
| Hashtag | Video açıklaması OCR |

### Instagram
| Veri | Yöntem |
|---|---|
| Beğeni | Post screenshot |
| Yorum | Post screenshot |
| Kaydetme | Story/post save bilgisi |
| Reel izlenme | Reel screenshot |
| Farklı hesap paylaşımı | Arama sonucu screenshot |

### Pinterest
| Veri | Yöntem |
|---|---|
| Pin save sayısı | Pin sayfası screenshot |
| Renk paleti | Board screenshot → görsel analiz |
| Siluet trendi | Board screenshot → AI analiz |

### Trendyol
| Veri | Yöntem |
|---|---|
| Fiyat | Ürün sayfası screenshot → OCR |
| Yorum sayısı | Yorum alanı screenshot |
| Yorum artışı | Zamanlı screenshot farkı |
| Stok durumu | Beden seçenekleri screenshot |
| Stok erime | Zamanlı screenshot karşılaştırma |
| Satıcı sayısı | Arama listesi screenshot |
| "Çok satan" rozet | Ürün sayfası screenshot |
| Favori sayısı | Ürün sayfası screenshot |

### Google Trends
| Veri | Yöntem |
|---|---|
| Arama hacmi | Grafik screenshot → değer okuma |
| Trend yönü | Grafik analizi |
| Bölgesel yoğunluk | Harita screenshot |
| İlgili aramalar | Sonuç sayfası screenshot |

### Meta Ad Library
| Veri | Yöntem |
|---|---|
| Reklam sayısı | Arama sonucu screenshot |
| Reklam süresi | Reklam detay screenshot |

---

## YASAL SINIRLAR

| İzin Verilen ✔ | Yasak ❌ |
|---|---|
| Kamuya açık web sayfası gözlemi | API izinsiz kullanım |
| Screenshot alıp AI ile okuma | Site veritabanını çekme |
| Resmi API'ler (izinli) | Telifli görselleri arşivleme |
| Kullanıcının kendi yüklediği veri | Kişisel veri işleme (KVKK/GDPR) |
| Analiz sonucu kaydetme | Başkasının verisini kopyalama |

---

## KAYIT FORMATINI (Her Ürün İçin)

```json
{
  "urun_tipi": "oversize hoodie",
  "kategori": "streetwear",
  "renk": "stone grey",
  "fiyat_bandi": "400-600 TL",
  "trend_buyume": "%18",
  "platform": "trendyol",
  "kaynak_turu": "gozlem",
  "tarih": "2026-04-04"
}
```

> Görsel veya sayfa verisi sisteme çekilmez. Sadece analiz sonucu kaydedilir.

---

## HİBRİT MALİYET MODELİ

| İşlem | Yöntem | Maliyet |
|---|---|---|
| Normal veri (%80) | JSON/API/OCR | Düşük/Ücretsiz |
| Görsel analiz (%20) | Vision AI (Gemini/CLIP) | Sadece kritik anlarda |

> Sürekli AI kullanımı = pahalı. AI sadece son kontrol için kullanılır.
