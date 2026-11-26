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
  let paiement = null;
  const COULEURS = { wave: "#009EE2", orange: "#FF6600" };
  const NOMS = { wave: "Wave", orange: "Orange Money" };

  const CSS = `
    .cmd-doc{position:relative;border:3px solid var(--vert);border-radius:var(--radius-lg);overflow:hidden;background:#fff}
    .cmd-doc__texte,.cmd-doc__flou{white-space:pre-wrap;font-size:.88rem;line-height:1.6;padding:18px 20px;word-break:break-word}
    .cmd-doc__flou{filter:blur(5px);user-select:none;pointer-events:none;color:#555;padding-top:0;max-height:320px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 40%,transparent);mask-image:linear-gradient(#000 40%,transparent)}
    .cmd-pay{background:#fff7ed;border-radius:12px;padding:16px 18px;margin-top:16px}
    .cmd-ligne{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #eee;font-size:.88rem;flex-wrap:wrap}`;

  // ── Panneau de paiement COMMUN (même parcours que le Premium : ① service, ② moyen,
  //    ③ instructions numérotées + bouton Payer, ④ identifiant + téléphone → « Soumettre »).
  //    Réutilisé par toutes les pages de services. Le serveur reste seul juge du paiement.
  function monterPaiement(zone, { obtenir, apres }) {
    if (!document.querySelector('link[href="/css/paiement-commun.css"]')) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/css/paiement-commun.css"; document.head.appendChild(l); }
    zone.classList.add("pc-bloc");
    zone.style.marginTop = "16px";
    zone.innerHTML = `
          <div class="pc-titre">① Votre service : <span data-pc="nomservice"></span> — <span data-pc="prix" style="color:var(--vert);"></span></div>
          <div class="hidden" data-pc="rejet" style="background:#fef2f2;color:#991b1b;border-radius:10px;padding:10px 14px;margin-bottom:12px;font-size:.88rem;">Votre précédent paiement n'a pas pu être confirmé. Vérifiez l'identifiant et réessayez.</div>
          <div class="pc-titre" style="margin-top:18px;">② Moyen de paiement</div>
          <div class="moyen-card" data-moyen="wave" role="button" tabindex="0" aria-pressed="false">
            <div class="moyen-logo"><img src="/assets/paiement/logo-wave.png" alt="Logo Wave" width="52" height="52" loading="lazy" /></div>
            <div style="flex:1"><div class="moyen-nom" style="color:#009ee2">Wave</div><div style="font-size:.82rem;color:var(--gris-texte);margin-top:2px;">0% de frais · Application Wave</div></div>
            <div data-radio style="width:22px;height:22px;border-radius:50%;border:2px solid var(--gris-bordure);flex-shrink:0;"></div>
          </div>
          <div class="moyen-card" data-moyen="orange" role="button" tabindex="0" aria-pressed="false">
            <div class="moyen-logo"><img src="/assets/paiement/logo-orange-money.png" alt="Logo Orange Money" width="52" height="52" loading="lazy" /></div>
            <div style="flex:1"><div class="moyen-nom" style="color:#ff6600">Orange Money</div><div style="font-size:.82rem;color:var(--gris-texte);margin-top:2px;">USSD ou application Orange Money</div></div>
            <div data-radio style="width:22px;height:22px;border-radius:50%;border:2px solid var(--gris-bordure);flex-shrink:0;"></div>
          </div>
          <div class="hidden" data-pc="instr" style="margin-top:18px;"></div>
          <div class="hidden" data-pc="saisie" style="margin-top:20px;">
            <div class="pc-titre">④ Saisir votre identifiant de transaction</div>
            <p style="font-size:.88rem;color:var(--gris-texte);margin:0 0 12px;">Trouvez l'identifiant dans le SMS reçu après votre paiement.</p>
            <div class="pc-ussd" data-pc="exemple"></div>
            <label style="font-size:.85rem;font-weight:700;display:block;margin:12px 0 6px;">Numéro de téléphone utilisé pour le paiement *</label>
            <input class="pc-champ" data-pc="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="Ex : 07 59 68 05 13" />
            <label style="font-size:.85rem;font-weight:700;display:block;margin:12px 0 6px;">Identifiant de transaction *</label>
            <input class="pc-champ" data-pc="txid" autocomplete="off" placeholder="Ex : T_5L7D2SFHD3VMTIPJ ou 987654321" style="font-family:monospace;text-transform:uppercase;letter-spacing:1px;" />
            <div class="pc-alerte">⚠️ Chaque identifiant ne peut être utilisé qu'une seule fois. Montant exact requis. Votre document est débloqué après vérification de la réception du paiement.</div>
            <button class="btn btn--primaire btn--full btn--lg" data-pc="payer">✓ Soumettre le paiement</button>
          </div>
`;
    const q = (n) => zone.querySelector(`[data-pc="${n}"]`);
    let moyenChoisi = null, derniere = null;

    function choisir(m) {
      const c = obtenir();
      moyenChoisi = m;
      zone.querySelectorAll("[data-moyen]").forEach((carte) => {
        const actif = carte.dataset.moyen === m, col = COULEURS[carte.dataset.moyen];
        carte.classList.toggle("actif", actif);
        carte.setAttribute("aria-pressed", String(actif));
        carte.style.borderColor = actif ? col : "";
        carte.style.background = actif ? col + "0d" : "";
        const radio = carte.querySelector("[data-radio]");
        radio.style.background = actif ? col : ""; radio.style.borderColor = actif ? col : "var(--gris-bordure)";
      });
      const zi = q("instr"), saisie = q("saisie");
      const infos = m && c?.paiement?.instructions?.[m];
      if (!infos) { zi.classList.add("hidden"); saisie.classList.add("hidden"); return; }
      const col = COULEURS[m], montant = Number(c.prix_fcfa).toLocaleString("fr-FR");
      const etapes = (infos.etapes || []).map((e, i) => `<div class="pc-etape"><span class="n" style="background:${col}">${i + 1}</span><div>${esc(e)}</div></div>`).join("");
      let tete = `<div class="pc-montant" style="background:${col}14;border:1px solid ${col}30;"><small>Montant à payer</small><strong style="color:${col}">${montant} FCFA</strong></div>`;
      let bouton = "";
      if (infos.modePaiement === "lien" && /^https:\/\//i.test(infos.lienPaiement || "")) {
        bouton = `<a href="${esc(infos.lienPaiement)}" target="_blank" rel="noopener" class="pc-payer" style="background:${col}">Payer ${montant} FCFA avec ${NOMS[m]} →</a>`;
      } else {
        tete = `<div class="pc-montant" style="background:${col}14;border:1px solid ${col}30;"><small>Numéro ${NOMS[m]} marchand</small><strong style="color:${col};letter-spacing:2px;">${esc(infos.numero || "Non configuré")}</strong><div style="font-size:.8rem;color:var(--gris-texte);margin-top:4px;">Montant exact : <b>${montant} FCFA</b></div></div>`;
        if (m === "orange" && infos.ussd) bouton = `<a href="tel:${encodeURIComponent(infos.ussd)}" class="pc-payer" style="background:${col}">Payer ${montant} FCFA avec ${NOMS[m]} →</a>`;
      }
      zi.innerHTML = `<div class="pc-titre">③ Effectuer le paiement</div>${tete}${etapes}${bouton}`;
      q("exemple").textContent = "Réf: " + (infos.format_exemple || "");
      zi.classList.remove("hidden"); saisie.classList.remove("hidden");
    }

    async function soumettre() {
      const c = obtenir();
      if (!c) return;
      const txId = q("txid").value.trim();
      const tel = q("tel").value.replace(/[\s.\-()]/g, "");
      if (!moyenChoisi) { toast("Choisissez d'abord un moyen de paiement.", "warn"); return; }
      if (!/^\+?\d{8,15}$/.test(tel)) { toast("Indiquez le numéro de téléphone utilisé pour le paiement.", "warn"); return; }
      if (txId.length < 5) { toast("Saisissez l'identifiant de transaction.", "warn"); return; }
      const b = q("payer"); b.disabled = true;
      try {
        const res = await window.API.CVLM.payerCommande(c.id, moyenChoisi, txId, tel);
        toast(res.message || "Identifiant reçu.", "succes");
        q("txid").value = "";
        await apres();
      } catch (e) { toast(e.message || "Erreur de paiement.", "erreur"); }
      finally { b.disabled = false; }
    }

    q("payer").onclick = soumettre;
    q("txid").oninput = (e) => { e.target.value = e.target.value.toUpperCase(); };
    zone.querySelectorAll("[data-moyen]").forEach((carte) => {
      carte.onclick = () => choisir(carte.dataset.moyen);
      carte.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choisir(carte.dataset.moyen); } };
    });

    return {
      rendre(c) {
        q("prix").textContent = Number(c.prix_fcfa).toLocaleString("fr-FR") + " FCFA";
        q("nomservice").textContent = c.nom;
        q("rejet").classList.toggle("hidden", c.etat !== "rejete");
        if (derniere !== c.id) { derniere = c.id; moyenChoisi = null; }
        choisir(moyenChoisi);
      },
    };
  }

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

        <div class="hidden" data-r="paiement"></div>

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
    paiement = monterPaiement(r("paiement"), { obtenir: () => courante, apres: async () => { await actualiser(); document.dispatchEvent(new CustomEvent("commande:maj")); } });
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
    montrer("verification", c.etat === "en_verification");
    montrer("valide", c.etat === "valide" && !valideMasque);
    montrer("doc", !(c.etat === "valide" && valideMasque));
    if (c.etat === "a_payer" || c.etat === "rejete") {
      paiement.rendre(c);
    }
    document.dispatchEvent(new CustomEvent("commande:afficher", { detail: c }));
    const masque = c.etat === "valide" && valideMasque;
    racine.classList.toggle("hidden", masque);
    if (masque) return;
    racine.scrollIntoView({ behavior: "smooth", block: "start" });
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

  window.Commande = { monter, afficher, ouvrir, lister, monterPaiement };
})();
