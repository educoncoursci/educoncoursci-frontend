// ============================================================
//  js/main.js — Script global EduConcoursCI
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
toast.innerHTML = `<span>${icones[type] || "ℹ️"}</span><span>${message}</span>`;

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

// Ombre au scroll
window.addEventListener("scroll", () => {
navbar.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

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
document.querySelectorAll(".navbar__groupe").forEach(groupe => {
  const bouton = groupe.querySelector(".navbar__groupe-btn");
  if (!bouton) return;

  bouton.addEventListener("click", (e) => {
    e.stopPropagation();
    const etaitOuvert = groupe.classList.contains("ouvert");
    // Ferme tous les autres groupes avant d'ouvrir celui-ci
    document.querySelectorAll(".navbar__groupe.ouvert").forEach(g => g.classList.remove("ouvert"));
    if (!etaitOuvert) groupe.classList.add("ouvert");
  });
});

// Ferme tous les sous-menus au clic en dehors de la navbar
document.addEventListener("click", () => {
  document.querySelectorAll(".navbar__groupe.ouvert").forEach(g => g.classList.remove("ouvert"));
});

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
const btnOuvrir = document.getElementById("btn-sidebar");
const sidebar   = document.querySelector(".sidebar, .admin-sidebar");
if (!btnOuvrir || !sidebar) return;

btnOuvrir.addEventListener("click", () => sidebar.classList.toggle("ouvert"));

// Overlay pour fermer
let overlay = document.querySelector(".sidebar__overlay");
if (!overlay) {
overlay = document.createElement("div");
overlay.className = "sidebar__overlay";
document.body.appendChild(overlay);
}
overlay.addEventListener("click", () => sidebar.classList.remove("ouvert"));
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

// Met à jour la navbar selon la session
if (window.Auth?.mettreAJourNavbar) {
window.Auth.mettreAJourNavbar();
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
//  SERVICE WORKER (PWA + notifications push — Lot 11)
// ════════════════════════════════════════════════════════════
if ("serviceWorker" in navigator) {
window.addEventListener("load", () => {
navigator.serviceWorker.register("/sw.js").catch((err) => {
console.error("Erreur enregistrement service worker :", err.message);
});
});
}