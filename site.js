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
  ["Embaixada Preta", "projetos/embaixada-preta.html", "workshop projetos criativos tecnologia"],
  ["Ministério da Cultura", "projetos/minc-avaliacao-cultural.html", "avaliador tecnico parecerista pronac minc cultura cinema audiovisual"]
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

const getSearchElements = () => ({
  toggle: document.querySelector(".search-toggle"),
  panel: document.querySelector(".site-search-panel"),
  input: document.querySelector(".site-search-input"),
  results: document.querySelector(".site-search-results")
});

const renderSearch = (query = "") => {
  const { results } = getSearchElements();
  if (!results) return;
  const normalized = query.trim().toLowerCase();
  const matches = searchItems
    .filter(([title, , terms]) => !normalized || `${title} ${terms}`.toLowerCase().includes(normalized))
    .slice(0, 6);
  results.innerHTML = matches.length
    ? matches.map(([title, href]) => `<a href="${href}">${title}</a>`).join("")
    : "<p>Nenhum resultado direto.</p>";
};

document.addEventListener("click", (event) => {
  const clickedSearch = event.target.closest?.(".search-toggle");
  if (!clickedSearch) return;
  const { panel, input } = getSearchElements();
  if (!panel) return;
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  clickedSearch.setAttribute("aria-expanded", String(willOpen));
  languageSwitch?.classList.remove("open");
  languageCurrent?.setAttribute("aria-expanded", "false");
  if (willOpen) {
    renderSearch(input?.value || "");
    window.setTimeout(() => input?.focus(), 40);
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches?.(".site-search-input")) renderSearch(event.target.value);
});

document.addEventListener("click", (event) => {
  const { toggle, panel } = getSearchElements();
  if (panel && !panel.hidden && !panel.contains(event.target) && !toggle?.contains(event.target)) {
    panel.hidden = true;
    toggle?.setAttribute("aria-expanded", "false");
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

const normalizeFilter = (value = "todos") => value.trim().toLowerCase();

const cardMatchesFilter = (card, filter) => {
  if (filter === "todos") return true;
  const themes = (card.dataset.theme || "").split(/\s+/).map(normalizeFilter);
  const primary = normalizeFilter(card.dataset.primary || "");
  return primary === filter || themes.includes(filter);
};

const setFilter = (rawFilter = "todos") => {
  const filter = normalizeFilter(rawFilter);
  filterButtons.forEach((button) => {
    const isActive = normalizeFilter(button.dataset.filter || "") === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  projectMapLinks.forEach((link) => {
    link.classList.toggle("active", normalizeFilter(link.dataset.mapFilter || "") === filter);
  });
  projectCards.forEach((card) => {
    const show = cardMatchesFilter(card, filter);
    card.classList.toggle("is-filtered-out", !show);
    card.hidden = false;
    card.setAttribute("aria-hidden", String(!show));
  });
};

document.addEventListener("click", (event) => {
  const button = event.target.closest?.(".filter[data-filter]");
  if (!button) return;
  event.preventDefault();
  setFilter(button.dataset.filter);
});

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("[data-map-filter]");
  if (!link) return;
  event.preventDefault();
  const filter = link.dataset.mapFilter;
  setFilter(filter);
  const target = Array.from(projectCards).find((card) => !card.classList.contains("is-filtered-out"));
  window.setTimeout(() => target?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
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

const getLanguageFromPath = () => {
  const firstSegment = location.pathname.split("/").filter(Boolean)[0];
  return firstSegment === "en" || firstSegment === "es" ? firstSegment : "pt";
};

const getLocalizedPath = (lang) => {
  const parts = location.pathname.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "es") parts.shift();
  const basePath = parts.length ? `/${parts.join("/")}` : "/index.html";
  if (lang === "pt") return basePath;
  return `/${lang}${basePath}`;
};

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang;
    languageSwitch?.classList.remove("open");
    languageCurrent?.setAttribute("aria-expanded", "false");
    window.location.href = `${getLocalizedPath(lang)}${location.search}${location.hash}`;
  });
});

const selectedLang = getLanguageFromPath();
document.querySelector(`[data-lang="${selectedLang}"]`)?.classList.add("active");
if (currentLang) currentLang.textContent = selectedLang === "en" ? "ENG" : selectedLang.toUpperCase();

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
