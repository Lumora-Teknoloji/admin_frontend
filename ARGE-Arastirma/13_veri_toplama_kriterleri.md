# 13 - Veri Toplama Kriterleri (Platform Bazlı)

---

## TEMEL FELSEFE

```
Sistem 4 ekseni izler:
TREND → TASARIM → ÜRETİM → SATIŞ

Her eksen için farklı veri kaynağı, farklı kriter listesi gerekir.
```

---

## YASAL VERİ POLİTİKASI (DEĞİŞMEZ)

| İzin Verilen | Yasak |
|---|---|
| Kamuya açık web sayfası gözlemi | İzinsiz scraping / veri çekme |
| Resmi API'ler (platform izinli) | Telifli görsel kopyalama |
| Kullanıcının kendi yüklediği veri | Kişisel veri işleme (KVKK/GDPR) |
| Anonimleştirilmiş iç satış verisi | Başkasının DB'sini çekme |

**Kayıt:** Her veri için `source, izin_turu, timestamp` tutulur.

**Yöntem:** Competitive Intelligence — gözlem, analiz, yorum. Veri kopyalama değil.

---

## EKSEN 1: TREND (Ne Üretilecek?)

### TRENDYOL — 18 Kriter
| # | Kriter | Ne Veri Verir |
|---|---|---|
| 1 | Ürün adı | Ürün kimliği |
| 2 | Marka / satıcı | Rekabet bilgisi |
| 3 | Fiyat (güncel) | Fiyat segmenti |
| 4 | İndirim oranı | Stok eritme sinyali |
| 5 | Değerlendirme puanı | Müşteri memnuniyeti |
| 6a | Toplam yorum sayısı | Satış hacmi tahmini |
| 6b | Fotoğraflı yorum sayısı | Gerçek kullanım verisi |
| 6c | 5 yıldız oranı | Genel memnuniyet |
| 6d | 1-2 yıldız tema analizi | Üretim hata sinyali |
| 7 | Satış adedi rozeti | Satış büyüklüğü |
| 8 | Favoriye ekleme sayısı | Talep sinyali |
| 9 | Ana + alt kategori | Pazar segmenti |
| 10 | Kumaş/materyal | Üretim uygunluğu |
| 11a | Renk bazlı favori dağılımı | Renk trend verisi |
| 11b | Renk bazlı yorum analizi | Kalite/renk problemi |
| 12 | Beden + tükenen beden | Talep dağılımı |
| 13 | Kargo hızı | Satıcı profili |
| 14 | Trend etiketi (rozet) | Platform sinyali |
| 15 | Benzer ürün sayısı | Rekabet yoğunluğu |
| 16 | Ürün fotoğrafı (URL ref) | Görsel referans |
| 17 | Açıklama (ilk 300 kar.) | Ürün detayı |
| 18 | İade politikası | Gizli risk |

### INSTAGRAM — 8 Kriter
| # | Kriter |
|---|---|
| 1 | Hashtag toplam kullanım |
| 2 | Son 24 saat hashtag artışı |
| 3 | En çok beğeni alan 5 gönderi |
| 4 | Video/Reels izlenme |
| 5 | Bahsedilen ürün/marka |
| 6 | Lokasyon (TR içi mi?) |
| 7 | Influencer paylaşımı mı? |
| 8 | Ürün etiketi (shopping tag) var mı? |

### TIKTOK — 6 Kriter
| # | Kriter |
|---|---|
| 1 | Video izlenme sayısı |
| 2 | Beğeni/yorum oranı |
| 3 | Ürün adı mention sayısı |
| 4 | Viral ses/müzik kullanan trend |
| 5 | Review video sayısı |
| 6 | Küçük hesap büyük viral = erken trend |

### GOOGLE TRENDS — 5 Kriter
| # | Kriter |
|---|---|
| 1 | Aylık arama hacmi |
| 2 | Hacim trendi (yükseliş/düşüş) |
| 3 | Coğrafi yoğunluk |
| 4 | İlgili aramalar |
| 5 | Sezonluk desen |

### RAKİP İZLEME (Zara/H&M/Mango) — 5 Kriter
| # | Kriter |
|---|---|
| 1 | Yeni koleksiyona eklenen ürün sayısı |
| 2 | Fiyat aralığı |
| 3 | Öne çıkan renk |
| 4 | Kullanılan materyal |
| 5 | İndirim (eski koleksiyon boşaltıyor mu?) |

---

## EKSEN 2: TASARIM (Nasıl Görünecek?)

### PINTEREST — 5 Kriter
| # | Kriter |
|---|---|
| 1 | Trend board'lardaki renk paleti |
| 2 | En çok kaydedilen desen |
| 3 | Siluet trendi (bol/dar, uzun/kısa) |
| 4 | Detay trendi (volan, apolet vb.) |
| 5 | Sezon rengi (Pantone uyumu) |

### KENDİ ARŞİV — Kumaş & Aksesuar
- Tasarımcı sisteme sorar → "Kırmızı pamuklu kumaşımız var mı?"
- Sistem görsel + stok bilgisi döner

---

## EKSEN 3: ÜRETİM (Nasıl Yapılacak?)

### KENDİ SİSTEM — 7 Kriter
| # | Kriter |
|---|---|
| 1 | Hangi model üretimde |
| 2 | Hangi aşamada (Kalıp/Kesim/Dikiş/Bitti) |
| 3 | Gecikme süresi |
| 4 | Fire/hata oranı |
| 5 | Personel bant atama |
| 6 | Günlük üretim vs hedef |
| 7 | Makine arıza durumu |

### TEDARİKÇİ — 4 Kriter
| # | Kriter |
|---|---|
| 1 | Kumaş fiyatı değişimi |
| 2 | Stok durumu |
| 3 | Teslimat tarihi |
| 4 | Minimum sipariş miktarı |

---

## EKSEN 4: SATIŞ (Ne Kadar Sattı?)

### TRENDYOL SATICI PANELİ — 8 Kriter
| # | Kriter |
|---|---|
| 1 | Günlük sipariş adedi |
| 2 | Günlük ciro |
| 3 | İade sayısı/oranı |
| 4 | En çok satan model |
| 5 | En çok iade edilen model |
| 6 | Reklam harcaması vs sipariş |
| 7 | Müşteri yorum tema analizi |
| 8 | Stok tükenme hızı |

### KENDİ SİSTEM — 4 Kriter
| # | Kriter |
|---|---|
| 1 | Nakit akışı (giren/çıkan) |
| 2 | Ödeme bekleyen siparişler |
| 3 | Teslim edilen siparişler |
| 4 | Kâr marjı (satış − maliyet) |
