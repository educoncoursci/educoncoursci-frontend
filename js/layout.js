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
          <span class="navbar__logo-texte">Pro<span>Insertion</span> <span class="navbar__ci">CI</span></span>
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
          <li class="navbar__groupe">
            <button class="navbar__groupe-btn">
              Concours
              <svg class="navbar__groupe-fleche" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="navbar__sous-menu">
              <a href="/concours.html" class="navbar__sous-lien"><span data-icone="institution" data-taille="16"></span> Concours</a>
              <a href="/examens.html" class="navbar__sous-lien"><span data-icone="quiz" data-taille="16"></span> Examens</a>
            </div>
          </li>
          <li class="navbar__groupe">
            <button class="navbar__groupe-btn">
              Ressources
              <svg class="navbar__groupe-fleche" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="navbar__sous-menu">
              <a href="/bibliotheque.html" class="navbar__sous-lien"><span data-icone="livre" data-taille="16"></span> Bibliothèque</a>
              <a href="/assistant-concours.html" class="navbar__sous-lien"><span data-icone="etoile" data-taille="16"></span> Assistant Concours</a>
              <a href="/communaute.html" class="navbar__sous-lien"><span data-icone="aide" data-taille="16"></span> Communauté</a>
              <a href="/marketplace.html" class="navbar__sous-lien"><span data-icone="panier" data-taille="16"></span> Marketplace</a>
              <a href="/actualites.html" class="navbar__sous-lien"><span data-icone="graphique" data-taille="16"></span> Actualités</a>
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

      <div class="navbar__mobile" id="menu-mobile">
        <a href="/cv-generator.html" class="navbar__link"><span data-icone="fusee" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>CV & Lettre de motivation</a>
        <a href="/packs.html" class="navbar__link"><span data-icone="fusee" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Packs</a>
        <a href="/documents-redaction.html" class="navbar__link"><span data-icone="document" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Courriers et documents</a>
        <a href="/documents-pro.html" class="navbar__link"><span data-icone="portefeuille" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Documents professionnels</a>
        <a href="/documents-admin.html" class="navbar__link"><span data-icone="document" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Documents administratifs</a>
        <a href="/emploi.html" class="navbar__link"><span data-icone="loupe" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Offres d'emploi</a>
        <a href="/emploi.html?opportunite=stage" class="navbar__link"><span data-icone="graphique" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Offres de stage</a>
        <a href="/analyse-offre.html" class="navbar__link"><span data-icone="loupe" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Analyser une offre</a>
        <a href="/simulation-entretien.html" class="navbar__link"><span data-icone="aide" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Simulation d'entretien</a>
        <hr style="border:none;border-top:1px solid var(--gris-bordure);margin:8px 0;" />
        <a href="/concours.html" class="navbar__link"><span data-icone="institution" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Concours</a>
        <a href="/examens.html" class="navbar__link"><span data-icone="document" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Examens</a>
        <a href="/bibliotheque.html" class="navbar__link"><span data-icone="document" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Bibliothèque</a>
        <a href="/assistant-concours.html" class="navbar__link"><span data-icone="etoile" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Assistant Concours</a>
        <a href="/communaute.html" class="navbar__link"><span data-icone="aide" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Communauté</a>
        <a href="/marketplace.html" class="navbar__link"><span data-icone="panier" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Marketplace</a>
        <a href="/actualites.html" class="navbar__link"><span data-icone="cloche" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Actualités</a>
        <a href="/boutique.html" class="navbar__link"><span data-icone="etoile" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Premium</a>
        <hr
          style="
            border: none;
            border-top: 1px solid var(--gris-bordure);
            margin: 8px 0;
          "
        />
        <div id="navbar-mobile-actions">
          <a href="/auth/login.html" class="btn btn--outline-vert btn--sm w-full"
            >Connexion</a
          >
          <a
            href="/auth/register.html"
            class="btn btn--primaire btn--sm w-full mt-1"
            >Inscription gratuite</a
          >
        </div>
      </div>
    </nav>`;

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
    `<a href="${url.replace(/"/g, "&quot;")}" class="footer__reseau" aria-label="${nom}" target="_blank" rel="noopener noreferrer"><span data-icone="${icone}" data-taille="20"></span></a>`
  ).join("") + `</div>`;
}

// ── Partage WhatsApp (utilisable depuis toutes les pages) ──
window.partagerWhatsApp = function (texte, url) {
  const lien = url || window.location.href;
  window.open("https://wa.me/?text=" + encodeURIComponent(texte + " " + lien), "_blank", "noopener");
};


const EDUCONCOURSCI_FOOTER_HTML = `<footer class="footer">
      <div class="container">
        <div class="footer__grille">
          <div>
            <div class="footer__logo" style="display:flex;align-items:center;gap:10px;"><img src="/assets/logo-icon.png" alt="ProInsertion CI" style="width:22px;height:22px;vertical-align:-6px;object-fit:contain;" />ProInsertion CI</div>
            <p class="footer__desc">
              Votre avenir professionnel commence ici. CV, lettres de motivation,
              documents professionnels, offres d'emploi, préparation aux
              entretiens et concours.
            </p>
            ${construireReseaux()}
          </div>
          <div>
            <div class="footer__titre-col">Plateforme</div>
            <a href="/concours.html" class="footer__lien">Concours</a>
            <a href="/examens.html" class="footer__lien">Examens</a>
            <a href="/bibliotheque.html" class="footer__lien">Bibliothèque</a>
          </div>
          <div>
            <div class="footer__titre-col">Services</div>
            <a href="/cv-generator.html" class="footer__lien"
              >Générateur CV/LM</a
            >
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
            <a href="/actualites.html" class="footer__lien">Actualités</a>
            <a href="/guide.html" class="footer__lien">Guide d'utilisation</a>
          </div>
          <div>
            <div class="footer__titre-col">Compte</div>
            <a href="/auth/login.html" class="footer__lien">Connexion</a>
            <a href="/auth/register.html" class="footer__lien">Inscription</a>
            <a href="/dashboard/index.html" class="footer__lien">Mon espace</a>
            <a href="/dashboard/paiements.html" class="footer__lien"
              >Mes paiements</a
            >
          </div>
        </div>
      </div>
      <div class="footer__bas">
        <div class="container">
          <p style="margin:0 0 8px"><a href="#" data-installer-app style="color:inherit;text-decoration:underline;font-weight:600">📲 Installer l'application</a></p>
          © 2026 ProInsertion CI — Tous droits réservés · Abidjan, Côte d'Ivoire · <a href="/conditions.html" style="color:inherit;text-decoration:underline">Conditions</a> · <a href="/supprimer-compte.html" style="color:inherit;text-decoration:underline">Supprimer mon compte</a> · <a href="/confidentialite.html" style="color:inherit;text-decoration:underline">Confidentialité</a>
        </div>
      </div>
    </footer>`;

(function injecterLayout() {
  const zoneHeader = document.getElementById("site-header");
  if (zoneHeader) {
    zoneHeader.outerHTML = EDUCONCOURSCI_HEADER_HTML;
  }

  const zoneFooter = document.getElementById("site-footer");
  if (zoneFooter) {
    zoneFooter.outerHTML = EDUCONCOURSCI_FOOTER_HTML;
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
