// ============================================================
//  js/main.js — Script global ProInsertion CI
//  Navbar, toast, sidebar mobile, utilitaires communs.
//  Chargé sur toutes les pages.
// ============================================================

// ════════════════════════════════════════════════════════════
//  TOAST (notifications visuelles)
// ════════════════════════════════════════════════════════════

function afficherToast(message, type = "info", duree = 3500) {
let conteneur = document.getElementById("toast-container");
if (!conteneur) {
conteneur = document.createElement("div");
conteneur.id = "toast-container";
document.body.appendChild(conteneur);
}

const icones = { succes: "✅", erreur: "❌", info: "ℹ️", warn: "⚠️" };
const toast  = document.createElement("div");
toast.className = `toast toast--${type}`;
toast.innerHTML = `<span>${icones[type] || "ℹ️"}</span><span>${window.echapperHtml ? window.echapperHtml(message) : message}</span>`;

conteneur.appendChild(toast);

// Supprime le toast après la durée
setTimeout(() => {
toast.style.animation = "toast-out 0.3s ease forwards";
setTimeout(() => toast.remove(), 300);
}, duree);
}

window.afficherToast = afficherToast;

// ════════════════════════════════════════════════════════════
//  NAVBAR
// ════════════════════════════════════════════════════════════

function initNavbar() {
const navbar = document.querySelector(".navbar");
if (!navbar) return;

// Ombre au scroll + masquage au scroll vers le bas (réapparition au
// scroll vers le haut). Le menu mobile ouvert bloque le masquage pour
// ne pas le faire disparaître pendant qu'on le consulte.
let dernierScrollY = window.scrollY;
window.addEventListener("scroll", () => {
const scrollActuel = window.scrollY;
navbar.classList.toggle("scrolled", scrollActuel > 20);

const menuMobileOuvert = document.querySelector(".navbar__mobile.ouvert");
const sousMenuOuvert   = document.querySelector(".navbar__groupe.ouvert");
if (menuMobileOuvert || sousMenuOuvert) {
  navbar.classList.remove("navbar--cachee");
} else if (scrollActuel > dernierScrollY && scrollActuel > var_navbarHauteur()) {
  // Défilement vers le bas, et on a dépassé la hauteur de la navbar
  // elle-même — évite un masquage prématuré tout en haut de la page.
  navbar.classList.add("navbar--cachee");
} else if (scrollActuel < dernierScrollY) {
  // Défilement vers le haut, même léger : réapparition immédiate.
  navbar.classList.remove("navbar--cachee");
}
dernierScrollY = scrollActuel;
}, { passive: true });

function var_navbarHauteur() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navbar-h")) || 70;
}

// Hamburger menu mobile
const hamburger  = document.querySelector(".navbar__hamburger");
const menuMobile = document.querySelector(".navbar__mobile");

