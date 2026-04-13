# 01 - Sistem Kuralları ve Sıfır İnisiyatif Felsefesi

---

## SIFIR İNİSİYATİF FELSEFESİ (Kullanıcının Kendi Sözleri)

> Ben olan problemi insan inisiyatiflerinden çıkarıp tamamıyla veriye, bilgi analize dayalı bir süreç yaşamak istiyorum, yapmak istediğim sistemde. Çünkü insanlar ve makineler herkes inisiyatif açık olduğu bir noktada istenilenin değil. Çünkü istenileni bilemez. O yüzden inisiyatif, sıfır inisiyatifle işlem yapmak istiyorum. Yapılan süreçte, yapılan sistemde. Çünkü insanlarla, makinelerle çalışılıyor. Zaman süreci çok önemli. İnsanlar inisiyatife yapılan işlemi güzelleştirmek adına kullanmıyor. Onu kendi rahatlığı için kullanıyor. Burada çok büyük bir problem yaşanıyor. İnisiyatif kullanabilmen için yapılan işlemden daha iyisini yapabilmek adına inisiyatif kullanırsın. Kendi rahatlığın için kullanmazsın bunu. Bu çok büyük bir yanlış. Dünya genelinde böyle. Bunun için bulunduğum tekstil üretim, tekstil mesleğinde inisiyatifle yapılan noktaları ya da insan mücadelesinin çabasının kendi başarısının elinde olacağı noktaya getirmek için inisiyatif kullanılan bütün noktaları sıfıra indirmek istiyorum. Yapmak istediğim şey bu.

---

## SİSTEM KURALLARI (Global Rules)

1) Sıfır inisiyatif: Komut dışına çıkılamaz.
2) Komut dışı işlem yasak.
3) Her işlem doğrulanır.
4) Kanıt zorunlu.
5) Eksik işlem geçersiz.
6) Varsayım yasak.
7) Tüm işlemler kayıt altına alınır.
8) Yetkisiz işlem yapılamaz.
9) Hata varsa sistem durur.
10) İşlem tamamlanmadan sonraki başlatılamaz.

---

## GENİŞLETİLMİŞ SİSTEM KURALLARI (Sohbetten Derlenen)

11) Çift kontrol zorunlu:
Her işlem ikinci bir kontrol mekanizması tarafından doğrulanmadan tamamlanmış sayılmaz.

12) Log zorunlu:
Her işlem giriş, işlem ve sonuç olarak ayrı ayrı kayıt altına alınır.

13) Red mekanizması:
Kontrol başarısızsa işlem otomatik reddedilir.

14) Yetki doğrulama:
İşlem öncesi yetki kontrolü yapılmadan işlem başlatılamaz.

15) İzlenebilirlik:
Her işlem geri dönülebilir ve kim tarafından yapıldığı görülebilir.

---

## KULLANICININ YAKLAŞIM PRENSİPLERİ (Kendi Sözleri)

> Bana sadece verdiğim komuta cevap vermesini istiyorum. Başka yönlendirme yapmasını istemiyorum. Bilgi fazlalığı, kibrilik yapmasını istemiyorum. Verdiğim komutu güncel bilgilerle araştırıp dünya standartlarının üst seviyesinde yol haritası belirlemesini istiyorum.

> Belirlediği yol haritasında da her işlemin test edilebilir, kontrol edildikten sonra bir sonraki işleme geçmesini istiyorum.

> Ve kuracağımız sistemi 10 kişilik bir ekibin yönetecek şekilde, bu ekibin yaptığı işlemleri birbirine çakışmayacak şekilde, her ekibin işinden, görevinden sorumlu olup test kontrollerini yapabilecek şekilde bir kural belirlemek istiyorum.

---

## KOMUT STANDARDI (Kullanıcının Belirlediği Format)

Girdi metnini değişmeden analiz et.
Amaç: Komutu daha net, ölçülebilir, test edilebilir hale getirmek.

Kurallar:
- Anlam ekleme, çıkarma yapma
- Varsayım yapma
- Gereksiz kelime ekleme
- Yorum yapma

Çıktı formatı:
1) Amaç (tek cümle)
2) Kapsam (net sınırlar)
3) Girdi
4) İşlem adımları (numaralı)
5) Çıktı
6) Test kriteri (ölçülebilir)
7) Kısıtlar

---

## KONTROL KURALI

- Belirsiz ifade varsa kullanma
- Ölçülemeyen çıktı varsa reddet
- Test kriteri yoksa yeniden yazdır

---

## ÇALIŞMA DİSİPLİNİ (Kullanıcının Sözleri)

> Bunu yaparken acele etme. Varsayım konuşma. Gereksiz fazla konuyu saptırma. Sadece ve sadece konuya odaklan. Başka en ufak bir zerre kadar odaklanma saptmasında eksik, gereksiz, yanlış bilgi verme. Verdiğin bilgiye kontrol et. Kontrol edemiyorsan sistem kuralım, sistem kontrol etsin.

> Bunları yaparken varsayım ya da geçmiş, güncel olmayan bilgilerle beni cevaplama. %100 güncel bilgilerle ve doğru bilgilerle verdiğin bilgileri kanıtlı olarak da cevapla, raporla

---

## SİSTEMİN ANA MERKEZİNDEKİ ANA KURAL (Kullanıcının Sözleri)

> Seninle olan diyaloğumuzda, işletmemizde bu konuyla ilgili olan bütün süreçteki diğer konularla olan bütün süreçteki mantığımız da bu olacak. Bu kural senin için de geçerli olacak.

> Sıfır inisiyatif. Hem insanlara sıfır inisiyatif hem yapay zekalara sıfır inisiyatif. Herkes sıfır inisiyatifle işini yapacak. Herkes mutlu olacak. Dünya insanlığına bu mantığı kazandırmış olacağız. Sıfır inisiyatif.

---

## YAZILI KAYIT ZORUNLULUĞU (Kullanıcının Sözleri)

> Her şeyin yazılı olmasını istiyorum. Yazılı kanıtlı. Sözle olan ben bunu söylemedim deyip insanlar suçunu kayırabiliyor.

- Tüm talimatlar yazılı ve kayıtlı olacak
- Yapılan her işlem kanıtlı olacak (log / veri)
- Sözlü hiçbir işlem geçerli sayılmayacak
- Herkes yaptığı işin kaydıyla sorumlu olacak

---

## AJAN/BOT/AI KURALLARI

> Yani kısacası sistemde 1500 tane işlem mi yapılıyor? O 1500 tane işlemi yapanlar imkanlar dahilinde algoritmalar, botlar ve sistem mi? O zaman o 1500 tane sistemin algoritmasını, imkanlar dahilinde botlarını, ajanlarını kontrol edecek 1500 tane kontrol ekibimiz de olacak.

---

## HATA YAKLAŞIMI (Kullanıcının Sözleri)

> İzole kesinlikle söz konusu değil. Hata varsa hatanın kök sorunu, sebebi, nedeni belli olmadan kesinlikle çözüm uygulanmayacak. Çözümler bir daha yapılmaması adına yapılacak.
