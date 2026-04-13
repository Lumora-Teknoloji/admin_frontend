# 17 - Veri Modeli ve DB Şeması (AR-GE)

---

## VERİ STANDARDI

Her ürün için şu alanlar **zorunlu** kaydedilir:

| Alan | Tip | Açıklama |
|---|---|---|
| product_id | TEXT (PK) | Benzersiz ürün kimliği |
| product_name | TEXT | Ürün adı |
| category | TEXT | Kategori (kadın giyim, streetwear vb.) |
| product_type | TEXT | Ürün tipi (hoodie, elbise vb.) |
| fabric | TEXT | Kumaş türü |
| color | TEXT | Renk |
| price | FLOAT | Fiyat |
| price_range | TEXT | Fiyat segmenti (düşük/orta/yüksek) |
| source | TEXT | Kaynak (trendyol, zara, instagram vb.) |
| izin_turu | TEXT | Veri alım yöntemi (gözlem/API/kullanıcı) |
| comment_count | INT | Yorum sayısı |
| sales_signal | FLOAT | Satış büyüme sinyali |
| social_growth | FLOAT | Sosyal medya büyüme oranı |
| trend_score | FLOAT | Hesaplanan trend skoru |
| risk_score | FLOAT | Hesaplanan risk skoru |
| decision | TEXT | Karar (ÜRET/TEST/BEKLE/RED) |
| timestamp | TIMESTAMP | Kayıt zamanı |

---

## TABLO YAPISI (PostgreSQL)

```sql
-- Ürün kimliği
CREATE TABLE products (
    product_id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT,
    product_type TEXT,
    brand TEXT,
    source TEXT,
    izin_turu TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ham veri (temizlenmemiş)
CREATE TABLE raw_data (
    id SERIAL PRIMARY KEY,
    product_id TEXT REFERENCES products(product_id),
    price FLOAT,
    comment_count INT,
    sales_signal FLOAT,
    social_growth FLOAT,
    fabric TEXT,
    color TEXT,
    ts TIMESTAMP DEFAULT NOW()
);

-- Temiz veri
CREATE TABLE cleaned_data (
    id SERIAL PRIMARY KEY,
    product_id TEXT REFERENCES products(product_id),
    price FLOAT,
    comment_count INT,
    sales_signal FLOAT,
    social_growth FLOAT,
    fabric TEXT,
    color TEXT,
    ts TIMESTAMP DEFAULT NOW()
);

-- Feature tablosu (40+ sütun)
CREATE TABLE features (
    product_id TEXT REFERENCES products(product_id),
    price_change FLOAT,
    comment_growth FLOAT,
    sales_momentum FLOAT,
    social_velocity FLOAT,
    rank_position INT,
    -- ... diğer feature'lar
    ts TIMESTAMP DEFAULT NOW()
);

-- Tahmin sonuçları
CREATE TABLE predictions (
    product_id TEXT REFERENCES products(product_id),
    trend_score FLOAT,
    risk_score FLOAT,
    opportunity_score FLOAT,
    label TEXT, -- ÜRET/TEST/BEKLE/RED
    ts TIMESTAMP DEFAULT NOW()
);

-- Üretim kararları
CREATE TABLE decisions (
    product_id TEXT REFERENCES products(product_id),
    decision TEXT,
    quantity INT,
    cost_estimate FLOAT,
    reason TEXT,
    ts TIMESTAMP DEFAULT NOW()
);

-- Sistem logları
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    module TEXT,
    step TEXT,
    input_count INT,
    output_count INT,
    status TEXT,
    error TEXT,
    ts TIMESTAMP DEFAULT NOW()
);
```

---

## VERİ AKIŞ PIPELINE

```
raw_data → validation → cleaned_data → features → predictions → decisions
                                                        ↑
                                                   satış feedback
```

---

## VERİ BANKASI HEDEFİ

| Süre | Hedef |
|---|---|
| Günlük | 200–300 ürün analiz |
| Aylık | 6.000+ veri |
| Yıllık | 70.000+ ürün verisi |
| 6 ay sonra | Trend tahmini öğrenmeye başlar |
| 12 ay sonra | Tahmin doğruluğu ciddi artar |
