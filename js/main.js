/**
 * PASTEL MUTFAK • RESİMLİ TARİF DEFTERİ
 * Ana JavaScript Dosyası (js/main.js)
 * 
 * - %100 Vanilla JavaScript (Framework / Kütüphane kullanılmamıştır)
 * - addEventListener ile çoklu olay dinleyicileri (click, input, submit, change, keydown)
 * - fetch ve async/await ile JSON veri çekme
 * - document.createElement ve textContent ile güvenli dinamik DOM üretimi (XSS Koruması)
 * - classList ile mobil menü, karanlık mod, modal ve filtre kontrolü
 * - localStorage ile favoriler, tema tercihi ve form taslağı saklama
 * - preventDefault ve özel mesajlarla form doğrulama
 */

// Global Uygulama Durumu (State)
const AppState = {
  allRecipes: [],           // JSON'dan gelen tüm tarifler
  filteredRecipes: [],      // Filtrelenmiş aktif tarifler
  favorites: [],            // localStorage'dan yüklenen favori tarif ID'leri
  currentCategory: 'all',   // Aktif seçili kategori
  searchQuery: '',          // Arama çubuğu sorgusu
  sortBy: 'default',        // Sıralama tercihi
  onlyFavorites: false      // Yalnızca favorileri gösterme filtresi
};

// ==========================================================================
// 1. UYGULAMA BAŞLATICI (DOM Content Loaded)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();              // 1. Tema tercihini localStorage'dan yükle
  initFavorites();          // 2. Favorileri localStorage'dan yükle
  initMobileNav();          // 3. Mobil hamburger menü dinleyicisi
  initNewsletterForm();     // 4. E-bülten formu dinleyicisi

  // Sayfaya özel başlatıcılar
  const recipesContainer = document.getElementById('recipes-container');
  if (recipesContainer) {
    initRecipesCatalog();   // Tarifler sayfası veya öne çıkanlar konteyneri varsa başlat
  }

  const featuredContainer = document.getElementById('featured-recipes-container');
  if (featuredContainer) {
    loadFeaturedRecipes();  // Ana sayfada öne çıkan tarifleri yükle
  }

  const contactForm = document.getElementById('recipe-contact-form');
  if (contactForm) {
    initContactForm();      // İletişim & Tarif Gönder formu ve taslak sistemi
  }

  initModalEvents();        // Tarif detay modalı olay dinleyicileri
});

// ==========================================================================
// 2. TEMA DEĞİŞTİRİCİ (localStorage & classList)
// ==========================================================================
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('pastel_recipe_theme');

  // Kayıtlı tema varsa uygula
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateThemeIcon(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      localStorage.setItem('pastel_recipe_theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
    });
  }
}

function updateThemeIcon(isDark) {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Açık Pastel Moda Geç' : 'Gece Pastel Moduna Geç');
  }
}

// ==========================================================================
// 3. MOBİL GEZİNME MENÜSÜ (classList.toggle & addEventListener 'click')
// ==========================================================================
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Menüdeki bir bağlantıya tıklandığında menüyü kapat
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ==========================================================================
// 4. FAVORİLER YÖNETİMİ (localStorage)
// ==========================================================================
function initFavorites() {
  const storedFavs = localStorage.getItem('pastel_fav_recipes');
  if (storedFavs) {
    try {
      AppState.favorites = JSON.parse(storedFavs);
    } catch (e) {
      AppState.favorites = [];
    }
  }
  updateFavoritesCounter();
}

function toggleFavorite(recipeId, heartButton) {
  const id = Number(recipeId);
  const index = AppState.favorites.indexOf(id);

  if (index > -1) {
    AppState.favorites.splice(index, 1);
    if (heartButton) heartButton.classList.remove('active');
  } else {
    AppState.favorites.push(id);
    if (heartButton) heartButton.classList.add('active');
  }

  // localStorage'a JSON olarak kaydet
  localStorage.setItem('pastel_fav_recipes', JSON.stringify(AppState.favorites));
  updateFavoritesCounter();

  // Eğer yalnızca favoriler gösteriliyorsa listeyi anında güncelle
  if (AppState.onlyFavorites) {
    applyFiltersAndRender();
  }
}

