// ============================================================
//  js/concours-cartes.js — Carte concours partagée
//  Utilisée par index.html, concours.html, concours-en-cours.html
//  et concours-a-venir.html, pour éviter que 4 copies légèrement
//  différentes du même rendu ne divergent au fil du temps (c'était
//  le cas avant : la page d'accueil et les pages dédiées "en cours"/
//  "à venir" affichaient beaucoup moins d'informations que
//  concours.html, qui avait déjà été enrichie).
//
//  Affiche, uniquement lorsque la donnée existe (jamais de valeur
//  inventée) : catégorie, statut, logo/organisme, niveau requis,
//  âge requis, places, frais, date d'ouverture, date limite,
//  lieu(x), un extrait des conditions d'accès, et un lien direct
//  vers l'inscription officielle quand il est renseigné — en plus
//  du lien vers la fiche détaillée du concours sur EduConcoursCI.
// ============================================================

// ⚠️ Changement de convention couleur/emoji (LOT21) : le site utilisait
// jusqu'ici 🔴 pour "ouvert/en cours" partout (menu, page d'accueil,
// filtres). Le nouveau cahier des charges Concours demande explicitement
// 🟢 pour "En cours" et réserve 🔴 à "Suspendu/Annulé". Appliqué ici, dans
// le module central des cartes — mais PAS encore répercuté sur les
// libellés codés en dur ailleurs (menu de navigation, cases à cocher de
// filtre sur concours.html) : à corriger dans un prochain lot pour une
// cohérence visuelle complète sur tout le site.
const STATUT_COULEUR_CONCOURS = {
  ouvert: "#16a34a",
  "à venir": "var(--bleu)",
  fermé: "var(--gris-texte)",
  résultats: "var(--gris-texte)", // replié visuellement sous "Terminé"
  "information non confirmée": "#ca8a04",
  suspendu: "var(--rouge)",
};
const STATUT_EMOJI_CONCOURS = {
  ouvert: "🟢",
  "à venir": "🔵",
  fermé: "⚫",
  résultats: "⚫",
  "information non confirmée": "🟡",
  suspendu: "🔴",
};
// Libellé affiché à l'utilisateur, distinct de la valeur technique
// stockée en base (dont dépend concoursStatutScheduler.js pour
// recalculer automatiquement le statut à partir des dates réelles).
// "résultats" est replié sous le même libellé que "fermé" : un
// concours dont les résultats sont publiés reste, pour l'utilisateur,
// un concours "Terminé" — la distinction technique entre les deux
// reste utile en base (le statut résultats ne doit jamais être
// recalculé automatiquement, voir concoursStatutScheduler.js) mais
// n'a pas besoin d'être une 7ᵉ catégorie visible séparément.
const STATUT_LABEL_CONCOURS = {
  ouvert: "En cours",
  "à venir": "À venir",
  fermé: "Terminé",
  résultats: "Terminé",
  "information non confirmée": "Date non définie",
  suspendu: "Suspendu / Annulé",
};

function fraisAfficheConcours(c) {
  if (c.frais === 0) return "Gratuit";
  if (c.frais) return c.frais.toLocaleString("fr-CI") + " FCFA";
  if (c.frais_detail) return "Variable — voir détail";
  return "Non communiqué";
}

function ageAfficheConcours(c) {
  if (c.age_min && c.age_max) return `${c.age_min}-${c.age_max} ans`;
  if (c.age_max) return `${c.age_max} ans max`;
  if (c.age_min) return `${c.age_min} ans min`;
  return null;
}

function lieuAfficheConcours(c) {
  if (Array.isArray(c.centres) && c.centres.length) return c.centres.join(" · ");
  return null;
}

