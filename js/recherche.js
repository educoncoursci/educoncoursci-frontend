// ============================================================
//  js/recherche.js
//  Recherche universelle : injecte un bouton loupe dans la
//  navbar et une modale de résultats en direct.
//  Cherche parmi : concours, documents (PDF), vidéos, QCM,
//  et types de documents générables (Pro/Admin).
// ============================================================

const LABELS_SECTIONS = {
  concours: "Concours",
  documents: "Bibliothèque",
  videos: "Vidéos",
  qcm: "QCM",
  documentsGenerables: "Documents à générer",
};

const ICONES_TYPES = {
  concours: "institution",
  document: "document",
  video: "video",
  qcm: "quiz",
  document_generable: "fusee",
};

let debounceRecherche = null;

// ── Injecte le bouton loupe dans la navbar (si présente) ─────
function injecterBoutonRecherche() {
  const actions = document.getElementById("navbar-actions");
  if (!actions || document.getElementById("btn-recherche-universelle")) return;

  const bouton = document.createElement("button");
  bouton.id = "btn-recherche-universelle";
  bouton.className = "navbar__recherche-btn";
  bouton.title = "Rechercher (formations, concours, documents…)";
  bouton.innerHTML = `<span data-icone="loupe" data-taille="18"></span>`;
  bouton.onclick = ouvrirRecherche;

  actions.insertBefore(bouton, actions.firstChild);
}

// ── Construit la modale (une seule fois, réutilisée) ──────────
function creerModaleRecherche() {
  if (document.getElementById("recherche-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "recherche-overlay";
  overlay.className = "recherche-overlay hidden";
  overlay.innerHTML = `
    <div class="recherche-modale" onclick="event.stopPropagation()">
      <div class="recherche-input-zone">
        <span data-icone="loupe" data-taille="20"></span>
        <input
          type="text"
          id="recherche-input"
          placeholder="Rechercher une formation, un concours, un document…"
          autocomplete="off"
        />
        <button class="recherche-fermer" onclick="fermerRecherche()">✕</button>
      </div>
      <div class="recherche-resultats" id="recherche-resultats">
        <div class="recherche-etat">Tape au moins 2 caractères pour commencer.</div>
      </div>
    </div>
  `;
  overlay.addEventListener("click", fermerRecherche);
  document.body.appendChild(overlay);

  document.getElementById("recherche-input").addEventListener("input", (e) => {
    clearTimeout(debounceRecherche);
    const valeur = e.target.value.trim();
    debounceRecherche = setTimeout(() => lancerRecherche(valeur), 350);
  });
}

function ouvrirRecherche() {
  creerModaleRecherche();
  const overlay = document.getElementById("recherche-overlay");
  overlay.classList.remove("hidden");
  setTimeout(() => document.getElementById("recherche-input")?.focus(), 50);
}

function fermerRecherche() {
  document.getElementById("recherche-overlay")?.classList.add("hidden");
}

async function lancerRecherche(terme) {
  const zone = document.getElementById("recherche-resultats");
  if (!zone) return;

  if (terme.length < 2) {
    zone.innerHTML = `<div class="recherche-etat">Tape au moins 2 caractères pour commencer.</div>`;
    return;
  }

  zone.innerHTML = `<div class="recherche-etat">Recherche en cours…</div>`;

  try {
    const data = await window.API.Search.rechercher(terme);

    if (data.total === 0) {
      zone.innerHTML = `<div class="recherche-etat">Aucun résultat pour « ${terme} ».</div>`;
      return;
    }

    let html = "";
    for (const [cle, items] of Object.entries(data.resultats)) {
      if (!items || items.length === 0) continue;
      html += `<div class="recherche-section-titre">${LABELS_SECTIONS[cle] || cle}</div>`;
      html += items.map(item => `
        <a href="${item.lien}" class="recherche-item">
          <div class="recherche-item__icone"><span data-icone="${ICONES_TYPES[item.type] || "document"}" data-taille="18"></span></div>
          <div class="recherche-item__texte">
            <div class="recherche-item__titre">${item.titre}</div>
            <div class="recherche-item__sous-titre">${item.sousTitre || ""}</div>
          </div>
          ${item.verrouille ? '<div class="recherche-item__badge">⭐ Premium</div>' : ""}
        </a>
      `).join("");
    }
    zone.innerHTML = html;
  } catch (err) {
    zone.innerHTML = `<div class="recherche-etat">Erreur lors de la recherche. Réessaie.</div>`;
  }
}

// ── Raccourci clavier Échap pour fermer ───────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fermerRecherche();
});

document.addEventListener("DOMContentLoaded", injecterBoutonRecherche);