function updateFavoritesCounter() {
  const countBadge = document.getElementById('fav-count-badge');
  if (countBadge) {
    countBadge.textContent = String(AppState.favorites.length);
  }
}

// ==========================================================================
// 5. VERİ ÇEKME (fetch & async/await)
// ==========================================================================
async function fetchRecipesData() {
  const loadingBox = document.getElementById('loading-indicator');
  const errorBox = document.getElementById('error-indicator');

  if (loadingBox) loadingBox.style.display = 'flex';
  if (errorBox) errorBox.style.display = 'none';

  try {
    const response = await fetch('data/recipes.json');
    if (!response.ok) {
      throw new Error(`Veri yüklenirken hata oluştu: HTTP ${response.status}`);
    }
    const data = await response.json();
    AppState.allRecipes = data;
    AppState.filteredRecipes = [...data];

    if (loadingBox) loadingBox.style.display = 'none';
    return data;
  } catch (error) {
    console.error('Tarifler yüklenemedi:', error);
    if (loadingBox) loadingBox.style.display = 'none';
    if (errorBox) {
      errorBox.style.display = 'flex';
      const retryBtn = document.getElementById('retry-fetch-btn');
      if (retryBtn) {
        retryBtn.onclick = () => fetchRecipesData().then(() => applyFiltersAndRender());
      }
    }
    return [];
  }
}

// ==========================================================================
// 6. GÜVENLİ DİNAMİK DOM OLUŞTURMA (createElement & textContent)
// ==========================================================================
/**
 * Bir tarif nesnesi için DOM kartı oluşturur.
 * XSS zafiyetlerini önlemek için kullanıcı girdileri ve metinler
 * asla innerHTML ile yazılmaz; textContent ve DOM API kullanılır.
 */
function createRecipeCardElement(recipe) {
  // 1. Ana Article Kartı
  const article = document.createElement('article');
  article.className = 'recipe-card';
  article.setAttribute('data-id', String(recipe.id));

  // 2. Medya / Görsel Bölümü
  const mediaDiv = document.createElement('div');
  mediaDiv.className = 'card-media';

  const img = document.createElement('img');
  img.src = recipe.image;
  img.alt = recipe.altText || `${recipe.title} pastel çizimi`;
  img.loading = 'lazy';
  mediaDiv.appendChild(img);

  // Kategori Rozeti
  const catBadge = document.createElement('span');
  const catKey = recipe.category.toLowerCase().replace(/[^a-z]/g, '');
  catBadge.className = `badge card-category-badge badge-${catKey}`;
  catBadge.textContent = recipe.category;
  mediaDiv.appendChild(catBadge);

  // Favori Kalp Butonu
  const favBtn = document.createElement('button');
  favBtn.className = 'card-fav-btn';
  favBtn.type = 'button';
  favBtn.setAttribute('aria-label', `${recipe.title} tarifini favorilere ekle`);

  const isFavorited = AppState.favorites.includes(recipe.id);
  if (isFavorited) favBtn.classList.add('active');

  // SVG Kalp İkonu
  const heartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  heartSvg.setAttribute('viewBox', '0 0 24 24');
  const heartPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  heartPath.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
  heartSvg.appendChild(heartPath);
  favBtn.appendChild(heartSvg);

  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(recipe.id, favBtn);
  });
  mediaDiv.appendChild(favBtn);

  article.appendChild(mediaDiv);

  // 3. İçerik Bölümü
  const contentDiv = document.createElement('div');
  contentDiv.className = 'card-content';

  const titleH3 = document.createElement('h3');
  titleH3.className = 'card-title';
  titleH3.textContent = recipe.title;
  contentDiv.appendChild(titleH3);

  const descP = document.createElement('p');
  descP.className = 'card-desc';
  descP.textContent = recipe.description;
  contentDiv.appendChild(descP);

  // Meta Bar (Süre, Porsiyon, Zorluk)
  const metaBar = document.createElement('div');
  metaBar.className = 'card-meta-bar';

  const timeItem = document.createElement('span');
  timeItem.className = 'meta-item';
  timeItem.textContent = `⏱️ ${recipe.time}`;
  metaBar.appendChild(timeItem);

  const servingsItem = document.createElement('span');
  servingsItem.className = 'meta-item';
  servingsItem.textContent = `👥 ${recipe.servings}`;
  metaBar.appendChild(servingsItem);

  const diffItem = document.createElement('span');
  diffItem.className = 'meta-item';
  diffItem.textContent = `⭐ ${recipe.difficulty}`;
  metaBar.appendChild(diffItem);

  contentDiv.appendChild(metaBar);
  article.appendChild(contentDiv);

  // 4. Kart Alt Eylem (Detay Gör Butonu)
  const footerDiv = document.createElement('div');
  footerDiv.className = 'card-footer';

  const detailBtn = document.createElement('button');
  detailBtn.className = 'btn-card-detail';
  detailBtn.type = 'button';
  detailBtn.textContent = 'Tarifi İncele 🧁';
  detailBtn.addEventListener('click', () => {
    openRecipeModal(recipe);
  });

  footerDiv.appendChild(detailBtn);
  article.appendChild(footerDiv);

  return article;
}

