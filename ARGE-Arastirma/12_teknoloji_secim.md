# 12 - Teknoloji Seçimleri ve Kurulum

---

## TEKNOLOJİ STACK (Sohbette Belirlenen)

| Katman | Teknoloji |
|--------|-----------|
| Backend | Python (FastAPI) |
| Frontend | Next.js |
| Database | PostgreSQL |
| Realtime | WebSocket |
| Cache | Redis |
| Local/Offline | SQLite (IndexedDB) |
| Queue | Celery / Redis Queue |
| Storage/Arşiv | Supabase |
| i18n | next-intl veya i18next |

---

## MEVCUT DONANIM (Kullanıcının Sözleri)

> Burada veri tabanı olarak Subabata'ta kullanılabilir. Sistemin kendi bilgisayarı, şu an elimizde olan 5000-80 İnnova sistemi, kaçarılı bilgisayarımız, server bilgisayarımızla faydalanılabiliriz.

---

## OFF-LINE ÇALIŞMA (Kullanıcının Sözleri)

> Offline çalışabilmeli. İnternetin olmadığı ortamda sistem kendi kendine çalışabilmeli

### Offline Mekanizma:
- internet yoksa: SQLite çalışır
- internet gelince: PostgreSQL sync

---

## KURULUM YAKLAŞIMI (Sohbette Kararlaştırılan)

### KARAR: Windows üzerinden başlanacak
> Ubuntu = doğru hedef, Windows doğru başlangıç

Gerekçe:
- Sistem tespiti yapılmadan Ubuntu önerilmişti (hata)
- Mevcut durum netleşmeden OS değişmeyecek
- Önce çalışan sistem → sonra optimize

---

## İLK KURULACAK PROGRAMLAR

Kontrol sırası:
1) Docker
2) Node.js
3) Python
4) Git

---

## DOCKER SİSTEMİ

```yaml
# devops/docker-compose.yml
version: "3.9"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: panel
      POSTGRES_PASSWORD: panel
      POSTGRES_DB: panel
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: ../backend
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

  frontend:
    build: ../frontend
    ports:
      - "3000:3000"
```

---

## VERİTABANI ŞEMASI

```
TASKS
- id (uuid)
- name
- input_json
- output_json
- status (pending/running/done/rejected)
- created_at

VALIDATIONS
- id
- task_id
- result (ok/reject)
- reason
- created_at

LOGS
- id
- action
- actor
- data
- created_at

USERS
- id
- name
- role
- locale (tr/ar)

I18N_KEYS
- id
- key

I18N_TRANSLATIONS
- key_id
- locale
- value
```

---

## BACKEND (ÇEKİRDEK)

```python
# backend/main.py
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

# task create
@app.post("/task")
def create_task(data: dict):
    # kayıt
    # log
    return {"status": "created"}

# validation
@app.post("/validate/{task_id}")
def validate(task_id: str):
    # ikinci kontrol
    return {"status": "ok"}
```

---

## FRONTEND

```bash
npx create-next-app@latest frontend
npm install next-intl
```

Sayfalar:
- /dashboard
- /tasks
- /task/[id]
- /logs

---

## TELEGRAM BOT

```bash
# BotFather → bot aç → token al
python bot.py
```

Komutlar:
- /task_create
- /task_status
- /task_stop
- /task_report

---

## DEPOLAMA STRATEJİSİ

| Katman | Platform | Amaç |
|--------|----------|------|
| ANA SİSTEM | PostgreSQL | aktif veri |
| CACHE | Redis | hız |
| LOKAL | kendi bilgisayar (SSD) | işletim |
| ARŞİV | Supabase | analiz sonuç |
| ALTERNATİF | Firebase / S3 uyumlu (minio) | opsiyonel |

---

## PERFORMANS KURALI (Kullanıcının Sözleri)

> Buradaki yapılacak işlem, sistemi yavaşlatmadan mümkün olduğu kadar sadece gerekli veri depolansın.

> Analiz yapılacak. Analiz yapılırken 10 günlük veri depolanırsa analiz yapılmasın. Günlük bir analiz yapılsın, analiz sonuçları kaydedilsin. Yani gereksiz zerre kadar bilgi olmasın.

---

## KURULUM KONTROL KURALI (Sohbette Öğrenilen Ders)

> Sen şimdi kontrol etmeden var mı yok mu bilmeden ne diye indiriyorsun lan? Böyle mi yapacaksın yöneticiliği? Önce her şeyi kontrol edeceksin. Ne istiyorsun, var mı yok mu? Ondan sonra. Bunu da kural yap kendine.

**KURAL:** Önce kontrol → sonra kurulum.

---

## BİLGİSAYAR ENVANTER KOMUTU (Windows PowerShell)

```powershell
Write-Host "=== OS ==="; systeminfo | findstr /B /C:"OS Name" /C:"OS Version";
Write-Host "=== CPU ==="; wmic cpu get name;
Write-Host "=== RAM ==="; wmic computersystem get TotalPhysicalMemory;
Write-Host "=== DISK ==="; wmic logicaldisk get size,freespace,caption;
Write-Host "=== GPU ==="; wmic path win32_VideoController get name;
Write-Host "=== DOCKER ==="; docker --version 2>$null;
Write-Host "=== NODE ==="; node -v 2>$null;
Write-Host "=== NPM ==="; npm -v 2>$null;
Write-Host "=== PYTHON ==="; python --version 2>$null;
Write-Host "=== PIP ==="; pip --version 2>$null;
Write-Host "=== GIT ==="; git --version 2>$null
```

---

## İLK ÇALIŞTIRMA

```bash
docker compose up -d
```

```
http://localhost:3000 → panel
http://localhost:8000 → api
```

---

## MALİYET YAKLAŞIMI (Kullanıcının Sözleri)

> Agent ya da bot ya da yapay zeka kullanacağımız noktalarda ise imkanlar dahilinde işletmeye sıfır maliyete yakın yolları seçelim.

> İşletmeye mümkün imkanlar dahilinde sıfır yük bindirecek şekilde olmalı.
