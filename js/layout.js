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

const EDUCONCOURSCI_HEADER_HTML = `<nav class="navbar" id="navbar">
      <div class="navbar__inner">
        <a href="/" class="navbar__logo">
          <div class="navbar__logo-icon"><img src="/assets/logo-icon.png" alt="EduConcoursCI" /></div>
          <span class="navbar__logo-texte">Edu<span>Concours</span>CI</span>
        </a>

                <ul class="navbar__links">
          <li class="navbar__groupe">
            <button class="navbar__groupe-btn">
              Concours
              <svg class="navbar__groupe-fleche" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="navbar__sous-menu">
              <a href="/concours.html" class="navbar__sous-lien"><span data-icone="institution" data-taille="16"></span> Concours</a>
              <a href="/calendrier.html" class="navbar__sous-lien"><span data-icone="horloge" data-taille="16"></span> Calendrier</a>
              <a href="/eligibilite.html" class="navbar__sous-lien"><span data-icone="coche" data-taille="16"></span> Suis-je éligible ?</a>
              <a href="/examens.html" class="navbar__sous-lien"><span data-icone="quiz" data-taille="16"></span> Examens</a>
              <a href="/preparation.html" class="navbar__sous-lien"><span data-icone="diplome" data-taille="16"></span> Préparation</a>
              <a href="/classement.html" class="navbar__sous-lien"><span data-icone="trophee" data-taille="16"></span> Classement</a>
            </div>
          </li>
          <li class="navbar__groupe">
            <button class="navbar__groupe-btn">
              Ressources
              <svg class="navbar__groupe-fleche" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="navbar__sous-menu">
              <a href="/bibliotheque.html" class="navbar__sous-lien"><span data-icone="livre" data-taille="16"></span> Bibliothèque</a>
              <a href="/assistant-concours.html" class="navbar__sous-lien"><span data-icone="etoile" data-taille="16"></span> Assistant IA Concours</a>
              <a href="/communaute.html" class="navbar__sous-lien"><span data-icone="aide" data-taille="16"></span> Communauté</a>
              <a href="/marketplace.html" class="navbar__sous-lien"><span data-icone="panier" data-taille="16"></span> Marketplace</a>
              <a href="/videos.html" class="navbar__sous-lien"><span data-icone="video" data-taille="16"></span> Vidéos</a>
              <a href="/actualites.html" class="navbar__sous-lien"><span data-icone="graphique" data-taille="16"></span> Actualités</a>
              <a href="/demarches.html" class="navbar__sous-lien"><span data-icone="document" data-taille="16"></span> Démarches</a>
            </div>
          </li>
          <li class="navbar__groupe">
            <button class="navbar__groupe-btn">
              Carrière
              <svg class="navbar__groupe-fleche" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="navbar__sous-menu">
              <a href="/cv-generator.html" class="navbar__sous-lien"><span data-icone="fusee" data-taille="16"></span> CV & Lettre de motivation</a>
              <a href="/documents-pro.html" class="navbar__sous-lien"><span data-icone="portefeuille" data-taille="16"></span> Documents Professionnels</a>
              <a href="/documents-admin.html" class="navbar__sous-lien"><span data-icone="document" data-taille="16"></span> Documents Administratifs</a>
              <a href="/emploi.html" class="navbar__sous-lien"><span data-icone="loupe" data-taille="16"></span> Offres d'emploi</a>
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
        <a href="/concours.html" class="navbar__link"><span data-icone="institution" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Concours</a>
        <a href="/calendrier.html" class="navbar__link"><span data-icone="horloge" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Calendrier</a>
        <a href="/eligibilite.html" class="navbar__link"><span data-icone="coche" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Suis-je éligible ?</a>
        <a href="/examens.html" class="navbar__link"><span data-icone="document" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Examens</a>
        <a href="/preparation.html" class="navbar__link"><span data-icone="quiz" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Préparation</a>
        <a href="/classement.html" class="navbar__link"><span data-icone="trophee" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Classement</a>
        <a href="/bibliotheque.html" class="navbar__link"><span data-icone="document" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Bibliothèque</a>
        <a href="/assistant-concours.html" class="navbar__link"><span data-icone="etoile" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Assistant IA Concours</a>
        <a href="/communaute.html" class="navbar__link"><span data-icone="aide" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Communauté</a>
        <a href="/marketplace.html" class="navbar__link"><span data-icone="panier" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Marketplace</a>
        <a href="/videos.html" class="navbar__link"><span data-icone="video" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Vidéos</a>
        <a href="/actualites.html" class="navbar__link"><span data-icone="cloche" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Actualités</a>
        <a href="/boutique.html" class="navbar__link"><span data-icone="etoile" data-taille="18" style="margin-right:8px;vertical-align:-4px;"></span>Premium</a>
        <hr
          style="
            border: none;
            border-top: 1px solid var(--gris-bordure);
            margin: 8px 0;
          "
        />
        <a href="/auth/login.html" class="btn btn--outline-vert btn--sm w-full"
          >Connexion</a
        >
        <a
          href="/auth/register.html"
          class="btn btn--primaire btn--sm w-full mt-1"
          >Inscription gratuite</a
        >
      </div>
    </nav>`;

const EDUCONCOURSCI_FOOTER_HTML = `<footer class="footer">
      <div class="container">
        <div class="footer__grille">
          <div>
            <div class="footer__logo" style="display:flex;align-items:center;gap:10px;"><img src="/assets/logo-icon.png" alt="EduConcoursCI" style="width:22px;height:22px;vertical-align:-6px;object-fit:contain;" />EduConcoursCI</div>
            <p class="footer__desc">
              La plateforme de référence pour préparer les concours de Côte
              d'Ivoire. QCM, cours, vidéos, alertes et génération IA de CV.
            </p>
            <div class="footer__reseaux">
              <a href="#" class="footer__reseau" aria-label="Facebook"><span data-icone="facebook" data-taille="20"></span></a>
              <a href="#" class="footer__reseau" aria-label="Instagram"><span data-icone="instagram" data-taille="20"></span></a>
              <a href="#" class="footer__reseau" aria-label="WhatsApp"><span data-icone="whatsapp" data-taille="20"></span></a>
              <a href="#" class="footer__reseau" aria-label="YouTube"><span data-icone="youtube" data-taille="20"></span></a>
            </div>
          </div>
          <div>
            <div class="footer__titre-col">Plateforme</div>
            <a href="/concours.html" class="footer__lien">Concours</a>
            <a href="/calendrier.html" class="footer__lien">Calendrier</a>
            <a href="/examens.html" class="footer__lien">Examens</a>
            <a href="/preparation.html" class="footer__lien">Préparation</a>
            <a href="/bibliotheque.html" class="footer__lien">Bibliothèque</a>
            <a href="/videos.html" class="footer__lien">Vidéos</a>
            <a href="/simulateur.html" class="footer__lien">Examen blanc</a>
          </div>
          <div>
            <div class="footer__titre-col">Services</div>
            <a href="/cv-generator.html" class="footer__lien"
              >Générateur CV/LM</a
            >
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
            <a href="/dashboard/mes-scores.html" class="footer__lien"
              >Mes scores</a
            >
            <a href="/dashboard/paiements.html" class="footer__lien"
              >Mes paiements</a
            >
          </div>
        </div>
      </div>
      <div class="footer__bas">
        <div class="container">
          © 2026 EduConcoursCI — Tous droits réservés · Abidjan, Côte d'Ivoire
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