// ==========================================================================
// 7. TARİFLER SAYFASI FİLTRELEME & ARAMA MOTORU
// ==========================================================================
async function initRecipesCatalog() {
  const container = document.getElementById('recipes-container');
  if (!container) return;

  // Veriyi çek
  await fetchRecipesData();

  // Olay Dinleyicileri Kur:
  // 1. Arama Çubuğu (input olayı)
  const searchInput = document.getElementById('recipe-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = AppState.searchQuery.length > 0 ? 'block' : 'none';
      }
      applyFiltersAndRender();
    });
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      AppState.searchQuery = '';
      searchClearBtn.style.display = 'none';
      searchInput.focus();
      applyFiltersAndRender();
    });
  }

  // 2. Kategori Filtre Butonları (click olayı)
  const categoryButtons = document.querySelectorAll('.filter-btn');
  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.currentCategory = btn.getAttribute('data-category') || 'all';
      applyFiltersAndRender();
    });
  });

  // 3. Yalnızca Favorileri Göster Toggle Butonu
  const favToggleBtn = document.getElementById('filter-fav-btn');
  if (favToggleBtn) {
    favToggleBtn.addEventListener('click', () => {
      AppState.onlyFavorites = !AppState.onlyFavorites;
      favToggleBtn.classList.toggle('active', AppState.onlyFavorites);
      favToggleBtn.setAttribute('aria-pressed', AppState.onlyFavorites ? 'true' : 'false');
      applyFiltersAndRender();
    });
  }

  // 4. Sıralama Seçimi (change olayı)
  const sortSelect = document.getElementById('recipe-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // 5. URL Parametrelerini Kontrol Et (?cat=... veya ?filter=favorites)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  const filterParam = urlParams.get('filter');

  if (filterParam === 'favorites') {
    AppState.onlyFavorites = true;
    if (favToggleBtn) {
      favToggleBtn.classList.add('active');
      favToggleBtn.setAttribute('aria-pressed', 'true');
    }
  }

  if (catParam) {
    categoryButtons.forEach((btn) => {
      const btnCat = btn.getAttribute('data-category');
      const normalizedCat = btnCat ? btnCat.toLowerCase().replace(/[^a-z]/g, '') : '';
      const normalizedParam = catParam.toLowerCase().replace(/[^a-z]/g, '');
      if (normalizedCat === normalizedParam) {
        categoryButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.currentCategory = btnCat;
      }
    });
  }

  // İlk render
  applyFiltersAndRender();
}

/**
 * Filtreleri, aramayı ve sıralamayı uygulayıp DOM'a basar.
 */
