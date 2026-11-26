// ============================================================
//  js/paiement-notif.js — Prévient le membre connecté, dans le site, quand son
//  paiement a été confirmé ou n'a pas pu l'être. Simple bandeau d'information :
//  il n'ouvre aucun accès (le déblocage est décidé par le serveur).
// ============================================================
(function () {
  if (!window.API || !window.API.Paiement || !window.API.Paiement.mesNotifications) return;
  if (!localStorage.getItem("ecc_token")) return;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  window.API.Paiement.mesNotifications().then((d) => {
    const liste = (d && d.notifications) || [];
    if (!liste.length) return;
    const boite = document.createElement("div");
    boite.setAttribute("role", "status");
    boite.style.cssText = "position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:9999;max-width:520px;margin:0 auto;display:grid;gap:8px";
    liste.forEach((n) => {
      const ok = n.statut === "validé";
      const carte = document.createElement("div");
      carte.style.cssText = `display:flex;gap:10px;align-items:flex-start;padding:14px 16px;border-radius:14px;color:#fff;box-shadow:0 10px 28px rgba(0,0,0,.25);background:${ok ? "#14764b" : "#b45309"}`;
      carte.innerHTML = `<div style="flex:1;font-size:.92rem;line-height:1.45"><strong>${ok ? "✅ Paiement confirmé" : "⚠️ Paiement non confirmé"}</strong><br>${ok ? `Votre paiement pour <b>${esc(n.service)}</b> est confirmé.` : `Votre paiement pour <b>${esc(n.service)}</b> n'a pas pu être confirmé. Vérifiez l'identifiant de transaction et réessayez.`}</div><button type="button" aria-label="Fermer" style="background:none;border:0;color:#fff;font-size:1.3rem;line-height:1;cursor:pointer">×</button>`;
      carte.querySelector("button").onclick = () => carte.remove();
      boite.appendChild(carte);
    });
    document.body.appendChild(boite);
    setTimeout(() => boite.remove(), 20000);
    window.API.Paiement.notificationsVues(liste.map((n) => n.id)).catch(() => {});
  }).catch(() => {});
})();