// `options.compact` (utilisé sur la page d'accueil, où l'espace est
// plus réduit) affiche un peu moins de lignes de détail mais garde
// toujours le badge de statut et les informations essentielles.
function construireCarteConcours(c, options = {}) {
  const couleur = c.couleur || "var(--vert)";
  const emoji = STATUT_EMOJI_CONCOURS[c.statut] || "📋";
  const couleurStatut = STATUT_COULEUR_CONCOURS[c.statut] || "var(--gris-texte)";
  const annee = c.date_cloture ? new Date(c.date_cloture).getFullYear() : null;
  const badgeAnnee = c.statut === "fermé" && annee
    ? `<span class="badge" style="background:#f0f0f0;color:var(--gris-texte);border:1px solid var(--gris-bordure);">📅 ${annee}</span>`
    : "";

  const ligneTitre = c.structure_logo_url
    ? `<div class="card-concours__titre-ligne">
         <img src="${c.structure_logo_url}" alt="Logo ${c.organisme}" class="card-concours__logo" loading="lazy" onerror="this.remove()">
         <div class="card-concours__titre">${c.titre}</div>
       </div>`
    : `<div class="card-concours__titre">${c.titre}</div>`;

  const age = ageAfficheConcours(c);
  const lieu = lieuAfficheConcours(c);

  // Deuxième ligne d'infos : uniquement les champs réellement
  // disponibles (âge, lieu) — jamais de "—" pour un champ absent ici,
  // contrairement à la première ligne, pour ne pas allonger la carte
  // inutilement quand ces informations manquent.
  const infosSecondaires = [
    c.ouverture ? `📅 Ouverture : ${c.ouverture}` : null,
    age ? `🎂 ${age}` : null,
    lieu ? `📍 ${lieu}` : null,
  ].filter(Boolean);

  const conditionsExtrait = !options.compact && c.conditions
    ? `<p class="card-concours__conditions">${c.conditions.replace(/</g, "&lt;")}</p>`
    : "";

  const lienOfficiel = c.lien_officiel
    ? `<a href="${c.lien_officiel}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="card-concours__lien-officiel">🔗 Site officiel</a>`
    : "";

  return `
    <a href="/concours-detail.html?id=${c.id}" class="card-concours" style="border-left-color:${couleur};text-decoration:none;">
      <div class="card-concours__en-tete">
        <div class="card-concours__meta">
          <span class="badge" style="background:${couleur}18;color:${couleur};border:1px solid ${couleur}33;">${c.categorie}</span>
          <span class="badge" style="background:${couleurStatut}18;color:${couleurStatut};border:1px solid ${couleurStatut}33;">${emoji} ${STATUT_LABEL_CONCOURS[c.statut] || c.statut}</span>
          ${badgeAnnee}
          ${options.badgeExtra || ""}
          ${c.premium ? '<span class="badge badge--premium">⭐ Premium</span>' : '<span class="badge badge--gratuit">🆓 Gratuit</span>'}
        </div>
        ${ligneTitre}
        <div class="card-concours__infos mt-1">
          <span class="card-concours__info">🏢 ${c.organisme}</span>
          <span class="card-concours__info">🎓 ${c.niveau || "—"}</span>
          <span class="card-concours__info">👥 ${c.places ? c.places + " places" : "—"}</span>
          <span class="card-concours__info">💰 ${fraisAfficheConcours(c)}</span>
        </div>
        ${infosSecondaires.length ? `<div class="card-concours__infos mt-1">${infosSecondaires.map((i) => `<span class="card-concours__info">${i}</span>`).join("")}</div>` : ""}
        ${conditionsExtrait}
      </div>
      <div class="card-concours__pied">
        <span class="card-concours__cloture">⏰ Clôture : ${c.cloture || "—"}</span>
        <span style="display:flex;align-items:center;gap:10px;">
          ${lienOfficiel}
          <span style="font-size:0.82rem;color:${couleur};font-weight:700;">Voir →</span>
        </span>
      </div>
    </a>`;
}

window.construireCarteConcours = construireCarteConcours;
window.fraisAfficheConcours = fraisAfficheConcours;
window.STATUT_LABEL_CONCOURS = STATUT_LABEL_CONCOURS;
window.STATUT_EMOJI_CONCOURS = STATUT_EMOJI_CONCOURS;
window.STATUT_COULEUR_CONCOURS = STATUT_COULEUR_CONCOURS;