if (hamburger && menuMobile) {
hamburger.addEventListener("click", () => {
const estOuvert = menuMobile.classList.toggle("ouvert");
hamburger.setAttribute("aria-expanded", estOuvert);

  // Anime les barres du hamburger
  const barres = hamburger.querySelectorAll("span");
  if (estOuvert) {
    barres[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    barres[1].style.opacity   = "0";
    barres[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  } else {
    barres.forEach(b => { b.style.transform = ""; b.style.opacity = ""; });
  }
});

// Ferme le menu au clic sur un lien
menuMobile.querySelectorAll("a").forEach(lien => {
  lien.addEventListener("click", () => {
    menuMobile.classList.remove("ouvert");
    hamburger.querySelectorAll("span").forEach(b => {
      b.style.transform = ""; b.style.opacity = "";
    });
  });
});

}

// Sous-menus déroulants de la navbar (groupes de fonctionnalités)
// Délégation d'événement sur `document` plutôt qu'un addEventListener
// par élément : les groupes statiques (Concours, Ressources, Carrière)
// existent déjà au chargement, mais le menu "Compte" (👤 Prénom) est
// injecté dynamiquement plus tard par auth.js selon l'état de
// connexion — un binding direct par élément, exécuté une seule fois
// ici, ne l'aurait jamais vu et son clic n'aurait donc jamais rien
// ouvert. La délégation fonctionne pour n'importe quel groupe présent
// au moment du clic, statique ou injecté après coup.
function attacherMenusNavbar() {
document.addEventListener("click", (e) => {
const bouton = e.target.closest(".navbar__groupe-btn");
if (bouton) {
  e.stopPropagation();
  const groupe = bouton.closest(".navbar__groupe");
  const etaitOuvert = groupe.classList.contains("ouvert");
  document.querySelectorAll(".navbar__groupe.ouvert").forEach(g => g.classList.remove("ouvert"));
  if (!etaitOuvert) groupe.classList.add("ouvert");
  return;
}
// Clic en dehors de tout groupe → ferme tous les sous-menus ouverts
document.querySelectorAll(".navbar__groupe.ouvert").forEach(g => g.classList.remove("ouvert"));
});
}
attacherMenusNavbar();
// Exposée pour qu'auth.js puisse la ré-invoquer après avoir injecté le
// menu "Compte" — en pratique inutile désormais grâce à la délégation
// (un seul appel suffit pour tous les groupes, présents ou futurs),
// mais gardée pour ne rien supposer côté auth.js et rester robuste si
// cette fonction change un jour de stratégie.
window.reattacherMenusNavbar = () => {};

// Marque le lien actif selon la page courante
const chemin = window.location.pathname;
document.querySelectorAll(".navbar__link").forEach(lien => {
const href = lien.getAttribute("href");
if (href && chemin.endsWith(href)) lien.classList.add("actif");
});
}

// ════════════════════════════════════════════════════════════
//  SIDEBAR DASHBOARD (bouton toggle mobile)
// ════════════════════════════════════════════════════════════

function initSidebarMobile() {
const sidebar   = document.querySelector(".sidebar, .admin-sidebar");
let btnOuvrir = document.getElementById("btn-sidebar");
// Pages admin : le bouton « menu » n'existait pas, donc le tiroir restait inaccessible sur téléphone.
if (!btnOuvrir && sidebar && sidebar.classList.contains("admin-sidebar")) {
  const zone = document.querySelector(".navbar__inner");
  if (zone) {
    btnOuvrir = document.createElement("button");
    btnOuvrir.type = "button";
    btnOuvrir.id = "btn-sidebar";
    btnOuvrir.className = "navbar__hamburger navbar__hamburger--admin";
    btnOuvrir.setAttribute("aria-label", "Ouvrir le menu d'administration");
    btnOuvrir.setAttribute("aria-expanded", "false");
    btnOuvrir.innerHTML = "<span></span><span></span><span></span>";
    zone.insertBefore(btnOuvrir, zone.firstChild);   // à gauche : la barre admin est déjà large à droite
  }
}
if (!btnOuvrir || !sidebar) return;

// Overlay pour fermer
let overlay = document.querySelector(".sidebar__overlay");
if (!overlay) {
overlay = document.createElement("div");
overlay.className = "sidebar__overlay";
document.body.appendChild(overlay);
}
const majEtat = () => {
const ouvert = sidebar.classList.contains("ouvert");
overlay.style.display = ouvert ? "block" : "none";
btnOuvrir.setAttribute("aria-expanded", ouvert ? "true" : "false");
document.body.style.overflow = ouvert ? "hidden" : "";
};
btnOuvrir.addEventListener("click", () => { sidebar.classList.toggle("ouvert"); majEtat(); });
overlay.addEventListener("click", () => { sidebar.classList.remove("ouvert"); majEtat(); });
sidebar.addEventListener("click", (e) => { if (e.target.closest("a")) { sidebar.classList.remove("ouvert"); majEtat(); } });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { sidebar.classList.remove("ouvert"); majEtat(); } });
// Si l'écran s'élargit (rotation, tablette), on referme le tiroir et on rend le défilement à la page.
window.addEventListener("resize", () => { if (window.innerWidth > 768 && sidebar.classList.contains("ouvert")) { sidebar.classList.remove("ouvert"); majEtat(); } });
// À l'ouverture, on place le lien de la page courante dans la zone visible.
btnOuvrir.addEventListener("click", () => {
  const a = sidebar.querySelector(".sidebar__lien.actif, .admin-sidebar__lien.actif");
  if (a && sidebar.classList.contains("ouvert")) sidebar.scrollTop = Math.max(0, a.offsetTop - sidebar.clientHeight / 2);
});
}

