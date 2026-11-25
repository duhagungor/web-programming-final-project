# Pastel Mutfak • Resimli Pastel Tarif Defteri
> **HTML5, CSS3 ve Vanilla JavaScript kullanılarak geliştirilmiş, duyarlı ve etkileşimli dijital tarif defteri.**

---

## Canlı Yayın ve Depo Bağlantıları
* **Canlı Site: https://duhagungor.github.io/web-programming-final-project/
* **GitHub Deposu: https://github.com/duhagungor/web-programming-final-project

---

## 1. Amaç ve Konsept
**Pastel Mutfak**, geleneksel yemek sitelerindeki reklam karmaşasından ve göz yoran tasarımlardan uzak; **yumuşak pastel tonları (soft aesthetic)** ve **sevimli el çizimi illüstrasyonları** mutfak sanatıyla buluşturan çok sayfalı bir dijital tarif defteridir.

Tüm tatlılar, kahvaltılıklar, çorbalar ve ana yemekler özel pastel vektörel çizimlerle görselleştirilmiş; kullanıcıların aradıkları tarifi anında bulabilmeleri, favorilerine kaydedebilmeleri ve kendi özel tariflerini atölyeye gönderebilmeleri için gelişmiş dinamik özelliklerle donatılmıştır.

---

## 2. Sayfaların Kısa Açıklaması

| Sayfa | Dosya | Açıklama |
|---|---|---|
| **Ana Sayfa** | `index.html` | Ziyaretçiyi karşılayan interaktif hero alanı, pastel şef illüstrasyonu, hızlı kategori rozetleri, `data/recipes.json`'dan dinamik çekilen **Haftanın Öne Çıkan Tarifleri**, mutfak ilkeleri ve bülten aboneliği bölümü. |
| **Tarifler Defteri** | `tarifler.html` | 9 adet zengin tarifin listelendiği katalog. Anlık arama çubuğu (`input`), kategori butonları, **sadece favorileri göster** filtresi, sıralama seçenekleri, skeleton/loading spinner, hata kutusu ve kartlara tıklandığında açılan zengin **Tarif Detay Modalı**. |
| **Tarif Gönder & İletişim** | `iletisim.html` | İki kolonlu duyarlı düzen. Sol tarafta pastel illüstrasyon, atölye adres bilgileri ve SSS; sağ tarafta ise `localStorage` tabanlı **otomatik form taslağı kaydetme**, HTML5 + JS doğrulama (`preventDefault`), anlık hata temizleme ve başarılı gönderim bildirimi sunan kapsamlı tarif formu. |

---

## 3. Teknik Gereksinimlerin Karşılandığı Dosya ve Satır Haritası

Aşağıdaki tablo, şartnamede istenen tüm asgari ve artı puan getiren teknik gereksinimlerin projede **hangi dosyada ve kaçıncı satırda** yer aldığını doğrulanabilir şekilde listelenmekte:

### A. HTML Katmanı
| Gereksinim | Karşılandığı Dosya | Satır Numarası | Açıklama |
|---|---|---|---|
| **En az 3 ayrı sayfa** | `index.html`, `tarifler.html`, `iletisim.html` | - | Ana Sayfa, Tarifler Kataloğu ve İletişim sayfaları |
| **Ortak Gezinme Menüsü** | Tüm HTML sayfaları (`<header>`, `<nav>`) | `index.html`: L21-66<br>`tarifler.html`: L21-66<br>`iletisim.html`: L21-66 | Logo, sayfa linkleri, gece modu butonu ve favori sayacı |
| **Anlamsal Etiketler** | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<aside>`, `<footer>` | `index.html`: L21, L29, L72, L75, L118, L200, L311<br>`iletisim.html`: L87, L90, L142 | Tam semantik HTML5 standartlarına uygun yapı |
| **Meta Viewport** | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | Tüm HTML dosyaları: Satır 4 | Mobil uyumluluk meta etiketi |
| **Doğrulama Nitelikli Form** | `iletisim.html` (`<form id="recipe-contact-form">`) | `iletisim.html`: L156-225 | `required`, `type="email"`, `minlength="3"`, `minlength="15"`, `autocomplete` |
| **Anlamlı Alt Metinleri** | Tüm `<img>` ve `<svg>` etiketleri | `index.html`: L25, L119, L259<br>`tarifler.html`: L25, L157<br>`iletisim.html`: L25, L93 | Her çizim için detaylı ve ekran okuyucu uyumlu açıklama |

---

### B. CSS Katmanı (`css/style.css`)
| Gereksinim | Karşılandığı Dosya | Satır Numarası | Açıklama |
|---|---|---|---|
| **Tek Harici Stil Dosyası** | `css/style.css` | 1 - 1845 | Tüm sayfalara bağlanan tek kapsamlı stil dosyası |
| **CSS Değişkenleri (`:root`)** | `css/style.css` | Satır 13 - 69 | Pastel renk paleti, tipografi, yuvarlak köşeler ve gölgeler |
| **Koyu / Gece Pastel Modu** | `css/style.css` (`body.dark-theme`) | Satır 75 - 98 | Gözü yormayan yumuşak koyu pastel zeminler ve açık metinler |
| **CSS Grid Kullanımı** | `css/style.css` | Satır 459 (`.hero-grid`),<br>Satır 577 (`.recipes-grid`),<br>Satır 673 (`.features-grid`),<br>Satır 1048 (`.contact-layout-grid`),<br>Satır 1197 (`.form-row-2col`),<br>Satır 1343 (`.footer-grid`) | Responsive grid kolonları ve otomatik kart yerleşimi |
| **Flexbox Kullanımı** | `css/style.css` | Satır 231 (`.header-container`),<br>Satır 280 (`.nav-menu`),<br>Satır 308 (`.header-actions`),<br>Satır 521 (`.categories-scroll-wrap`),<br>Satır 739 (`.filter-sub-bar`),<br>Satır 883 (`.loading-box`) | Esnek hizalama, buton grupları ve gezinme çubukları |
| **Medya Sorgusu 1 (Tablet)** | `css/style.css` (`@media (max-width: 1024px)`) | Satır 1708 - 1745 | Tablet görünümünde kolon ve görsel optimizasyonu |
| **Medya Sorgusu 2 (Mobil)** | `css/style.css` (`@media (max-width: 768px)`) | Satır 1747 - 1822 | Mobil görünüm, tek kolonlu kartlar ve formlar |
| **Medya Sorgusu 3 (Küçük Mobil)**| `css/style.css` (`@media (max-width: 480px)`) | Satır 1824 - 1844 | Küçük ekranlar için tipografi ve padding ayarı |
| **Mobilde Açılıp Kapanan Menü**| `css/style.css` (`.mobile-nav-toggle`, `.nav-menu.active`) | Satır 344 - 380 & Satır 1753 - 1785 | Hamburger butonu ve yumuşak kayan açılır menü |
| **Animasyonlar (@keyframes)** | `css/style.css` | Satır 170 (`floatPastel`),<br>Satır 179 (`pulseGlow`),<br>Satır 190 (`spinLoader`),<br>Satır 195 (`modalFadeIn`),<br>Satır 206 (`toastSlideUp`) | Yüzen şef görseli, dönen çırpıcı/spinner, modal ve toast |
| **:hover ve :focus Durumları** | `css/style.css` | Satır 154 (`:focus-visible`),<br>Satır 295 (`.nav-link:hover`),<br>Satır 410 (`.btn-primary:hover`),<br>Satır 596 (`.recipe-card:hover`),<br>Satır 720 (`.search-bar-wrap:focus-within`) | Yumuşak renk geçişleri, kart kaldırma ve erişilebilir odak |

---

### C. JavaScript Katmanı (`js/main.js`)
| Gereksinim | Karşılandığı Dosya | Satır Numarası | Açıklama |
|---|---|---|---|
| **Harici .js Dosyası** | `js/main.js` | 1 - 824 | HTML içinde hiçbir satır içi (inline) `onclick` yoktur |
| **addEventListener ile Olay 1 (click)** | `js/main.js` | Satır 67 (Tema), Satır 91 (Mobil Menü), Satır 236 (Favori), Satır 288 (Modal Aç), Satır 336 (Filtre) | Kullanıcı tıklama etkileşimleri |
| **addEventListener ile Olay 2 (input)** | `js/main.js` | Satır 314 (Canlı Arama), Satır 671 (Form Taslağı & Hata Temizleme) | Anlık klavye girişlerini dinleme |
| **addEventListener ile Olay 3 (submit)**| `js/main.js` | Satır 688 (Tarif & İletişim Formu), Satır 783 (Bülten Formu) | Form gönderimlerini yakalama |
| **addEventListener ile Olay 4 (change)**| `js/main.js` | Satır 357 (Sıralama Dropdown) | Select kutusu değişimi |
| **addEventListener ile Olay 5 (keydown)**| `js/main.js` | Satır 565 (Escape ile Modal Kapatma) | Klavye erişilebilirliği |
| **addEventListener ile Olay 6 (DOMContentLoaded)**| `js/main.js` | Satır 28 | Sayfa yüklendiğinde başlatma |
| **createElement ile Dinamik DOM** | `js/main.js` (`createRecipeCardElement()`) | Satır 196 - 296 & Satır 470 - 495 | `article`, `div`, `img`, `span`, `button` nesnelerinin kodla üretimi |
| **Arama & Filtreleme Algoritması**| `js/main.js` (`applyFiltersAndRender()`) | Satır 430 - 520 | Başlık, açıklama ve malzemelerde filtreleme, kategori ve favori kontrolü |
| **classList ile Görünüm Değiştirme**| `js/main.js` | Satır 68 (`dark-theme`), Satır 92 (`nav-menu.active`), Satır 130 (`favBtn.active`), Satır 620 (`modal.open`) | DOM elemanlarının stillerini sınıflarla değiştirme |
| **fetch ve async/await ile Veri Çekme**| `js/main.js` (`fetchRecipesData()`) | Satır 156 - 186 | `data/recipes.json` dosyasından asenkron veri yükleme |
| **Yükleniyor (Loading) Durumu** | `js/main.js` | Satır 160 & Satır 172 | `#loading-indicator` çırpıcı spinner gösterimi |
| **Hata (Error) Durumu & Yeniden Dene**| `js/main.js` | Satır 176 - 184 | `#error-indicator` ve `retryBtn.onclick` mekanizması |
| **localStorage 1 (Favori Listesi)**| `js/main.js` (`pastel_fav_recipes`) | Satır 113, 137 | Beğenilen tariflerin tarayıcıda saklanması ve sayacın güncellenmesi |
| **localStorage 2 (Tema Tercihi)** | `js/main.js` (`pastel_recipe_theme`) | Satır 58, 69 | Kullanıcının açık / koyu pastel tercihi saklanır |
| **localStorage 3 (Form Taslağı)** | `js/main.js` (`pastel_contact_draft`)| Satır 639, 659, 683, 746 | Kullanıcı yazarken taslak kaydedilir, sayfa yenilenince otomatik yüklenir |
| **Form Doğrulama (preventDefault)**| `js/main.js` | Satır 689 & Satır 784 | Sayfa yenilenmesi engellenir |
| **Hata Mesajlarının Gösterimi** | `js/main.js` (`setFieldError()`) | Satır 758 - 765 | İlgili input'un hemen altındaki `.error-msg` içine `textContent` ile basılır |
| **Başarılı Gönderim Bildirimi (Toast)**| `js/main.js` (`showToast()`) | Satır 753 & Satır 804 - 824 | Form resetlenir, taslak silinir ve pastel toast bildirimi gösterilir |
| **Güvenli Kodlama (XSS Önleme)** | `js/main.js` | Satır 216, 250, 474, 582, 762 vb. | Kullanıcı girdisi veya dinamik içerik için **ASLA innerHTML kullanılmamış**, daima `textContent` tercih edilmiştir |

