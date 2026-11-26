// ============================================================
//  js/garde.js — Garde centrale : visiteur ou membre connecté ?
//  À charger EN PREMIER dans le <head> de chaque page.
//
//  • Visiteur (non connecté) : toute page protégée renvoie vers
//    /connexion-requise.html, et sur les pages restées ouvertes
//    (accueil, mentions légales) tout clic sur un lien, bouton,
//    image ou carte y mène aussi.
//  • Membre connecté : aucun changement, accès normal.
//  • Déconnexion (même dans un autre onglet) : retour immédiat au
//    fonctionnement visiteur.
//
//  ⚠️ Ce fichier règle l'AFFICHAGE. La vraie protection des données
//  est faite par le serveur (middleware auth sur les routes de
//  contenu, voir server.js) : un visiteur qui contourne ce script
//  reçoit une erreur 401 et aucune donnée.
// ============================================================
(function () {
  "use strict";

  // Ancienne adresse (Cloudflare Pages) → domaine officiel, en conservant la page demandée.
  // (La session est liée à l'adresse : un membre devra se reconnecter une fois sur le nouveau domaine.)
  if (location.hostname === "proinsertion.pages.dev") {
    location.replace("https://proinsertionci.org" + location.pathname + location.search + location.hash);
    return;
  }

  var DESTINATION = "/connexion-requise.html";

  // Pages visibles sans compte. Tout le reste est réservé aux membres.
  // (Pour rouvrir une page aux visiteurs, ajoutez son chemin ici.)
  var PAGES_LIBRES = [
    "/", "/index.html",
    "/connexion-requise.html",
    "/conditions.html", "/confidentialite.html", "/supprimer-compte.html",
    "/a-propos.html", "/comment-ca-marche.html", "/guide.html",
    "/conseils.html", "/cv-cote-d-ivoire.html", "/lettre-de-motivation.html", "/entretien-embauche.html",
    "/preparer-un-concours.html", "/trouver-un-emploi-ou-un-stage.html",
    "/candidature-spontanee.html", "/lettre-de-demande-de-stage.html", "/cv-sans-experience.html", "/culture-generale-concours.html", "/entretien-en-ligne.html", "/fausses-offres-emploi.html",
  ];

  function chemin() {
    var p = location.pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  }
  function estPageAuth() { return chemin().indexOf("/auth/") === 0; }
  function estPageLibre() { return PAGES_LIBRES.indexOf(chemin()) !== -1 || estPageAuth(); }

  // Session valide = jeton + profil présents, jeton non expiré.
  function sessionValide() {
    try {
      var t = localStorage.getItem("ecc_token");
      var u = localStorage.getItem("ecc_user");
      if (!t || !u || u === "undefined" || u === "null") return false;
      JSON.parse(u);
      var parts = t.split(".");
      if (parts.length === 3) {
        var charge = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (charge && charge.exp && charge.exp * 1000 < Date.now()) {
          localStorage.removeItem("ecc_token");
          localStorage.removeItem("ecc_user");
          return false;
        }
      }
      return true;
    } catch (e) { return false; }
  }
  window.estVisiteur = function () { return !sessionValide(); };

  function aller() { location.replace(DESTINATION); }

  // 1) Accès direct à une page protégée (adresse saisie, favori, lien externe…)
  function verifierPage() {
    if (!estPageLibre() && !sessionValide()) {
      document.documentElement.style.visibility = "hidden"; // rien ne s'affiche avant la redirection
      aller();
      return true;
    }
    return false;
  }
  if (verifierPage()) return;

  // Déconnexion dans un autre onglet, ou retour arrière sur une page mise en cache
  window.addEventListener("storage", function (e) {
    if (e.key === "ecc_token" || e.key === "ecc_user" || e.key === null) verifierPage();
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) verifierPage(); });

  // 2) Pages restées ouvertes aux visiteurs : tout clic mène à la page « Connexion requise »
  if (chemin() === "/connexion-requise.html" || estPageAuth()) return;

  var EXEMPTES = ".navbar__hamburger, #hamburger, #ac-menu, .navbar__groupe-btn, [data-installer-app], [data-garde-ok]";
  var ELEMENTS_CLIQUABLES = "button, [role='button'], summary, img, picture, figure, input[type='submit'], [onclick], " +
    ".pi-carte, .pi-formule, .pi-pilier, .pi-parcours__carte, .pi-cv, .ac-svc, .ac-photo";

  function lienAutorise(a) {
    var href = a.getAttribute("href") || "";
    if (href === "#" || /^(mailto:|tel:)/i.test(href)) return true;
    var u;
    try { u = new URL(a.href, location.href); } catch (e) { return false; }
    if (u.origin !== location.origin) return true; // réseaux sociaux, chaîne WhatsApp…
    var p = u.pathname.replace(/\/+$/, "") || "/";
    if (p === "/" || p === "/index.html") return u.hash === "" || u.hash === "#";
    return PAGES_LIBRES.indexOf(p) !== -1 && p !== "/index.html" || p.indexOf("/auth/") === 0;
  }

  function doitRediriger(cible) {
    if (!cible || !cible.closest) return false;
    if (cible.closest(EXEMPTES)) return false;
    var lien = cible.closest("a[href]");
    if (lien) return !lienAutorise(lien);
    return !!cible.closest(ELEMENTS_CLIQUABLES);
  }

  function intercepter(e) {
    if (!window.estVisiteur()) return;
    if (!doitRediriger(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    location.assign(DESTINATION);
  }
  document.addEventListener("click", intercepter, true);
  document.addEventListener("submit", function (e) {
    if (!window.estVisiteur()) return;
    // Exception voulue : la lettre d'information (e-mail seul, sans compte) reste utilisable.
    if (e.target && e.target.closest && e.target.closest("[data-garde-ok]")) return;
    e.preventDefault(); e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    location.assign(DESTINATION);
  }, true);
  // Clavier : Entrée/Espace sur un élément cliquable déclenche déjà « click » ; on couvre aussi les cartes focalisables.
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target && e.target.matches && e.target.matches("[role='button'], .ac-svc, .ac-photo")) intercepter(e);
  }, true);
})();