// ════════════════════════════════════════════════════════════
//  MODAL
// ════════════════════════════════════════════════════════════

function ouvrirModal(id) {
const modal = document.getElementById(id);
if (modal) {
modal.classList.add("ouvert");
document.body.style.overflow = "hidden";
}
}

function fermerModal(id) {
const modal = document.getElementById(id);
if (modal) {
modal.classList.remove("ouvert");
document.body.style.overflow = "";
}
}

function initModals() {
// Ferme au clic sur l'overlay ou le bouton ×
document.querySelectorAll(".modal-overlay").forEach(overlay => {
overlay.addEventListener("click", (e) => {
if (e.target === overlay) overlay.classList.remove("ouvert");
});
});

document.querySelectorAll(".modal__fermer").forEach(btn => {
btn.addEventListener("click", () => {
btn.closest(".modal-overlay")?.classList.remove("ouvert");
document.body.style.overflow = "";
});
});

// Ferme avec Escape
document.addEventListener("keydown", (e) => {
if (e.key === "Escape") {
document.querySelectorAll(".modal-overlay.ouvert").forEach(m => {
m.classList.remove("ouvert");
document.body.style.overflow = "";
});
}
});
}

window.ouvrirModal = ouvrirModal;
window.fermerModal = fermerModal;

// ════════════════════════════════════════════════════════════
//  UTILITAIRES
// ════════════════════════════════════════════════════════════

// Formate un montant en FCFA
function formatFCFA(montant) {
return `${Number(montant).toLocaleString("fr-CI")} FCFA`;
}

// Formate une date ISO en français
function formatDate(date) {
if (!date) return "—";
return new Date(date).toLocaleDateString("fr-FR", {
day: "numeric", month: "long", year: "numeric"
});
}

// Tronque un texte à N caractères
function tronquer(texte, n = 80) {
if (!texte) return "";
return texte.length > n ? texte.slice(0, n) + "…" : texte;
}

// Extrait l'ID YouTube
function getYoutubeId(url) {
if (!url) return null;
const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
return m ? m[1] : null;
}

// Génère une miniature YouTube
function miniatureYoutube(url) {
const id = getYoutubeId(url);
return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// Lit un paramètre de l'URL
function getParam(nom) {
return new URLSearchParams(window.location.search).get(nom);
}

// Initialise les tooltips simples (data-tooltip)
function initTooltips() {
document.querySelectorAll("[data-tooltip]").forEach(el => {
el.style.position = "relative";
el.addEventListener("mouseenter", () => {
const tip = document.createElement("div");
tip.className = "tooltip";
tip.textContent = el.dataset.tooltip;
tip.style.cssText = `position:absolute; bottom:calc(100%+6px); left:50%; transform:translateX(-50%); background:#111; color:#fff; font-size:0.78rem; padding:5px 10px; border-radius:6px; white-space:nowrap; z-index:1000; pointer-events:none;`;
el.appendChild(tip);
});
el.addEventListener("mouseleave", () => {
el.querySelector(".tooltip")?.remove();
});
});
}

// Copier dans le presse-papier
async function copierTexte(texte) {
try {
await navigator.clipboard.writeText(texte);
afficherToast("Copié dans le presse-papier !", "succes", 2000);
return true;
} catch {
afficherToast("Impossible de copier.", "erreur");
return false;
}
}

// Debounce (limite les appels rapides)
function debounce(fn, delai = 300) {
let t;
return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delai); };
}

