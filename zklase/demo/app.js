let currentLang = "lv";

// ===== Theme toggle =====
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeBtn.textContent = document.body.classList.contains("dark")
      ? (currentLang === "lv" ? "Tumšs" : "Dark")
      : (currentLang === "lv" ? "Gaišs" : "Light");
  });
}

// ===== Language toggle =====
const langBtn = document.getElementById("langToggle");
if (langBtn) {
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "lv" ? "en" : "lv";
    loadLanguage(currentLang);
  });
}

// ===== Load translations =====
async function loadLanguage(lang) {
  const resp = await fetch(`lang/${lang}.json`);
  const dict = await resp.json();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  if (themeBtn) {
    themeBtn.textContent = document.body.classList.contains("dark")
      ? (lang === "lv" ? "Tumšs" : "Dark")
      : (lang === "lv" ? "Gaišs" : "Light");
  }
}

loadLanguage(currentLang);
