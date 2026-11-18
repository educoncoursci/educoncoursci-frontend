// ============================================================
//  js/commande.js — Brique partagée « document à l'acte »
//  Aperçu partiel (suite floutée) → paiement Wave / Orange Money avec
//  identifiant de transaction → téléchargement du PDF une fois validé.
//  Usage : Commande.monter(elementConteneur); Commande.afficher(commande);
// ============================================================
(function () {
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toast = (m, t) => (window.afficherToast ? window.afficherToast(m, t) : alert(m));
  const LIBELLES = { a_payer: "À payer", en_verification: "Paiement en vérification", valide: "Disponible", rejete: "Paiement refusé" };
  const PREFIXES = { "entretien-": "ENTRETIEN", "cv-": "CV", "lm-": "LM", "doc-": "DOC", "bonus-": "DOC" };

  let racine = null;
  let courante = null;
  let nomFichier = () => "document";
  let valideMasque = false;

  const CSS = `
    .cmd-doc{position:relative;border:3px solid var(--vert);border-radius:var(--radius-lg);overflow:hidden;background:#fff}
    .cmd-doc__texte,.cmd-doc__flou{white-space:pre-wrap;font-size:.88rem;line-height:1.6;padding:18px 20px;word-break:break-word}
    .cmd-doc__flou{filter:blur(5px);user-select:none;pointer-events:none;color:#555;padding-top:0;max-height:320px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 40%,transparent);mask-image:linear-gradient(#000 40%,transparent)}
    .cmd-pay{background:#fff7ed;border-radius:12px;padding:16px 18px;margin-top:16px}
    .cmd-ligne{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #eee;font-size:.88rem;flex-wrap:wrap}`;

  function monter(conteneur, options = {}) {
    racine = conteneur;
    if (options.nomFichier) nomFichier = options.nomFichier;
    valideMasque = !!options.valideMasque; // la page gère elle-même l'affichage d'un document payé
    const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    conteneur.innerHTML = `
      <div style="background:var(--blanc);border-radius:var(--radius-lg);padding:24px;box-shadow:var(--ombre-sm);">
        <h3 style="color:var(--vert);margin:0 0 4px" data-r="titre"></h3>
        <div style="color:var(--gris-texte);font-size:.9rem;margin-bottom:16px;" data-r="sous"></div>
        <div class="cmd-doc" data-r="doc"><div class="cmd-doc__texte" data-r="texte"></div><div class="cmd-doc__flou" data-r="flou" aria-hidden="true"></div></div>

        <div class="cmd-pay hidden" data-r="paiement">
          <div style="font-weight:800;font-size:1.05rem;margin-bottom:6px;">Débloquez votre document complet : <span data-r="prix"></span></div>
          <ol style="margin:0 0 14px 18px;padding:0;line-height:1.8;font-size:.9rem;">
            <li>Envoyez le montant exact par <strong>Wave</strong> ou <strong>Orange Money</strong> :<div data-r="numeros" style="margin-top:4px;"></div></li>
            <li>Notez l'identifiant de transaction reçu par SMS.</li>
            <li>Saisissez-le ci-dessous. Un même identifiant ne peut servir qu'une seule fois.</li>
          </ol>
          <div class="hidden" data-r="rejet" style="background:#fef2f2;color:#991b1b;border-radius:10px;padding:10px 14px;margin-bottom:12px;font-size:.88rem;">Votre précédent paiement n'a pas pu être confirmé. Vérifiez l'identifiant et réessayez.</div>
          <div style="display:grid;grid-template-columns:1fr 2fr;gap:10px;">
            <select class="form-input" data-r="moyen"><option value="wave">Wave</option><option value="orange">Orange Money</option></select>
            <input class="form-input" data-r="txid" placeholder="Identifiant de transaction" autocomplete="off" />
          </div>
          <button class="btn btn--primaire btn--full" data-r="payer" style="margin-top:12px;">J'ai payé — valider mon identifiant</button>
        </div>

        <div class="cmd-pay hidden" data-r="verification">
          <strong>Paiement reçu, vérification en cours.</strong>
          <p style="margin:6px 0 12px;font-size:.9rem;">Notre équipe confirme la réception des fonds (24 h maximum). Votre document sera téléchargeable dès la validation.</p>
          <button class="btn btn--outline-vert btn--sm" data-r="actualiser">Actualiser le statut</button>
        </div>

        <div class="hidden" data-r="valide" style="margin-top:16px;">
          <button class="btn btn--primaire btn--full btn--lg" data-r="telecharger">Télécharger mon document (PDF)</button>
          <button class="btn btn--gris btn--sm" data-r="copier" style="margin-top:10px;">Copier le texte</button>
        </div>
      </div>`;
    const r = (n) => conteneur.querySelector(`[data-r="${n}"]`);
    r("payer").onclick = envoyerPaiement;
    r("actualiser").onclick = actualiser;
    r("telecharger").onclick = telecharger;
    r("copier").onclick = async () => { if (courante?.contenu) { await window.Utils?.copierTexte?.(courante.contenu); toast("Texte copié.", "succes"); } };
  }

  const el = (n) => racine.querySelector(`[data-r="${n}"]`);
  const montrer = (n, oui) => el(n).classList.toggle("hidden", !oui);

  function afficher(c) {
    courante = c;
    el("titre").textContent = c.nom;
    el("sous").textContent = c.etat === "valide" ? "Paiement confirmé : votre document complet est disponible."
      : "Aperçu partiel : la suite de votre document est masquée jusqu'au paiement.";
    if (c.etat === "valide") { el("texte").textContent = c.contenu || ""; el("flou").textContent = ""; montrer("flou", false); }
    else { el("texte").textContent = c.apercu?.visible || ""; el("flou").textContent = c.apercu?.flou || ""; montrer("flou", true); }
    montrer("paiement", c.etat === "a_payer" || c.etat === "rejete");
    montrer("rejet", c.etat === "rejete");
    montrer("verification", c.etat === "en_verification");
    montrer("valide", c.etat === "valide" && !valideMasque);
    montrer("doc", !(c.etat === "valide" && valideMasque));
    if (c.etat === "a_payer" || c.etat === "rejete") {
      el("prix").textContent = Number(c.prix_fcfa).toLocaleString("fr-FR") + " FCFA";
      const n = [];
      if (c.paiement?.wave_numero) n.push(`Wave : <strong>${esc(c.paiement.wave_numero)}</strong>`);
      if (c.paiement?.orange_numero) n.push(`Orange Money : <strong>${esc(c.paiement.orange_numero)}</strong>`);
      el("numeros").innerHTML = n.length ? n.join("<br>") : "Le numéro de paiement sera communiqué par le support.";
    }
    document.dispatchEvent(new CustomEvent("commande:afficher", { detail: c }));
    const masque = c.etat === "valide" && valideMasque;
    racine.classList.toggle("hidden", masque);
    if (masque) return;
    racine.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function envoyerPaiement() {
    if (!courante) return;
    const txId = el("txid").value.trim();
    if (!txId) { toast("Saisissez l'identifiant de transaction.", "warn"); return; }
    const b = el("payer"); b.disabled = true;
    try {
      const res = await window.API.CVLM.payerCommande(courante.id, el("moyen").value, txId);
      toast(res.message || "Identifiant reçu.", "succes");
      el("txid").value = "";
      await actualiser();
      document.dispatchEvent(new CustomEvent("commande:maj"));
    } catch (e) { toast(e.message || "Erreur de paiement.", "erreur"); }
    finally { b.disabled = false; }
  }

  async function actualiser() {
    if (!courante) return;
    try { afficher((await window.API.CVLM.lireCommande(courante.id)).commande); }
    catch (e) { toast(e.message || "Impossible d'actualiser.", "erreur"); }
  }

  async function telecharger() {
    if (!courante) return;
    const prefixe = Object.entries(PREFIXES).find(([k]) => courante.type.startsWith(k))?.[1] || "CV";
    try { await window.API.CVLM.telechargerCommandePDF(courante.id, nomFichier(), prefixe); }
    catch (e) { toast(e.message || "Erreur PDF.", "erreur"); }
  }

  async function ouvrir(id) {
    try { afficher((await window.API.CVLM.lireCommande(id)).commande); }
    catch (e) { toast(e.message || "Document introuvable.", "erreur"); }
  }

  // Liste « Mes documents » (filtre sur le préfixe d'identifiant produit)
  async function lister(zone, liste, prefixe) {
    try {
      const l = ((await window.API.CVLM.mesCommandes()).commandes || []).filter((c) => !prefixe || [].concat(prefixe).some((x) => c.type.startsWith(x)));
      zone.classList.toggle("hidden", !l.length);
      liste.innerHTML = l.map((c) => `<div class="cmd-ligne"><span><strong>${esc(c.nom)}</strong> · ${new Date(c.date).toLocaleDateString("fr-FR")} · ${esc(LIBELLES[c.etat] || c.etat)}</span>
        <button class="btn btn--outline-vert btn--sm" data-ouvrir="${Number(c.id)}">Ouvrir</button></div>`).join("");
      liste.querySelectorAll("[data-ouvrir]").forEach((b) => (b.onclick = () => ouvrir(Number(b.dataset.ouvrir))));
    } catch { /* confort : silence en cas d'erreur */ }
  }

  window.Commande = { monter, afficher, ouvrir, lister };
})();