// Génère les initiales d'un nom
function initiales(nom) {
if (!nom) return "?";
return nom.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

// ════════════════════════════════════════════════════════════
//  SKELETON LOADERS
// ════════════════════════════════════════════════════════════

function afficherSkeleton(conteneur, n = 3, hauteur = "120px") {
if (!conteneur) return;
conteneur.innerHTML = Array(n).fill(0).map(() =>
`<div class="skeleton" style="height:${hauteur};margin-bottom:12px;border-radius:14px;"></div>`
).join("");
}

// ════════════════════════════════════════════════════════════
//  ÉTAT VIDE (empty state)
// ════════════════════════════════════════════════════════════

function afficherEtatVide(conteneur, { icone = "📭", titre = "Aucun résultat", texte = "", btnLabel = "", btnHref = "" } = {}) {
if (!conteneur) return;
conteneur.innerHTML = `<div class="empty-state"> <div class="empty-state__icone">${icone}</div> <div class="empty-state__titre">${titre}</div> ${texte ?`<p class="empty-state__texte">${texte}</p>`: ""} ${btnLabel ?`<a href="${btnHref}" class="btn btn--primaire btn--sm">${btnLabel}</a>`: ""} </div>`;
}

// ════════════════════════════════════════════════════════════
//  BANDEAU PREMIUM (pour utilisateurs non-Premium)
// ════════════════════════════════════════════════════════════

function afficherBandeauPremium() {
if (window.Auth?.estPremium()) return;
const bandeau = document.getElementById("bandeau-premium");
if (bandeau) bandeau.classList.remove("hidden");
}

// ════════════════════════════════════════════════════════════
//  INITIALISATION AU CHARGEMENT
// ════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
initNavbar();
initSidebarMobile();
initModals();
initTooltips();

// Met à jour la navbar selon la session (valeurs en cache, affichage immédiat)
if (window.Auth?.mettreAJourNavbar) {
window.Auth.mettreAJourNavbar();
}

// Revérifie le profil auprès du serveur en arrière-plan, silencieusement.
// Sans ça, un changement de rôle (ex: promotion admin) ou de statut
// Premium fait en base pendant que l'utilisateur est déjà connecté ne
// se reflète jamais dans le navigateur tant qu'il ne se déconnecte pas
// manuellement — le token/localStorage restent figés sur leur état au
// moment de la connexion. Ici, dès qu'une page se charge, on relit
// l'état réel et on met à jour l'affichage (bouton Admin, badge
// Premium) si besoin, sans bloquer le rendu initial de la page.
if (window.Auth?.estConnecte?.() && window.Auth?.rafraichirProfil) {
window.Auth.rafraichirProfil().then(() => {
if (window.Auth?.mettreAJourNavbar) window.Auth.mettreAJourNavbar();
});
}

// Affiche le bandeau premium si pertinent
afficherBandeauPremium();

// Animation d'apparition des sections
const observer = new IntersectionObserver(
(entries) => entries.forEach(e => {
if (e.isIntersecting) {
e.target.style.opacity    = "1";
e.target.style.transform  = "translateY(0)";
}
}),
{ threshold: 0.1 }
);

document.querySelectorAll(".section, .card, .stat-card").forEach(el => {
el.style.opacity   = "0";
el.style.transform = "translateY(20px)";
el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
observer.observe(el);
});
});

// ── Exporte tout en global ────────────────────────────────────
window.Utils = {
formatFCFA, formatDate, tronquer,
getYoutubeId, miniatureYoutube, getParam,
copierTexte, debounce, initiales,
afficherSkeleton, afficherEtatVide, afficherBandeauPremium,
};

// ════════════════════════════════════════════════════════════
//  Bascule affichage/masquage des mots de passe (icône œil)
//  Ajoute automatiquement un bouton œil à tout champ
//  <input type="password" data-toggle-oeil> de la page.
// ════════════════════════════════════════════════════════════
function initTogglePasswords() {
document.querySelectorAll('input[type="password"][data-toggle-oeil]').forEach((input) => {
if (input.dataset.oeilInit) return; // évite une double-initialisation
input.dataset.oeilInit = "1";

const wrapper = document.createElement("div");
wrapper.style.position = "relative";
input.parentNode.insertBefore(wrapper, input);
wrapper.appendChild(input);
input.style.paddingRight = "42px";

const btn = document.createElement("button");
btn.type = "button";
btn.setAttribute("aria-label", "Afficher ou masquer le mot de passe");
btn.style.cssText =
  "position:absolute; right:8px; top:50%; transform:translateY(-50%); " +
  "background:none; border:none; cursor:pointer; padding:6px; " +
  "display:flex; align-items:center; color:var(--gris-texte,#666); z-index:2;";
btn.innerHTML =
  '<span data-icone="oeil" data-taille="18" style="display:inline-flex; position:relative;"></span>';
const traitBarre = document.createElement("span");
// Petit trait diagonal superposé quand le mot de passe est masqué,
// pour indiquer visuellement l'état "caché" (convention œil barré)
traitBarre.style.cssText =
  "position:absolute; width:20px; height:2px; background:currentColor; " +
  "top:50%; left:50%; transform:translate(-50%,-50%) rotate(-45deg); border-radius:2px;";
btn.style.position = "absolute";
btn.appendChild(traitBarre);

const majBarre = () => {
  traitBarre.style.display = input.type === "password" ? "block" : "none";
};
majBarre();

btn.addEventListener("click", () => {
  input.type = input.type === "password" ? "text" : "password";
  majBarre();
});

wrapper.appendChild(btn);
});
}
document.addEventListener("DOMContentLoaded", initTogglePasswords);
window.initTogglePasswords = initTogglePasswords;

