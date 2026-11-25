// ============================================================
//  js/layout.js — Header (navbar) et footer partagés
//  Source UNIQUE de vérité pour la navigation et le pied de page,
//  injectée dans chaque page via <div id="site-header"></div> et
//  <div id="site-footer"></div>.
//
//  Pourquoi : avant ce fichier, le nav et le footer étaient copiés-
//  collés dans chaque page HTML (19 copies pour le nav, 13 pour le
//  footer), avec des divergences accumulées au fil des modifications
//  (ex: examens.html avait un menu mobile incomplet par rapport aux
//  autres pages). Un seul endroit à modifier maintenant pour changer
//  le menu ou le footer sur tout le site.
//
//  IMPORTANT : ce script doit être chargé en <script src="/js/layout.js">
//  classique (ni async ni defer), placé dans le <body> après les
//  placeholders #site-header/#site-footer, pour s'exécuter de façon
//  synchrone avant DOMContentLoaded — main.js et auth.js (qui
//  s'initialisent sur DOMContentLoaded) trouvent alors le nav/footer
//  déjà présents dans le DOM.
// ============================================================

// ============================================================
//  CONFIGURATION DU SITE — À REMPLIR PAR LE PROPRIÉTAIRE
//  Un seul endroit pour les réseaux sociaux et les statistiques.
//  Laisse une valeur vide ("") pour désactiver l'élément concerné :
//  une icône sans lien n'est jamais affichée.
// ============================================================
window.SITE_CONFIG = {
  reseaux: {
    whatsappChaine: "https://whatsapp.com/channel/0029VbDzIDO1SWssN1HvpR31", // ex : "https://whatsapp.com/channel/XXXXXXXX"
    linkedin: "https://www.linkedin.com/in/proinsertion-ci-137226450/",
    facebook: "https://www.facebook.com/share/1MBFGVBjf5/",       // ex : "https://www.facebook.com/proinsertionci"
    instagram: "",
    tiktok: "",         // ex : "https://www.tiktok.com/@proinsertionci"
    youtube: "",
  },
  // Statistiques de visite (une seule des deux) :
  //  - fournisseur "cloudflare" : id = jeton « Web Analytics » (sans cookies)
  //  - fournisseur "ga4"        : id = identifiant de mesure « G-XXXXXXXXXX »
  analytics: { fournisseur: "", id: "" },
};

const EDUCONCOURSCI_HEADER_HTML = `<nav class="navbar" id="navbar">
      <div class="navbar__inner">
        <a href="/" class="navbar__logo">
          <div class="navbar__logo-icon"><img src="/assets/logo-icon.png" alt="ProInsertion CI" /></div>
          <span class="navbar__logo-bloc"><span class="navbar__logo-texte">Pro<span>Insertion</span> <span class="navbar__ci">CI</span></span><small class="navbar__slogan">Votre réussite, notre priorité</small></span>
        </a>

                <ul class="navbar__links">
          <li class="navbar__groupe">
            <button class="navbar__groupe-btn">
              Services
              <svg class="navbar__groupe-fleche" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="navbar__sous-menu">
              <a href="/cv-generator.html" class="navbar__sous-lien"><span data-icone="fusee" data-taille="16"></span> CV & Lettre de motivation</a>
              <a href="/packs.html" class="navbar__sous-lien"><span data-icone="fusee" data-taille="16"></span> Packs</a>
              <a href="/documents-redaction.html" class="navbar__sous-lien"><span data-icone="document" data-taille="16"></span> Courriers et documents</a>
              <a href="/documents-pro.html" class="navbar__sous-lien"><span data-icone="portefeuille" data-taille="16"></span> Documents Professionnels</a>
              <a href="/documents-admin.html" class="navbar__sous-lien"><span data-icone="document" data-taille="16"></span> Documents Administratifs</a>
              <a href="/emploi.html" class="navbar__sous-lien"><span data-icone="loupe" data-taille="16"></span> Offres d'emploi</a>
              <a href="/emploi.html?opportunite=stage" class="navbar__sous-lien"><span data-icone="graphique" data-taille="16"></span> Offres de stage</a>
              <a href="/analyse-offre.html" class="navbar__sous-lien"><span data-icone="loupe" data-taille="16"></span> Analyser une offre</a>
              <a href="/simulation-entretien.html" class="navbar__sous-lien"><span data-icone="aide" data-taille="16"></span> Simulation d'entretien</a>
            </div>
          </li>
          <li><a href="/concours.html" class="navbar__link">Concours</a></li>
          <li class="navbar__groupe">
            <button class="navbar__groupe-btn">
              Ressources
              <svg class="navbar__groupe-fleche" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="navbar__sous-menu">
              <a href="/assistant-concours.html" class="navbar__sous-lien"><span data-icone="etoile" data-taille="16"></span> Assistant Concours</a>
              <a href="/communaute.html" class="navbar__sous-lien"><span data-icone="aide" data-taille="16"></span> Communauté</a>
              <a href="/marketplace.html" class="navbar__sous-lien"><span data-icone="panier" data-taille="16"></span> Marketplace</a>
              <a href="/demarches.html" class="navbar__sous-lien"><span data-icone="document" data-taille="16"></span> Démarches</a>
            </div>
          </li>
          <li><a href="/assistance-sociale.html" class="navbar__link">Assistance Sociale</a></li>
          <li><a href="/boutique.html" class="navbar__link">Premium</a></li>
        </ul>

        <div class="navbar__actions" id="navbar-actions">
          <a href="/auth/login.html" class="btn btn--outline-vert btn--sm"
            >Connexion</a
          >
          <a href="/auth/register.html" class="btn btn--primaire btn--sm"
            >Inscription gratuite</a
          >
        </div>

        <button class="navbar__hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div class="navbar__mobile navbar__mobile--visiteur" id="menu-mobile">
        <p class="navbar__mobile-titre">Bienvenue sur ProInsertion&nbsp;CI</p>
        <p class="navbar__mobile-texte">Connectez-vous ou créez votre compte gratuit pour accéder à tous les services.</p>
        <div id="navbar-mobile-actions">
          <a href="/auth/login.html" class="btn btn--outline-vert btn--sm w-full">Connexion</a>
          <a href="/auth/register.html" class="btn btn--primaire btn--sm w-full mt-1">Inscription gratuite</a>
        </div>
      </div>
    </nav>`;