---

## 4. Renk Paleti ve Tasarım Dili (Soft Aesthetic)

Tasarım, mutfağın sıcaklığını ve el yapımı tarif defterlerinin samimiyetini yansıtan yumuşak pastel tonlar üzerine kurulmuştur:

* **Vanilya & Fildişi Krem (`#FFFDF9`):** Arka plan ve ferah okuma alanları.
* **Pudra Pembesi (`#FFD1DC` / `#FFF0F3`):** Tatlılar, buton hover ve vurgular.
* **Adaçayı & Nane Yeşili (`#A8D5BA` / `#F2F7F2`):** Sağlıklı tarifler, başarı rozetleri ve tazelik hissi.
* **Pastel Şeftali (`#FCD5CE` / `#FFF3EB`):** Ana butonlar (`btn-primary`), kart vurguları ve aktif sekmeler.
* **Sıcak Çikolata Konturu (`#4A3F35`):** İllüstrasyonların ve kartların el çizimi sınır çizgileri.
* **Gece Pastel Zemin (`#1E1B24`):** Koyu modda göz dinlendiren yumuşak mürdüm tonu.

---

## 5. Dosya ve Klasör Yapısı

```text
Pastel-Mutfak/
├── index.html                  # Ana sayfa (Hero, vitrin, özellikler, bülten)
├── tarifler.html               # Tarifler defteri (Canlı arama, filtreler, modal)
├── iletisim.html               # İletişim & Tarif Gönder sayfası (Taslaklı form)
├── README.md                   # Proje dokümantasyonu ve gereksinim kılavuzu
├── css/
│   └── style.css               # Tek harici CSS (Değişkenler, Grid, Flex, Breakpoints)
├── js/
│   └── main.js                 # Tek harici JS (fetch, DOM, localStorage, doğrulama)
├── data/
│   └── recipes.json            # 9 adet denenmiş detaylı pastel tarif verisi
└── img/                        # Özel hazırlanmış pastel SVG illüstrasyonlar
    ├── logo.svg                # Pastel tencere & çırpıcı logosu
    ├── hero-chef.svg           # Hero bölümü için sevimli pastel şef illüstrasyonu
    ├── contact-illustration.svg# İletişim sayfası için tarif defteri illüstrasyonu
    ├── cilekli-tart.svg        # Çilekli Mini Fransız Tartı çizimi
    ├── avokado-tost.svg        # Karamelli & Avokadolu Köy Tostu çizimi
    ├── domates-corbasi.svg     # Fesleğenli Fırın Domates Çorbası çizimi
    ├── limonlu-cheesecake.svg  # Lavanta & Limonlu Cheesecake çizimi
    ├── mantarli-makarna.svg    # Kremalı Mantarlı Fırın Rigatoni çizimi
    ├── matcha-latte.svg        # Seremoniyel Pastel Matcha Latte çizimi
    ├── pancar-kase.svg         # Pancarlı & Keçi Peynirli Kinoa Kasesi çizimi
    ├── pankek-kulesi.svg       # Yaban Mersinli Pofuduk Pankek Kulesi çizimi
    └── kabak-cicegi.svg        # Pastel Çiçekli Ege Kabak Dolması çizimi
```