// ════════════════════════════════════════════════════════════
//  INSTALLATION DE L'APPLICATION (Android, ordinateur, iPhone)
//  - Android / ordinateur : fenêtre d'installation native du navigateur
//  - iPhone / iPad : explications (Safari n'a pas de fenêtre native)
//  Les boutons marqués data-installer-app sont masqués si l'application
//  est déjà installée ou ouverte depuis Google Play.
// ════════════════════════════════════════════════════════════
(function initInstallationApp() {
  let evenement = null;
  const dejaInstallee =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    (document.referrer || "").startsWith("android-app://");
  const estIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  function majBoutons() {
    document.querySelectorAll("[data-installer-app]").forEach((b) => {
      b.hidden = dejaInstallee;
    });
  }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    evenement = e;
  });
  window.addEventListener("appinstalled", () => {
    evenement = null;
    dejaInstallee || window.afficherToast?.("Application installée. Retrouvez-la sur votre écran d'accueil.", "succes");
  });

  function fenetreAide(titre, etapes) {
    document.getElementById("aide-installation")?.remove();
    const fond = document.createElement("div");
    fond.id = "aide-installation";
    fond.setAttribute("role", "dialog");
    fond.setAttribute("aria-modal", "true");
    fond.style.cssText = "position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center;padding:16px;";
    const carte = document.createElement("div");
    carte.style.cssText = "background:#fff;color:#1f2937;border-radius:16px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,.3);margin-bottom:8px;";
    const h = document.createElement("h3");
    h.textContent = titre; h.style.cssText = "margin:0 0 12px;font-size:1.05rem;";
    const ol = document.createElement("ol");
    ol.style.cssText = "margin:0 0 16px;padding-left:20px;line-height:1.7;font-size:.92rem;";
    etapes.forEach((t) => { const li = document.createElement("li"); li.textContent = t; ol.appendChild(li); });
    const ok = document.createElement("button");
    ok.type = "button"; ok.textContent = "J'ai compris"; ok.className = "btn btn--primaire btn--full";
    ok.onclick = () => fond.remove();
    fond.onclick = (e) => { if (e.target === fond) fond.remove(); };
    carte.append(h, ol, ok); fond.appendChild(carte); document.body.appendChild(fond);
  }

  window.installerPWA = async function () {
    if (evenement) {
      evenement.prompt();
      await evenement.userChoice;
      evenement = null;
      return;
    }
    if (estIOS) {
      fenetreAide("Installer ProInsertion CI sur votre iPhone", [
        "Ouvrez ce site dans Safari (pas dans une autre application).",
        "Touchez le bouton Partager (le carré avec une flèche vers le haut).",
        "Choisissez « Sur l'écran d'accueil », puis touchez « Ajouter ».",
      ]);
      return;
    }
    fenetreAide("Installer ProInsertion CI", [
      "Ouvrez le menu de votre navigateur (les trois points en haut à droite).",
      "Choisissez « Installer l'application » ou « Ajouter à l'écran d'accueil ».",
      "Confirmez : l'icône apparaît sur votre écran d'accueil.",
    ]);
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-installer-app]");
    if (b) { e.preventDefault(); window.installerPWA(); }
  });
  document.addEventListener("DOMContentLoaded", majBoutons);
  window.addEventListener("load", majBoutons);
})();

// ════════════════════════════════════════════════════════════
//  SERVICE WORKER (PWA + notifications push — Lot 11)
// ════════════════════════════════════════════════════════════
if ("serviceWorker" in navigator) {
window.addEventListener("load", () => {
navigator.serviceWorker.register("/sw.js").catch((err) => {
console.error("Erreur enregistrement service worker :", err.message);
});
});
}
/* ── Pagination des listes d'administration ───────────────────
   window.paginer(cle, liste, tbody, rerendre) renvoie les lignes de la page
   courante (25 par défaut) et affiche la navigation sous le tableau. */
