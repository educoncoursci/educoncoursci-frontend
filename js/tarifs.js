// ============================================================
//  js/tarifs.js — Affichage des tarifs depuis le catalogue (/api/catalogue).
//  Seuls les produits ACTIFS sont renvoyés par l'API. Tant qu'aucun produit
//  n'est actif, la section reste cachée.
//  Tout est construit avec textContent : aucun HTML venant des données.
// ============================================================
(function () {
  "use strict";

  function fcfa(n) {
    return Number(n).toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ") + " FCFA";
  }

  function el(tag, attrs, ...enfants) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else n.setAttribute(k, v);
    }
    enfants.flat().forEach((e) => e && n.appendChild(typeof e === "string" ? document.createTextNode(e) : e));
    return n;
  }

  function ligneProduit(p) {
    const prix = fcfa(p.prix_fcfa) + (p.periodicite ? " / " + p.periodicite : "");
    return el("div", { class: "pi-tarif" },
      el("div", { class: "pi-tarif__ligne" },
        el("span", { class: "pi-tarif__nom", text: p.nom }),
        el("span", { class: "pi-tarif__prix", text: prix })),
      p.description ? el("small", { text: p.description }) : null,
      p.composition && p.composition.length
        ? el("small", { text: "Comprend : " + p.composition.map((c) => c.nom).concat(p.inclus || []).join(" · ") })
        : (p.inclus && p.inclus.length ? el("small", { text: "Comprend : " + p.inclus.join(" · ") }) : null),
      p.economie_fcfa ? el("span", { class: "badge badge--vert pi-tarif__eco", text: "Vous économisez " + fcfa(p.economie_fcfa) }) : null);
  }

  // Page où se commande chaque catégorie (adresses déjà existantes du site)
  const ACTIONS = {
    "cv": ["/cv-generator.html", "Créer mon CV"],
    "lettres": ["/cv-generator.html", "Rédiger ma lettre"],
    "packs": ["/packs.html", "Voir les packs"],
    "entretiens": ["/documents-redaction.html", "Me préparer"],
    "documents-candidature": ["/documents-redaction.html", "Rédiger un document"],
    "documents-administratifs": ["/documents-redaction.html", "Rédiger un document"],
    "documents-academiques": ["/documents-redaction.html", "Rédiger un document"],
    "accompagnement": ["/documents-redaction.html", "Améliorer mon CV"],
    "abonnement": ["/boutique.html", "Voir les formules"],
    "recruteurs": ["/publier-offre.html", "Publier une offre"],
  };

  function carte(c) {
    const act = ACTIONS[c.id];
    return el("div", { class: "pi-tarifs__carte" },
      el("h3", { text: c.nom }),
      el("div", { class: "pi-tarifs__corps" }, c.produits.map(ligneProduit)),
      act ? el("a", { class: "pi-tarifs__btn", href: act[0], text: act[1] }) : null);
  }

  async function charger(section, grille) {
    if (!section || !grille || !window.API_URL) return;
    try {
      const r = await fetch(window.API_URL + "/catalogue");
      if (!r.ok) return;
      const { categories } = await r.json();
      if (!Array.isArray(categories) || !categories.length) return;
      grille.replaceChildren(...categories.map(carte));
      section.style.display = "block";
    } catch (err) {
      /* les tarifs sont facultatifs sur l'accueil : en cas d'erreur, la section reste cachée */
    }
  }

  window.Tarifs = { charger, fcfa };
})();