---

## 6. Yerel Ortamda Çalıştırma Talimatı

Projede `data/recipes.json` dosyasından `fetch()` API'si ile veri çekildiği için, modern tarayıcıların yerel dosya güvenlik (CORS / `file://`) kısıtlamalarına takılmamak adına basit bir yerel sunucu ile açılması tavsiye edilir:

* **VS Code Live Server:** `index.html` dosyasına sağ tıklayıp **"Open with Live Server"** seçeneğini seçin.
* **Python ile:** Klasör içinde terminal açıp `python -m http.server 8000` komutunu çalıştırın ve `http://localhost:8000` adresine gidin.
* **Node.js ile:** `npx serve .` komutunu çalıştırabilirsiniz.

---

## 8. Güvenli Kodlama ve Kurallar Beyanı
* **XSS Koruması:** Form girdileri, arama sonuçları ve JSON verileri DOM'a eklenirken kesinlikle `innerHTML` kullanılmamış; `document.createElement()`, `element.textContent` ve `setAttribute()` yöntemleri uygulanmıştır.
* **API Güvenliği:** Projede anahtar gerektirmeyen, gizlilik riski taşımayan yerel `data/recipes.json` kaynağı kullanılmadı.
* **Şablon Beyanı:** Bu proje herhangi bir Bootstrap/Tailwind şablonu içermez. Tüm CSS stilleri, layout kuralları ve SVG illüstrasyonları sıfırdan özel olarak üretildi.