(function () {
  const etats = {};
  function conteneur(cle, tbody) {
    let c = document.getElementById("pag-" + cle);
    if (!c) {
      c = document.createElement("div");
      c.id = "pag-" + cle;
      c.className = "pagination-admin";
      const table = tbody && tbody.closest ? tbody.closest("table") : null;
      const hote = table && table.parentElement ? table.parentElement : (tbody && tbody.parentElement);
      if (hote) hote.insertAdjacentElement("afterend", c);
    }
    return c;
  }
  function numeros(page, pages) {
    const s = new Set([1, pages, page - 1, page, page + 1]);
    const l = [...s].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
    const r = [];
    l.forEach((n, i) => { if (i && n - l[i - 1] > 1) r.push("…"); r.push(n); });
    return r;
  }
  window.paginer = function (cle, liste, tbody, rerendre, parPageDefaut) {
    const e = etats[cle] || (etats[cle] = { page: 1, n: -1, parPage: parPageDefaut || 25, nav: false });
    const total = liste.length;
    if (total !== e.n && !e.nav) e.page = 1;
    e.nav = false;
    e.n = total;
    const pages = Math.max(1, Math.ceil(total / e.parPage));
    if (e.page > pages) e.page = pages;
    const c = conteneur(cle, tbody);
    if (!c) return liste;
    if (total <= Math.min(e.parPage, 25) && e.parPage === 25) { c.innerHTML = ""; return liste.slice(0, e.parPage); }
    const debut = (e.page - 1) * e.parPage;
    const fin = Math.min(total, debut + e.parPage);
    c.innerHTML =
      `<div class="pagination-admin__info">${total ? debut + 1 : 0}–${fin} sur ${total}</div>` +
      `<div class="pagination-admin__nav">` +
      `<button type="button" data-p="${e.page - 1}" ${e.page <= 1 ? "disabled" : ""}>Préc.</button>` +
      numeros(e.page, pages).map((n) => n === "…" ? `<span>…</span>` : `<button type="button" data-p="${n}" class="${n === e.page ? "actif" : ""}">${n}</button>`).join("") +
      `<button type="button" data-p="${e.page + 1}" ${e.page >= pages ? "disabled" : ""}>Suiv.</button></div>` +
      `<label class="pagination-admin__taille">Par page <select>${[25, 50, 100].map((n) => `<option ${n === e.parPage ? "selected" : ""}>${n}</option>`).join("")}</select></label>`;
    c.querySelectorAll("button[data-p]").forEach((b) => b.addEventListener("click", () => {
      e.page = Number(b.dataset.p); e.nav = true; rerendre();
      const t = tbody.closest("table"); if (t) t.scrollIntoView({ block: "start", behavior: "smooth" });
    }));
    c.querySelector("select").addEventListener("change", (ev) => { e.parPage = Number(ev.target.value); e.page = 1; e.nav = true; rerendre(); });
    return liste.slice(debut, fin);
  };
})();

/* Colonne admin : place le lien de la page courante dans la zone visible. */
document.addEventListener("DOMContentLoaded", () => {
  const a = document.querySelector(".admin-sidebar__lien.actif");
  const s = a && a.closest(".admin-sidebar");
  if (s) s.scrollTop = Math.max(0, a.offsetTop - s.clientHeight / 2);
});

