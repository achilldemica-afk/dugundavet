# Banu & Barış - Düğün Davetiyesi

Kır temalı, çiçekli/yeşilli, elegant HTML düğün davetiyesi.

## Özellikler

- Geri sayım sayacı
- RSVP formu (Google Sheets'e kaydeder)
- Google Maps konum
- Takvime ekle (Google Calendar / Apple / Outlook)
- Arka plan müziği (A Thousand Years - Christina Perri)
- Scroll animasyonları & konfeti efekti
- Tam responsive (mobil uyumlu)

---

## Kurulum

### 1. Müzik Dosyası

`assets/music/` klasörüne `a-thousand-years.mp3` dosyasını ekleyin.

> Bu dosyayı telif hakları nedeniyle repo'ya ekleyemiyoruz. Kendi MP3 dosyanızı temin edip `assets/music/a-thousand-years.mp3` olarak kaydedin.

### 2. Google Sheets Entegrasyonu

#### Adım 1: Google Sheets oluşturun
1. [Google Sheets](https://sheets.google.com)'e gidin
2. Yeni bir boş tablo oluşturun
3. Tabloya "Düğün RSVP" adını verin

#### Adım 2: Apps Script'i kurun
1. Tabloda **Extensions > Apps Script** seçin
2. Açılan editörde varsayılan kodu silin
3. `google-apps-script.js` dosyasının içeriğini yapıştırın
4. **Ctrl+S** ile kaydedin

#### Adım 3: Başlıkları otomatik oluşturun
1. Apps Script editöründe fonksiyon listesinden `setupHeaders` seçin
2. **Çalıştır** butonuna tıklayın
3. İzin isterse Google hesabınızla izin verin
4. Sheets'e dönüp başlıkların oluştuğunu kontrol edin

#### Adım 4: Web App olarak deploy edin
1. Apps Script editöründe **Deploy > New deployment** seçin
2. Sol üstte dişli ikonuna tıklayıp **Web app** seçin
3. Ayarlar:
   - **Description:** Düğün RSVP
   - **Execute as:** Me
   - **Who has access:** Anyone
4. **Deploy** butonuna tıklayın
5. Çıkan **Web app URL**'yi kopyalayın

#### Adım 5: URL'yi projeye ekleyin
1. `js/script.js` dosyasını açın
2. `googleScriptURL` satırını bulun:
   ```javascript
   googleScriptURL: 'BURAYA_GOOGLE_APPS_SCRIPT_URL_YAPISTIRIN',
   ```
3. URL'yi yapıştırın:
   ```javascript
   googleScriptURL: 'https://script.google.com/macros/s/XXXXXXX/exec',
   ```

### 3. Google Maps (Opsiyonel)

Harita iframe'ini güncellemek isterseniz:
1. [Google Maps](https://maps.google.com)'te mekanı bulun
2. **Paylaş > Haritayı yerleştir** seçin
3. Çıkan iframe kodundaki `src` URL'sini kopyalayın
4. `index.html` dosyasındaki iframe `src`'yi değiştirin

### 4. GitHub Pages ile Yayınlama

```bash
# Repo oluştur
cd dugundavet
git init
git add .
git commit -m "Düğün davetiyesi ilk sürüm"

# GitHub'da yeni bir repo oluşturup push edin
git remote add origin https://github.com/KULLANICI_ADINIZ/dugundavet.git
git branch -M main
git push -u origin main
```

GitHub'da:
1. Repo **Settings > Pages** bölümüne gidin
2. **Source:** Deploy from a branch
3. **Branch:** main, / (root)
4. **Save** tıklayın
5. Birkaç dakika sonra siteniz yayında: `https://KULLANICI_ADINIZ.github.io/dugundavet/`

---

## Dosya Yapısı

```
dugundavet/
├── index.html                 # Ana sayfa
├── css/
│   └── style.css              # Tüm stiller
├── js/
│   └── script.js              # Geri sayım, form, müzik, animasyonlar
├── assets/
│   ├── music/
│   │   └── a-thousand-years.mp3  # (Kendiniz ekleyin)
│   └── images/
├── google-apps-script.js      # Google Sheets kodu (kopyalanacak)
└── README.md                  # Bu dosya
```

---

## Özelleştirme

- **Renkler:** `css/style.css` dosyasında `:root` altındaki CSS değişkenlerini değiştirin
- **İsimler/Tarih:** `index.html` ve `js/script.js` dosyasındaki bilgileri güncelleyin
- **Fontlar:** Google Fonts linklerini ve CSS değişkenlerini değiştirin

---

## Test

Lokal olarak test etmek için:
```bash
# Python ile basit sunucu
python3 -m http.server 8000

# Veya Node.js
npx serve .
```

Tarayıcıda `http://localhost:8000` adresini açın.