function applyFiltersAndRender() {
  const container = document.getElementById('recipes-container');
  if (!container) return;

  let results = [...AppState.allRecipes];

  // 1. Kategori Filtresi
  if (AppState.currentCategory !== 'all') {
    results = results.filter((r) => r.category.toLowerCase() === AppState.currentCategory.toLowerCase());
  }

  // 2. Arama Sorgusu (Başlık, açıklama ve malzemelerde)
  if (AppState.searchQuery) {
    const q = AppState.searchQuery;
    results = results.filter((r) => {
      const titleMatch = r.title.toLowerCase().includes(q);
      const descMatch = r.description.toLowerCase().includes(q);
      const ingredientMatch = r.ingredients.some((ing) => ing.toLowerCase().includes(q));
      return titleMatch || descMatch || ingredientMatch;
    });
  }

  // 3. Favori Filtresi
  if (AppState.onlyFavorites) {
    results = results.filter((r) => AppState.favorites.includes(r.id));
  }

  // 4. Sıralama
  if (AppState.sortBy === 'name-asc') {
    results.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
  } else if (AppState.sortBy === 'time-asc') {
    results.sort((a, b) => parseInt(a.time) - parseInt(b.time));
  } else if (AppState.sortBy === 'calories-asc') {
    results.sort((a, b) => parseInt(a.calories) - parseInt(b.calories));
  }

  AppState.filteredRecipes = results;

  // DOM'u güvenle temizle
  container.replaceChildren();

  // Sonuç bulunamadı durumu
  if (results.length === 0) {
    const emptyBox = document.createElement('div');
    emptyBox.className = 'empty-results-box';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'empty-results-icon';
    iconSpan.textContent = '🧁';
    emptyBox.appendChild(iconSpan);

    const titleH3 = document.createElement('h3');
    titleH3.className = 'section-title';
    titleH3.textContent = 'Aradığınız kriterde tarif bulunamadı';
    emptyBox.appendChild(titleH3);

    const descP = document.createElement('p');
    descP.className = 'section-subtitle';
    descP.textContent = 'Farklı bir arama terimi deneyebilir veya filtreleri sıfırlayabilirsiniz.';
    emptyBox.appendChild(descP);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-primary';
    resetBtn.type = 'button';
    resetBtn.textContent = 'Filtreleri Temizle 🌸';
    resetBtn.addEventListener('click', resetAllFilters);
    emptyBox.appendChild(resetBtn);

    container.appendChild(emptyBox);
    return;
  }

  // Kartları oluştur ve konteynere ekle
  results.forEach((recipe) => {
    const cardEl = createRecipeCardElement(recipe);
    container.appendChild(cardEl);
  });
}

function resetAllFilters() {
  AppState.currentCategory = 'all';
  AppState.searchQuery = '';
  AppState.onlyFavorites = false;
  AppState.sortBy = 'default';

  const searchInput = document.getElementById('recipe-search-input');
  if (searchInput) searchInput.value = '';

  const searchClearBtn = document.getElementById('search-clear-btn');
  if (searchClearBtn) searchClearBtn.style.display = 'none';

  const categoryButtons = document.querySelectorAll('.filter-btn');
  categoryButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
  });

  const favToggleBtn = document.getElementById('filter-fav-btn');
  if (favToggleBtn) favToggleBtn.classList.remove('active');

  const sortSelect = document.getElementById('recipe-sort-select');
  if (sortSelect) sortSelect.value = 'default';

  applyFiltersAndRender();
}

// ==========================================================================
// 8. ANA SAYFA ÖNE ÇIKAN TARİFLER
// ==========================================================================
async function loadFeaturedRecipes() {
  const container = document.getElementById('featured-recipes-container');
  if (!container) return;

  const recipes = await fetchRecipesData();
  const featured = recipes.filter((r) => r.featured).slice(0, 3);

  container.replaceChildren();
  featured.forEach((recipe) => {
    const cardEl = createRecipeCardElement(recipe);
    container.appendChild(cardEl);
  });
}

// ==========================================================================
// 9. TARİF DETAY MODALI (POPUP)
// ==========================================================================
function initModalEvents() {
  const modalOverlay = document.getElementById('recipe-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (modalOverlay) {
    // Dış alana tıklanırsa kapat
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeRecipeModal();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeRecipeModal);
  }

  // ESC tuşuyla kapatma (keydown olayı)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRecipeModal();
    }
  });
}

