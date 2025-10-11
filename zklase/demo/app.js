let currentLang = getCookie("lang") || "lv";
let currentTheme = getCookie("theme") || "dark"; // default is dark in HTML

// ===== Apply saved theme =====
if (currentTheme === "light") {
  document.body.classList.remove("dark");
} else {
  document.body.classList.add("dark");
}

// ===== Theme toggle =====
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  // Set correct button text on load
  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark
    ? (currentLang === "lv" ? "Tumšs" : "Dark")
    : (currentLang === "lv" ? "Gaišs" : "Light");

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const nowDark = document.body.classList.contains("dark");
    setCookie("theme", nowDark ? "dark" : "light", 365); // Save preference
    themeBtn.textContent = nowDark
      ? (currentLang === "lv" ? "Tumšs" : "Dark")
      : (currentLang === "lv" ? "Gaišs" : "Light");
  });
}

// ===== Language toggle =====
const langBtn = document.getElementById("langToggle");
if (langBtn) {
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "lv" ? "en" : "lv";
    setCookie("lang", currentLang, 365); // Save preference
    loadLanguage(currentLang);
  });
}

// ===== Load translations =====
async function loadLanguage(lang) {
  try {
    const resp = await fetch(`lang/${lang}.json`);
    const dict = await resp.json();
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    if (themeBtn) {
      const isDark = document.body.classList.contains("dark");
      themeBtn.textContent = isDark
        ? (lang === "lv" ? "Tumšs" : "Dark")
        : (lang === "lv" ? "Gaišs" : "Light");
    }
  } catch (err) {
    console.error("Language load failed:", err);
  }
}

// ===== Cookie helpers =====
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// ===== Initialize =====
loadLanguage(currentLang);