// ── Icônes des réseaux sociaux, intégrées ici : elles s'affichent sur toutes les pages, même sans icons.js ──
const SVG_RESEAUX = {
  facebook: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" ><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z"/></svg>`,
  linkedin: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" ><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>`,
  instagram: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" ><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>`,
  whatsapp: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" ><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.7.8.2.1.4.2.4.3.1.3.1.8-.1 1.5z"/></svg>`,
  tiktok: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" ><path d="M12.5 2h3.3c.2 1.7 1.4 3.6 3.7 3.9v3.3a6.9 6.9 0 01-3.7-1.2v6.2a5.6 5.6 0 11-5.6-5.6c.3 0 .6 0 .9.1v3.4a2.3 2.3 0 10 1.4 2.1V2z"/></svg>`,
  youtube: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" ><path d="M22.5 6.2a2.8 2.8 0 00-2-2C18.9 3.7 12 3.7 12 3.7s-6.9 0-8.5.5a2.8 2.8 0 00-2 2A29 29 0 001 12a29 29 0 00.5 5.8 2.8 2.8 0 002 2c1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5a2.8 2.8 0 002-2 29 29 0 00.5-5.8 29 29 0 00-.5-5.8zM9.8 15.5V8.5l6 3.5-6 3.5z"/></svg>`,
};