// ── Mesure d'audience intégrée ───────────────────────────────────────────────
// Sans cookie, sans adresse IP conservée ; « Ne pas me suivre » (DNT / GPC)
// respecté ; jamais sur les pages d'administration. Voir confidentialite.html.
(function mesureAudience() {
  try {
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl) return;
    const chemin = location.pathname;
    if (chemin.indexOf("/admin") === 0 || !window.API_URL) return;
    let entree = false;
    try {
      if (!sessionStorage.getItem("ecc_session")) { sessionStorage.setItem("ecc_session", "1"); entree = true; }
    } catch (e) { /* stockage indisponible : on ne compte pas d'entrée */ }
    let src;
    try {
      const u = new URLSearchParams(location.search).get("utm_source");
      if (u && /^[a-z0-9_-]{1,30}$/.test(u)) src = u;
    } catch (e) {}
    let membre = false;
    try { membre = !!localStorage.getItem("ecc_token"); } catch (e) {}
    fetch(window.API_URL + "/stats/visite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chemin, entree, referent: entree ? document.referrer : "", src, membre }),
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch (e) { /* la mesure ne doit jamais gêner le site */ }
})();


// ════════════════════════════════════════════════════════════
//  RECHERCHE GLOBALE (espace connecté) — pages, outils et services
//  Liste locale : aucune donnée envoyée, aucune dépendance. « Entrée »
//  sans résultat lance la recherche dans les offres d'emploi.
// ════════════════════════════════════════════════════════════
(function rechercheGlobale() {
  let connecte = false;
  try { connecte = !!localStorage.getItem("ecc_token"); } catch (e) {}
  if (!connecte || location.pathname.indexOf("/admin") === 0) return;

  const INDEX = [
    ["Tableau de bord", "accueil espace statistiques score bienvenue", "/dashboard/index.html", "graphique"],
    ["Créer mon CV", "cv curriculum vitae modèle générateur photo", "/cv-generator.html", "document"],
    ["Lettre de motivation", "lettre candidature rédiger motivation", "/cv-generator.html", "lettre"],
    ["Offres d'emploi", "emploi travail poste recrutement job cdi cdd", "/emploi.html", "portefeuille"],
    ["Offres de stage", "stage stagiaire alternance opportunité", "/emploi.html?opportunite=stage", "portefeuille"],
    ["Analyser une offre", "analyse offre compatibilité cv score", "/analyse-offre.html", "loupe"],
    ["Simulation d'entretien", "entretien embauche simulation questions préparation", "/simulation-entretien.html", "aide"],
    ["Mes candidatures", "suivi candidatures postulé relance historique", "/dashboard/suivi-candidatures.html", "liste"],
    ["Alertes emploi", "alerte notification offres recevoir", "/dashboard/suivi-candidatures.html", "liste"],
    ["Concours", "concours fonction publique examen recrutement", "/concours.html", "institution"],
    ["Mes concours", "concours suivis favoris dates", "/dashboard/mes-concours.html", "institution"],
    ["Calendrier", "agenda dates échéances rappels", "/dashboard/calendrier.html", "horloge"],
    ["Assistant concours", "assistant aide concours conseils", "/assistant-concours.html", "etoile"],
    ["Packs", "pack offre tarif cv lettre entretien prix", "/packs.html", "fusee"],
    ["Courriers et documents", "courrier lettre demande rapport document rédaction démission congé", "/documents-redaction.html", "document"],
    ["Documents professionnels", "documents pro contrat attestation professionnel", "/documents-pro.html", "portefeuille"],
    ["Documents administratifs", "administratif administration formulaire dossier", "/documents-admin.html", "document"],
    ["Assistance sociale", "aide sociale structures urgence assistance santé famille", "/assistance-sociale.html", "aide"],
    ["Communauté", "communauté entraide échanger membres", "/communaute.html", "utilisateurs"],
    ["Marketplace", "marketplace boutique vendre acheter", "/marketplace.html", "panier"],
    ["Abonnement Premium", "premium abonnement payer wave orange money tarifs", "/boutique.html", "etoile"],
    ["Mon abonnement", "abonnement paiements factures expiration", "/dashboard/paiements.html", "paiement"],
    ["Mon profil", "profil compte informations mot de passe photo rappels", "/dashboard/profil.html", "utilisateurs"],
    ["Messages", "messages notifications boîte", "/dashboard/messages.html", "enveloppeFermee"],
    ["Aide", "aide guide assistance questions contact support", "/guide.html", "aide"],
  ];
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  function monter() {
    const zone = document.querySelector("#navbar .navbar__inner, .navbar .navbar__inner");
    if (!zone || document.getElementById("rg")) return;
    const bloc = document.createElement("div");
    bloc.className = "rg"; bloc.id = "rg";
    bloc.innerHTML = `
      <button type="button" class="rg__ouvrir" aria-label="Rechercher" aria-expanded="false"><span data-icone="loupe" data-taille="20"></span></button>
      <form class="rg__form" role="search" autocomplete="off">
        <span class="rg__loupe" aria-hidden="true"><span data-icone="loupe" data-taille="17"></span></span>
        <input class="rg__champ" type="search" id="rg-champ" placeholder="Rechercher…" aria-label="Rechercher sur ProInsertion CI" role="combobox" aria-expanded="false" aria-controls="rg-liste" maxlength="80" />
        <button type="button" class="rg__fermer" aria-label="Fermer la recherche">×</button>
        <div class="rg__liste" id="rg-liste" role="listbox" hidden></div>
      </form>`;
    const avant = zone.querySelector(".navbar__actions");
    zone.insertBefore(bloc, avant || zone.querySelector(".navbar__hamburger"));
    if (window.initIcones) window.initIcones(bloc);
    brancher(bloc);
  }

  function brancher(bloc) {
    const champ = bloc.querySelector(".rg__champ"), liste = bloc.querySelector(".rg__liste");
    const form = bloc.querySelector(".rg__form"), ouvrir = bloc.querySelector(".rg__ouvrir");
    let actif = -1, items = [];

    function rendre(q) {
      const mots = norm(q).split(/\s+/).filter(Boolean);
      items = mots.length
        ? INDEX.filter((e) => { const t = norm(e[0] + " " + e[1]); return mots.every((m) => t.includes(m)); }).slice(0, 6).map((e) => ({ titre: e[0], href: e[2], icone: e[3], type: "Page" }))
        : INDEX.slice(0, 6).map((e) => ({ titre: e[0], href: e[2], icone: e[3], type: "Page" }));
      if (mots.length) items.push({ titre: "Chercher « " + q.trim() + " » dans les offres d'emploi", href: "/emploi.html?q=" + encodeURIComponent(q.trim()), icone: "loupe", type: "Emploi" });
      actif = items.length ? 0 : -1;
      liste.innerHTML = items.map((it, i) => `<a href="${esc(it.href)}" class="rg__item${i === actif ? " rg__item--actif" : ""}" role="option" id="rg-o${i}" data-i="${i}"><span class="rg__icone"><span data-icone="${esc(it.icone)}" data-taille="16"></span></span><span class="rg__titre">${esc(it.titre)}</span><span class="rg__type">${esc(it.type)}</span></a>`).join("")
        || '<div class="rg__vide">Aucun résultat</div>';
      liste.hidden = false; champ.setAttribute("aria-expanded", "true");
      if (window.initIcones) window.initIcones(liste);
    }
    function fermerListe() { liste.hidden = true; champ.setAttribute("aria-expanded", "false"); }
    function surligner(i) {
      liste.querySelectorAll(".rg__item").forEach((a, k) => a.classList.toggle("rg__item--actif", k === i));
      actif = i; if (items[i]) champ.setAttribute("aria-activedescendant", "rg-o" + i);
    }
    champ.addEventListener("input", () => rendre(champ.value));
    champ.addEventListener("focus", () => rendre(champ.value));
    champ.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); if (items.length) surligner((actif + 1) % items.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (items.length) surligner((actif - 1 + items.length) % items.length); }
      else if (e.key === "Escape") { fermerListe(); bloc.classList.remove("rg--ouvert"); ouvrir.setAttribute("aria-expanded", "false"); champ.blur(); }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = champ.value.trim();
      if (items[actif]) { location.href = items[actif].href; }
      else if (q) { location.href = "/emploi.html?q=" + encodeURIComponent(q); }
    });
    document.addEventListener("click", (e) => { if (!bloc.contains(e.target)) fermerListe(); });
    ouvrir.addEventListener("click", () => {
      const o = bloc.classList.toggle("rg--ouvert");
      ouvrir.setAttribute("aria-expanded", o ? "true" : "false");
      if (o) setTimeout(() => champ.focus(), 30); else fermerListe();
    });
    bloc.querySelector(".rg__fermer").addEventListener("click", () => { champ.value = ""; fermerListe(); bloc.classList.remove("rg--ouvert"); ouvrir.setAttribute("aria-expanded", "false"); });
    // Raccourci clavier « / » (ordinateur), sans gêner la saisie dans un champ.
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); if (window.innerWidth <= 900) ouvrir.click(); else champ.focus(); }
    });
  }

  // Le header membre est injecté par layout.js : on attend qu'il soit en place.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(monter, 0));
  else setTimeout(monter, 0);
})();
