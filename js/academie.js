// ============================================================
//  js/academie.js — Académie EduConcoursCI (pages publiques)
//  Fonctions communes : appel API, construction DOM sûre,
//  affichage du contenu d'une leçon.
//
//  Sécurité : tout contenu venant de la base (y compris rédigé
//  par l'IA) est inséré avec textContent / createTextNode,
//  jamais avec innerHTML.
// ============================================================

(function () {
  function jeton() {
    return window.API && typeof window.API.getToken === "function" ? window.API.getToken() : null;
  }

  async function api(chemin, { methode = "GET", corps } = {}) {
    const headers = { "Content-Type": "application/json" };
    const t = jeton();
    if (t) headers.Authorization = "Bearer " + t;
    const r = await fetch(window.API_URL + "/academie" + chemin, {
      method: methode,
      headers,
      body: corps ? JSON.stringify(corps) : undefined,
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const e = new Error(data.error || "Erreur " + r.status);
      e.status = r.status;
      e.data = data;
      throw e;
    }
    return data;
  }

  function el(tag, attrs = {}, ...enfants) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined && v !== false) n.setAttribute(k, v === true ? "" : v);
    }
    enfants.flat().forEach((e) => e && n.appendChild(typeof e === "string" ? document.createTextNode(e) : e));
    return n;
  }

  // **gras** dans une ligne de texte
  function inline(parent, texte) {
    texte.split(/(\*\*[^*]+\*\*)/g).forEach((p) => {
      if (/^\*\*[^*]+\*\*$/.test(p)) parent.appendChild(el("strong", { text: p.slice(2, -2) }));
      else if (p) parent.appendChild(document.createTextNode(p));
    });
  }

  // Balisage accepté : ## titre, ### sous-titre, - puce, 1. liste numérotée, **gras**
  function rendreContenu(texte, conteneur) {
    conteneur.replaceChildren();
    let liste = null;
    let typeListe = null;
    for (const brute of String(texte || "").split("\n")) {
      const l = brute.trim();
      if (!l) { liste = null; continue; }
      let m;
      if ((m = l.match(/^###\s+(.*)/))) {
        liste = null; const h = el("h4", { class: "academie-h4" }); inline(h, m[1]); conteneur.appendChild(h);
      } else if ((m = l.match(/^##\s+(.*)/))) {
        liste = null; const h = el("h3", { class: "academie-h3" }); inline(h, m[1]); conteneur.appendChild(h);
      } else if ((m = l.match(/^[-*•]\s+(.*)/))) {
        if (!liste || typeListe !== "ul") { liste = el("ul", { class: "academie-liste" }); typeListe = "ul"; conteneur.appendChild(liste); }
        const li = el("li"); inline(li, m[1]); liste.appendChild(li);
      } else if ((m = l.match(/^\d+[.)]\s+(.*)/))) {
        if (!liste || typeListe !== "ol") { liste = el("ol", { class: "academie-liste" }); typeListe = "ol"; conteneur.appendChild(liste); }
        const li = el("li"); inline(li, m[1]); liste.appendChild(li);
      } else {
        liste = null; const p = el("p", { class: "academie-p" }); inline(p, l); conteneur.appendChild(p);
      }
    }
  }

  function idDepuisUrl() {
    const id = new URLSearchParams(window.location.search).get("id");
    return /^\d+$/.test(id || "") ? id : null;
  }

  window.Academie = { api, el, rendreContenu, idDepuisUrl, estConnecte: () => !!jeton() };
})();
