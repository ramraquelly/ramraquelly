const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
const projectMapLinks = document.querySelectorAll("[data-map-filter]");
const areaProjectButtons = document.querySelectorAll(".area-tags button[data-href]");

const setFilter = (filter) => {
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
  projectMapLinks.forEach((link) => link.classList.toggle("active", link.dataset.mapFilter === filter));
  projectCards.forEach((card) => {
    const themes = card.dataset.theme || "";
    const primary = card.dataset.primary || "";
    card.hidden = filter !== "todos" && !themes.includes(filter) && primary !== filter;
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

projectMapLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const filter = link.dataset.mapFilter;
    setFilter(filter);
    const target = Array.from(projectCards).find((card) => !card.hidden);
    window.setTimeout(() => target?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  });
});

areaProjectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = button.dataset.href;
  });
});

const queryFilter = new URLSearchParams(window.location.search).get("tema");
if (queryFilter && document.querySelector(`[data-filter="${queryFilter}"]`)) {
  setFilter(queryFilter);
}

const timelineTabs = document.querySelectorAll(".timeline-tab");
const timelinePanels = document.querySelectorAll(".timeline-panel");

timelineTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    timelineTabs.forEach((item) => item.classList.remove("active"));
    timelinePanels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target)?.classList.add("active");
  });
});

const langButtons = document.querySelectorAll("[data-lang]");

const setTranslateCookie = (lang) => {
  const value = lang === "pt" ? "" : `/pt/${lang}`;
  document.cookie = `googtrans=${value}; path=/`;
  document.cookie = `googtrans=${value}; domain=${location.hostname}; path=/`;
};

const loadGoogleTranslate = () => {
  if (document.getElementById("google_translate_element")) return;
  const holder = document.createElement("div");
  holder.id = "google_translate_element";
  holder.hidden = true;
  document.body.appendChild(holder);
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({
      pageLanguage: "pt",
      includedLanguages: "en,es,pt",
      autoDisplay: false
    }, "google_translate_element");
  };
  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(script);
};

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang;
    langButtons.forEach((item) => item.classList.toggle("active", item === button));
    localStorage.setItem("ramon-site-lang", lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
    setTranslateCookie(lang);
    if (lang === "pt") {
      location.reload();
      return;
    }
    loadGoogleTranslate();
    setTimeout(() => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event("change"));
      }
    }, 900);
  });
});

const selectedLang = localStorage.getItem("ramon-site-lang") || "pt";
document.querySelector(`[data-lang="${selectedLang}"]`)?.classList.add("active");
if (selectedLang !== "pt") {
  setTranslateCookie(selectedLang);
  loadGoogleTranslate();
}
