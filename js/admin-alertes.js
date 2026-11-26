// ============================================================
//  js/admin-alertes.js — Alerte « Paiements en attente » dans l'espace admin.
//  Affiche un badge sur le lien « Paiements » du menu et prévient (toast)
//  quand un nouveau paiement arrive pendant que l'admin est sur le site.
//  Lecture seule : ne valide jamais rien. Le serveur reste maître (route admin).
// ============================================================
(function () {
  if (!window.API || !window.API.Paiement) return;
  let dernier = null;
  async function verifier() {
    try {
      const d = await window.API.Paiement.toutesTransactions({ statut: "en attente", limit: 1 });
      const n = Number(d.total) || 0;
      document.querySelectorAll('a.admin-sidebar__lien[href="/admin/paiements.html"]').forEach((a) => {
        let b = a.querySelector(".badge-attente");
        if (!n) { if (b) b.remove(); return; }
        if (!b) { b = document.createElement("span"); b.className = "badge-attente"; b.style.cssText = "margin-left:8px;background:#ef4444;color:#fff;border-radius:999px;padding:1px 8px;font-size:.72rem;font-weight:800"; a.appendChild(b); }
        b.textContent = n;
      });
      if (dernier !== null && n > dernier && window.afficherToast) window.afficherToast(`💰 ${n - dernier} nouveau(x) paiement(s) à vérifier`, "warn");
      dernier = n;
    } catch (e) { /* silencieux */ }
  }
  verifier();
  setInterval(verifier, 60000);
})();
