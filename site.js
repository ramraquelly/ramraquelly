const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
const projectMapLinks = document.querySelectorAll("[data-map-filter]");
const areaProjectButtons = document.querySelectorAll(".area-tags button[data-href]");
const themeButtons = document.querySelectorAll(".theme-toggle");
const searchToggle = document.querySelector(".search-toggle");
const searchPanel = document.querySelector(".site-search-panel");
const searchInput = document.querySelector(".site-search-input");
const searchResults = document.querySelector(".site-search-results");
const languageSwitch = document.querySelector(".language-switch");
const languageCurrent = document.querySelector(".language-current");
const currentLang = document.querySelector(".current-lang");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
const methodNodes = document.querySelectorAll(".method-node");
const methodCaption = document.querySelector(".method-caption");

const methodCopy = {
  diagnostico: "Leitura de contexto, escuta territorial, análise de dados e definição do problema público ou cultural.",
  desenho: "Arquitetura do projeto: objetivos, entregas, parceiros, governança, cronograma e critérios de decisão.",
  implementacao: "Coordenação prática entre equipes, instituições e território para transformar desenho em execução.",
  monitoramento: "Acompanhamento de indicadores, riscos, evidências, aprendizados e ajustes de rota durante o processo.",
  comunicacao: "Síntese pública do projeto: relatórios, narrativas, apresentações, produtos digitais e memória institucional."
};

const searchItems = [
  ["Home", "index.html", "apresentação método números"],
  ["Sobre", "sobre.html", "perfil experiência formação competências"],
  ["Áreas", "areas.html", "sustentabilidade cultura políticas públicas dados"],
  ["Projetos", "projetos.html", "galeria portfolio cases"],
  ["Contato", "contato.html", "email linkedin currículo"],
  ["OEI", "projetos/oei.html", "transformação ecológica nordeste sustentabilidade território"],
  ["UNESCO / MEC", "projetos/unesco-mec.html", "pneerq pdde equidade políticas públicas dados"],
  ["TRAJECTS", "projetos/trajects.html", "global academy transição justa cape town"],
  ["INSPIRE", "projetos/inspire.html", "energia renovável pesquisa áfrica do sul"],
  ["CIPSEM", "projetos/cipsem.html", "tu dresden mobilidade sustentável"],
  ["Ceibal", "projetos/ceibal.html", "diversidade inclusão tecnologia educação"],
  ["LABIC-UY", "projetos/labic.html", "inovação cidadã laboratório uruguai"],
  ["Lista Preta", "projetos/lista-preta.html", "audiovisual cultura negra podcast"],
  ["((o))eco", "projetos/oeco.html", "oásis da leste jornalismo ambiental"],
  ["DiaTV", "projetos/diatv.html", "audiovisual comunicação apresentação"],
  ["Gata Audiovisual", "projetos/gata-audiovisual.html", "blogueirinha audiovisual entrevista"],
  ["Urach", "projetos/urach.html", "podcast baú griô"],
  ["Ibermuseus", "projetos/ibermuseos.html", "museus patrimônio cultura"],
  ["Embaixada Preta", "projetos/embaixada-preta.html", "workshop projetos criativos tecnologia"]
];

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("ramon-site-theme", theme);
  themeButtons.forEach((button) => {
    const isDark = theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("title", isDark ? "Usar tema claro" : "Usar tema escuro");
  });
};

setTheme(localStorage.getItem("ramon-site-theme") || "light");

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
});

methodNodes.forEach((node) => {
  node.addEventListener("click", () => {
    methodNodes.forEach((item) => item.classList.remove("active"));
    node.classList.add("active");
    if (methodCaption) methodCaption.textContent = methodCopy[node.dataset.method] || "";
  });
});

const renderSearch = (query = "") => {
  if (!searchResults) return;
  const normalized = query.trim().toLowerCase();
  const results = searchItems
    .filter(([title, , terms]) => !normalized || `${title} ${terms}`.toLowerCase().includes(normalized))
    .slice(0, 6);
  searchResults.innerHTML = results.length
    ? results.map(([title, href]) => `<a href="${href}">${title}</a>`).join("")
    : "<p>Nenhum resultado direto.</p>";
};

searchToggle?.addEventListener("click", () => {
  const isOpen = !searchPanel?.hidden;
  if (!searchPanel) return;
  searchPanel.hidden = isOpen;
  searchToggle.setAttribute("aria-expanded", String(!isOpen));
  if (!isOpen) {
    renderSearch(searchInput?.value || "");
    window.setTimeout(() => searchInput?.focus(), 20);
  }
});

searchInput?.addEventListener("input", () => renderSearch(searchInput.value));

document.addEventListener("click", (event) => {
  if (searchPanel && !searchPanel.hidden && !searchPanel.contains(event.target) && !searchToggle?.contains(event.target)) {
    searchPanel.hidden = true;
    searchToggle?.setAttribute("aria-expanded", "false");
  }
  if (languageSwitch && !languageSwitch.contains(event.target)) {
    languageSwitch.classList.remove("open");
    languageCurrent?.setAttribute("aria-expanded", "false");
  }
});

languageCurrent?.addEventListener("click", () => {
  const isOpen = languageSwitch?.classList.toggle("open");
  languageCurrent.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

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
    if (currentLang) currentLang.textContent = lang === "en" ? "ENG" : lang.toUpperCase();
    languageSwitch?.classList.remove("open");
    languageCurrent?.setAttribute("aria-expanded", "false");
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
if (currentLang) currentLang.textContent = selectedLang === "en" ? "ENG" : selectedLang.toUpperCase();
if (selectedLang !== "pt") {
  setTranslateCookie(selectedLang);
  loadGoogleTranslate();
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector("button[type='submit']");
  const originalLabel = submitButton?.textContent || "Enviar mensagem";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
  }
  if (formStatus) formStatus.textContent = "";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Falha no envio");
    contactForm.reset();
    if (formStatus) formStatus.textContent = "Mensagem enviada. Obrigado pelo contato.";
  } catch (error) {
    if (formStatus) formStatus.textContent = "Não foi possível enviar agora. Use ramonraquelly@gmail.com.";
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  }
});