function openRecipeModal(recipe) {
  const modal = document.getElementById('recipe-modal');
  if (!modal) return;

  // Modal öğelerini bul ve textContent ile güvenle doldur
  const modalImg = document.getElementById('modal-recipe-img');
  const modalTitle = document.getElementById('modal-recipe-title');
  const modalCategory = document.getElementById('modal-recipe-category');
  const modalTime = document.getElementById('modal-recipe-time');
  const modalServings = document.getElementById('modal-recipe-servings');
  const modalDifficulty = document.getElementById('modal-recipe-difficulty');
  const modalCalories = document.getElementById('modal-recipe-calories');
  const modalDesc = document.getElementById('modal-recipe-desc');
  const ingredientsList = document.getElementById('modal-ingredients-list');
  const instructionsList = document.getElementById('modal-instructions-list');
  const modalTipText = document.getElementById('modal-tip-text');

  if (modalImg) {
    modalImg.src = recipe.image;
    modalImg.alt = recipe.altText || recipe.title;
  }
  if (modalTitle) modalTitle.textContent = recipe.title;
  if (modalCategory) modalCategory.textContent = recipe.category;
  if (modalTime) modalTime.textContent = `⏱️ ${recipe.time}`;
  if (modalServings) modalServings.textContent = `👥 ${recipe.servings}`;
  if (modalDifficulty) modalDifficulty.textContent = `⭐ ${recipe.difficulty}`;
  if (modalCalories) modalCalories.textContent = `🔥 ${recipe.calories}`;
  if (modalDesc) modalDesc.textContent = recipe.description;
  if (modalTipText) modalTipText.textContent = recipe.chefTip;

  // Malzemeleri dinamik createElement ile ekle
  if (ingredientsList) {
    ingredientsList.replaceChildren();
    recipe.ingredients.forEach((ing) => {
      const li = document.createElement('li');
      li.className = 'modal-ingredient-item';
      li.textContent = ing;
      ingredientsList.appendChild(li);
    });
  }

  // Adımları dinamik createElement ile ekle
  if (instructionsList) {
    instructionsList.replaceChildren();
    recipe.instructions.forEach((step, idx) => {
      const li = document.createElement('li');
      li.className = 'modal-step-item';

      const numSpan = document.createElement('span');
      numSpan.className = 'modal-step-number';
      numSpan.textContent = String(idx + 1);
      li.appendChild(numSpan);

      const textSpan = document.createElement('span');
      textSpan.textContent = step;
      li.appendChild(textSpan);

      instructionsList.appendChild(li);
    });
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden'; // Arka plan kaymasını durdur
}

function closeRecipeModal() {
  const modal = document.getElementById('recipe-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ==========================================================================
// 10. İLETİŞİM & TARİF FORMU DOĞRULAMASI & TASLAK (localStorage)
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('recipe-contact-form');
  if (!form) return;

  const draftKey = 'pastel_contact_draft';
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const categorySelect = document.getElementById('contact-category');
  const titleInput = document.getElementById('contact-title');
  const timeInput = document.getElementById('contact-time');
  const messageInput = document.getElementById('contact-message');
  const consentCheck = document.getElementById('contact-consent');
  const draftAlert = document.getElementById('draft-alert');
  const draftClearBtn = document.getElementById('draft-clear-btn');

  // 1. localStorage'dan Taslak Yükleme
  const savedDraft = localStorage.getItem(draftKey);
  if (savedDraft) {
    try {
      const draftData = JSON.parse(savedDraft);
      if (nameInput && draftData.name) nameInput.value = draftData.name;
      if (emailInput && draftData.email) emailInput.value = draftData.email;
      if (categorySelect && draftData.category) categorySelect.value = draftData.category;
      if (titleInput && draftData.title) titleInput.value = draftData.title;
      if (timeInput && draftData.time) timeInput.value = draftData.time;
      if (messageInput && draftData.message) messageInput.value = draftData.message;

      if (draftAlert) draftAlert.classList.add('show');
    } catch (err) {
      console.warn('Taslak çözümlenemedi:', err);
    }
  }

  // Taslağı Temizle Butonu
  if (draftClearBtn) {
    draftClearBtn.addEventListener('click', () => {
      localStorage.removeItem(draftKey);
      form.reset();
      if (draftAlert) draftAlert.classList.remove('show');
      showToast('🌸 Kayıtlı taslak temizlendi.');
    });
  }

  // 2. Her input olayında taslağı localStorage'a kaydet ve ilgili hatayı sil
  const formInputs = [nameInput, emailInput, categorySelect, titleInput, timeInput, messageInput];
  formInputs.forEach((inputEl) => {
    if (!inputEl) return;
    inputEl.addEventListener('input', () => {
      // Hatayı temizle
      clearFieldError(inputEl);

      // Taslağı güncelle
      const currentDraft = {
        name: nameInput ? nameInput.value : '',
        email: emailInput ? emailInput.value : '',
        category: categorySelect ? categorySelect.value : '',
        title: titleInput ? titleInput.value : '',
        time: timeInput ? timeInput.value : '',
        message: messageInput ? messageInput.value : ''
      };
      localStorage.setItem(draftKey, JSON.stringify(currentDraft));
    });
  });

  // 3. Form Gönderimi ve JavaScript ile Doğrulama (submit olayı & preventDefault)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Ad Soyad Doğrulama (En az 3 karakter)
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      setFieldError(nameInput, 'error-name', 'Lütfen en az 3 karakterden oluşan adınızı ve soyadınızı giriniz.');
      isValid = false;
    }

    // E-posta Doğrulama (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, 'error-email', 'E-posta adresi alanı boş bırakılamaz.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'error-email', 'Lütfen geçerli bir e-posta adresi yazınız (ör: ad@ornek.com).');
      isValid = false;
    }

    // Kategori Doğrulama
    if (!categorySelect.value) {
      setFieldError(categorySelect, 'error-category', 'Lütfen tarifiniz için uygun bir kategori seçiniz.');
      isValid = false;
    }

    // Tarif Adı / Konu Doğrulama
    if (!titleInput.value.trim() || titleInput.value.trim().length < 3) {
      setFieldError(titleInput, 'error-title', 'Lütfen en az 3 karakterden oluşan bir tarif adı veya konu belirtiniz.');
      isValid = false;
    }

    // Mesaj & Tarif Detayı Doğrulama (En az 15 karakter)
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, 'error-message', 'Lütfen tarif detaylarını veya mesajınızı yazınız.');
      isValid = false;
    } else if (messageInput.value.trim().length < 15) {
      setFieldError(messageInput, 'error-message', 'Lütfen en az 15 karakterlik açıklayıcı bir içerik giriniz.');
      isValid = false;
    }

    // Onay Kutusu (Checkbox)
    if (consentCheck && !consentCheck.checked) {
      const consentError = document.getElementById('error-consent');
      if (consentError) {
        consentError.textContent = 'Lütfen şartları ve aydınlatma metnini onaylayınız.';
        consentError.classList.add('show');
      }
      isValid = false;
    } else if (consentCheck) {
      const consentError = document.getElementById('error-consent');
      if (consentError) consentError.classList.remove('show');
    }

    // Eğer tüm alanlar geçerliyse başarılı geri bildirim ver
    if (isValid) {
      // Taslağı temizle
      localStorage.removeItem(draftKey);
      if (draftAlert) draftAlert.classList.remove('show');

      // Formu sıfırla
      form.reset();

      // Kullanıcıya şık pastel Toast bildirimi
      showToast('🧁 Harika! Tarifiniz ve mesajınız başarıyla fırına verildi. Teşekkür ederiz!');
    }
  });
}

function setFieldError(inputEl, errorSpanId, message) {
  if (inputEl) inputEl.classList.add('input-error');
  const errorSpan = document.getElementById(errorSpanId);
  if (errorSpan) {
    errorSpan.textContent = message; // Güvenli textContent kullanımı
    errorSpan.classList.add('show');
  }
}

function clearFieldError(inputEl) {
  if (inputEl) inputEl.classList.remove('input-error');
  const errorSpan = inputEl.parentElement ? inputEl.parentElement.querySelector('.error-msg') : null;
  if (errorSpan) {
    errorSpan.textContent = '';
    errorSpan.classList.remove('show');
  }
}

// ==========================================================================
// 11. E-BÜLTEN (NEWSLETTER) MİNİ FORM DOĞRULAMASI
// ==========================================================================
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    if (!input) return;

    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showToast('⚠️ Lütfen geçerli bir e-posta adresi yazınız.');
      return;
    }

    input.value = '';
    showToast('💌 Teşekkürler! Pastel lezzet bültenine kaydınız alındı.');
  });
}

// ==========================================================================
// 12. TOAST BİLDİRİMİ SİSTEMİ
// ==========================================================================
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  // Varsa önceki zamanlayıcıyı sıfırla
  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}
