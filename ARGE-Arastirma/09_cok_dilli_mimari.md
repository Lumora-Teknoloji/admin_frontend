# 09 - Çok Dilli Mimari (i18n / RTL)

---

## ANA KURAL (Kullanıcının Sözleri)

> Yapacağımız bütün sistemler, bütün her şey, teknolojik her şey, panel, sistem her şey, ana dili Türkçe olacak, ikinci dili Arapça olacak, çok dilli dillere çevrilebilecek kapasitede olacak. Hepsi panelimizde, sistemimizde her noktada.

> Çünkü biz, ben Türk'üm. Türkiye'de çalışıyorum, önce kendi işletmemde kullanacağım. Kendi işletmemde Türk ve Araplarla beraber çalışıyorum. Onun için ana dilimiz Türkçe, ikinci dilimiz, iki tane ana dilimiz var. Türkçe ve Arapça. Panel bu mantıkta kurulacak.

> Biliyorsun Türkiye soldan başlıyor, Arapça sağdan başlıyor. Her şeyi yaparken bu mantıkta yapacağız. Sonradan yama, düzeltme, izole söz konusu olmayacak.

---

## GENİŞLEME KAPASİTESİ (Kullanıcının Sözleri)

> Ama sistemin çok dilliye çevrilebilecek mimaride olacak. Türkçe, Arapça ilk etapta oluşacak, sonra istenilen diller ilave edilebilecek mantıkta olacak.

> Türkçe, Arapça var. Bu kesin. İngilizce, Afganca, Endonezya, Çince, Japonca ya da örnek diyorum, Almanca, Bulgarca, her dile hitap edebileceğimiz mimari ve altyapıda olacak.

> Adam diyelim ki Bulgaristan'da sistemi kullanmak istiyor. İlerleyen. Galiba tek başına çalışıyordu karısı, çoluk çocuğuyla. E bu adam nasıl anlayacak?

---

## KURAL (KESİN)

- TR + AR zorunlu
- Sınırsız dil eklenebilir (EN, BG, ZH, JA, ID, vb.)
- Kod değişmeden dil eklenir

---

## TEKNİK MİMARİ

### KAYNAK = TRANSLATION KEY

UI/Backend: `t("task_create")`

Dil dosyası:
```json
{
  "task_create": {
    "tr": "Görev oluştur",
    "ar": "إنشاء مهمة",
    "en": "Create task",
    "bg": "Създай задача"
  }
}
```

### VERİTABANI:
```
TABLO: i18n_keys
- key (unique)

TABLO: i18n_translations
- key_id
- locale (tr, ar, en, bg…)
- value
```

---

## RTL / LTR MOTORU

```
locale_map:
- tr → ltr
- ar → rtl
- en → ltr
- bg → ltr

UI:
dir = locale_map[locale]
```

---

## FRONTEND (Next.js)

Route yapısı:
```
/tr
/ar
/en
/bg
```

Config:
- locale detect
- direction auto (ltr/rtl)

---

## BACKEND

```
Header:
Accept-Language: tr | ar | en | bg

Response:
- seçilen dile göre döner
```

---

## TELEGRAM BOT

```
user_profile:
- user_id
- locale

bot:
- cevap → locale'e göre
```

---

## YENİ DİL EKLEME (KOD DEĞİŞMEZ)

1) DB'ye yeni locale ekle (örn: de)
2) çeviri gir
3) sistem otomatik kullanır

---

## ZORUNLU GELİŞTİRME KURALI

- hardcoded text YASAK
- tüm text → key üzerinden
- eksik çeviri → sistem hata verir

### YANLIŞ:
```
"Görev oluştur"
```

### DOĞRU:
```
t("task_create")
```

---

## TASARIM KURALI

- ikonlar yön bağımsız
- buton yerleri dinamik
- padding / margin rtl uyumlu

---

## TEST

Her ekran:
- TR test
- AR test
- RTL bozulma kontrolü zorunlu
- yeni dil fallback kontrol

---

## PERFORMANS

- cache (Redis)
- sık kullanılan diller RAM'de

---

## TÜM KATMANLAR (ZORUNLU)

- frontend
- backend
- database
- log sistemi
- telegram bot

→ Hepsi i18n destekli olacak