// ── Réseaux sociaux : seuls les liens renseignés sont affichés ──
function construireReseaux() {
  const r = window.SITE_CONFIG.reseaux || {};
  const liste = [
    ["Facebook", "facebook", r.facebook],
    ["LinkedIn", "linkedin", r.linkedin],
    ["Instagram", "instagram", r.instagram],
    ["WhatsApp", "whatsapp", r.whatsappChaine],
    ["TikTok", "tiktok", r.tiktok],
    ["YouTube", "youtube", r.youtube],
  ].filter(([, , url]) => typeof url === "string" && /^https:\/\//i.test(url));
  if (!liste.length) return "";
  return `<div class="footer__reseaux">` + liste.map(([nom, icone, url]) =>
    `<a href="${url.replace(/"/g, "&quot;")}" class="footer__reseau" aria-label="${nom}" target="_blank" rel="noopener noreferrer">${SVG_RESEAUX[icone] || ""}</a>`
  ).join("") + `</div>`;
}

// ── Partage WhatsApp (utilisable depuis toutes les pages) ──
// Ajoute ?utm_source=<source> à un lien du site (si absent), pour que la mesure
// d'audience sache d'où viennent les visites (WhatsApp ne transmet pas la provenance).
window.lienAvecSource = function (url, source) {
  try {
    const u = new URL(url || window.location.href, window.location.href);
    if (u.origin === window.location.origin && !u.searchParams.has("utm_source")) u.searchParams.set("utm_source", source);
    return u.toString();
  } catch (e) { return url || window.location.href; }
};
window.partagerWhatsApp = function (texte, url) {
  const lien = window.lienAvecSource(url, "whatsapp");
  window.open("https://wa.me/?text=" + encodeURIComponent(texte + " " + lien), "_blank", "noopener");
};


const EDUCONCOURSCI_FOOTER_HTML = `<footer class="footer footer--compact">
      <div class="container">
        <div class="footer__haut">
          <div class="footer__marque"><a href="/" class="footer__logo"><img src="/assets/logo-icon.png" alt="" style="width:22px;height:22px;object-fit:contain;" /><span>ProInsertion CI</span></a><span class="footer__slogan">Votre réussite, notre priorité</span></div>
          ${construireReseaux()}
        </div>
        <nav class="footer__liens" aria-label="Liens du site">
          <a href="/concours.html" class="footer__lien">Concours</a>
          <a href="/comment-ca-marche.html" class="footer__lien">Comment ça marche</a>
          <a href="/a-propos.html" class="footer__lien">À propos</a>
          <a href="/cv-generator.html" class="footer__lien">Générateur CV/LM</a>
          <a href="/analyse-offre.html" class="footer__lien">Analyser une offre</a>
          <a href="/simulation-entretien.html" class="footer__lien">Simulation d'entretien</a>
          <a href="/packs.html" class="footer__lien">Packs</a>
          <a href="/documents-redaction.html" class="footer__lien">Courriers et documents</a>
          <a href="/documents-pro.html" class="footer__lien">Documents Pro</a>
          <a href="/documents-admin.html" class="footer__lien">Documents Admin</a>
          <a href="/emploi.html" class="footer__lien">Emploi & Stages</a>
          <a href="/assistance-sociale.html" class="footer__lien">Assistance Sociale</a>
          <a href="/boutique.html" class="footer__lien">Premium</a>
          <a href="/alertes.html" class="footer__lien">Alertes e-mail</a>
          <a href="/guide.html" class="footer__lien">Guide d'utilisation</a>
          <a href="/auth/login.html" class="footer__lien">Connexion</a>
          <a href="/auth/register.html" class="footer__lien">Inscription</a>
          <a href="/dashboard/index.html" class="footer__lien">Mon espace</a>
          <a href="/dashboard/paiements.html" class="footer__lien">Mes paiements</a>
        </nav>
      </div>
      <div class="footer__bas">
        <div class="container">
          © 2026 ProInsertion CI · Abidjan, Côte d'Ivoire · <a href="/conditions.html">Conditions</a> · <a href="/supprimer-compte.html">Supprimer mon compte</a> · <a href="/confidentialite.html">Confidentialité</a> · <a href="#" data-installer-app>📲 Installer l'application</a>
        </div>
      </div>
    </footer>`;

// ── Variante « espace connecté » : navigation de travail (pas de vitrine) ──
function estSessionMembre() {
  try { return !!localStorage.getItem("ecc_token"); } catch (e) { return false; }
}
function lienMembre(href, libelle, icone, mobile) {
  const actif = location.pathname === href;
  const cls = "navbar__link";
  return `<a href="${href}" class="${cls}${actif ? " actif" : ""}"${actif ? ' aria-current="page"' : ""}>${icone ? `<span data-icone="${icone}" data-taille="${mobile ? 18 : 16}" style="margin-right:7px;vertical-align:-3px;"></span>` : ""}${libelle}</a>`;
}
function construireHeaderMembre() {
  const principaux = [
    ["/dashboard/index.html", "Tableau de bord", "graphique"],
    ["/cv-generator.html", "CV & lettres", "document"],
    ["/emploi.html", "Emplois & stages", "portefeuille"],
    ["/dashboard/suivi-candidatures.html", "Candidatures", "liste"],
    ["/concours.html", "Concours", "institution"],
  ];
  const plus = [
    ["/analyse-offre.html", "Analyser une offre", "loupe"],
    ["/simulation-entretien.html", "Simulation d'entretien", "aide"],
    ["/documents-redaction.html", "Courriers et documents", "document"],
    ["/packs.html", "Packs", "fusee"],
    ["/assistance-sociale.html", "Assistance sociale", "aide"],
    ["/communaute.html", "Communauté", "utilisateurs"],
    ["/marketplace.html", "Marketplace", "panier"],
    ["/boutique.html", "Abonnement Premium", "etoile"],
  ];
  return `<nav class="navbar navbar--membre" id="navbar">
      <div class="navbar__inner">
        <a href="/dashboard/index.html" class="navbar__logo">
          <div class="navbar__logo-icon"><img src="/assets/logo-icon.png" alt="ProInsertion CI" /></div>
          <span class="navbar__logo-texte">Pro<span>Insertion</span> <span class="navbar__ci">CI</span></span>
        </a>
        <ul class="navbar__links">
          ${principaux.map(([h, l]) => `<li>${lienMembre(h, l, "", false)}</li>`).join("")}
          <li class="navbar__groupe">
            <button class="navbar__groupe-btn">Plus
              <svg class="navbar__groupe-fleche" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="navbar__sous-menu">
              ${plus.map(([h, l, i]) => `<a href="${h}" class="navbar__sous-lien"><span data-icone="${i}" data-taille="16"></span> ${l}</a>`).join("")}
            </div>
          </li>
        </ul>
        <div class="navbar__actions" id="navbar-actions"></div>
        <button class="navbar__hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
      <div class="navbar__mobile" id="menu-mobile">
        ${principaux.map(([h, l, i]) => lienMembre(h, l, i, true)).join("")}
        <hr style="border:none;border-top:1px solid var(--gris-bordure);margin:8px 0;" />
        ${plus.map(([h, l, i]) => lienMembre(h, l, i, true)).join("")}
        <hr style="border:none;border-top:1px solid var(--gris-bordure);margin:8px 0;" />
        <a href="/dashboard/profil.html" class="navbar__link"><span data-icone="utilisateurs" data-taille="18" style="margin-right:7px;vertical-align:-3px;"></span>Mon profil</a>
        <a href="/dashboard/paiements.html" class="navbar__link"><span data-icone="paiement" data-taille="18" style="margin-right:7px;vertical-align:-3px;"></span>Mon abonnement</a>
        <hr style="border:none;border-top:1px solid var(--gris-bordure);margin:8px 0;" />
        <div id="navbar-mobile-actions"></div>
      </div>
    </nav>`;
}
const FOOTER_MEMBRE_HTML = `<footer class="footer footer--membre">
      <div class="container footer--membre__inner">
        <span>© 2026 ProInsertion CI</span>
        <nav aria-label="Aide et informations">
          <a href="/guide.html">Aide</a>
          <a href="/conditions.html">Conditions</a>
          <a href="/confidentialite.html">Confidentialité</a>
          <a href="/supprimer-compte.html">Supprimer mon compte</a>
        </nav>
      </div>
    </footer>`;

(function injecterLayout() {
  const zoneHeader = document.getElementById("site-header");
  if (zoneHeader) {
    zoneHeader.outerHTML = estSessionMembre() ? construireHeaderMembre() : EDUCONCOURSCI_HEADER_HTML;
  }

  const zoneFooter = document.getElementById("site-footer");
  if (zoneFooter) {
    zoneFooter.outerHTML = estSessionMembre() ? FOOTER_MEMBRE_HTML : EDUCONCOURSCI_FOOTER_HTML;
  }
})();

// ── Bandeau « Rejoins la chaîne WhatsApp » (si la chaîne est configurée) ──
(function afficherBandeauChaine() {
  const zone = document.getElementById("bandeau-chaine");
  const url = (window.SITE_CONFIG.reseaux || {}).whatsappChaine;
  if (!zone || typeof url !== "string" || !/^https:\/\//i.test(url)) return;
  const lien = document.createElement("a");
  lien.href = url;
  lien.target = "_blank";
  lien.rel = "noopener noreferrer";
  lien.className = "btn btn--primaire";
  lien.textContent = "Rejoindre la chaîne WhatsApp";
  const texte = document.createElement("p");
  texte.style.cssText = "margin:0 0 12px;font-weight:700;";
  texte.textContent = "Recevez les concours à surveiller et des conseils emploi.";
  zone.style.cssText = "text-align:center;padding:22px 16px;background:#f0fdf4;border-bottom:1px solid #bbf7d0;";
  zone.appendChild(texte);
  zone.appendChild(lien);
})();

// ── Statistiques de visite (désactivées tant que rien n'est configuré) ──
(function chargerStatistiques() {
  const a = window.SITE_CONFIG.analytics || {};
  if (!a.fournisseur || !a.id) return;
  if (a.fournisseur === "cloudflare" && /^[a-f0-9]{20,64}$/i.test(a.id)) {
    const sc = document.createElement("script");
    sc.defer = true;
    sc.src = "https://static.cloudflareinsights.com/beacon.min.js";
    sc.setAttribute("data-cf-beacon", JSON.stringify({ token: a.id }));
    document.head.appendChild(sc);
  } else if (a.fournisseur === "ga4" && /^G-[A-Z0-9]{6,14}$/.test(a.id)) {
    const sc = document.createElement("script");
    sc.async = true;
    sc.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(a.id);
    document.head.appendChild(sc);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", a.id);
  }
})();
