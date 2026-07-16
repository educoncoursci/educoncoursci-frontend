// ============================================================
//  js/auth.js — Gestion de la session utilisateur
//  Inscription, connexion, déconnexion, protection des pages,
//  persistance du token JWT en localStorage.
// ============================================================

// ── Clés localStorage ────────────────────────────────────────
const CLE_TOKEN = "ecc_token";
const CLE_USER  = "ecc_user";

// ════════════════════════════════════════════════════════════
//  Session
// ════════════════════════════════════════════════════════════

function sauvegarderSession(token, user) {
localStorage.setItem(CLE_TOKEN, token);
localStorage.setItem(CLE_USER, JSON.stringify(user));
}

function getSession() {
try {
const user = localStorage.getItem(CLE_USER);
return user ? JSON.parse(user) : null;
} catch { return null; }
}

function getToken() {
return localStorage.getItem(CLE_TOKEN) || null;
}

function estConnecte() {
return !!getToken() && !!getSession();
}

function estPremium() {
const user = getSession();
return user?.premium === true;
}

function estAdmin() {
const user = getSession();
return user?.role === "admin";
}

function supprimerSession() {
localStorage.removeItem(CLE_TOKEN);
localStorage.removeItem(CLE_USER);
}

// ════════════════════════════════════════════════════════════
//  Protection des pages
// ════════════════════════════════════════════════════════════

// Redirige vers login si non connecté
function protegerPage() {
if (!estConnecte()) {
const retour = encodeURIComponent(window.location.pathname);
window.location.href = `/auth/login.html?retour=${retour}`;
return false;
}
return true;
}

// Redirige vers accueil si non admin
function protegerPageAdmin() {
if (!estConnecte()) {
window.location.href = "/auth/login.html?retour=/admin/index.html";
return false;
}
if (!estAdmin()) {
afficherToast("Accès refusé — droits administrateur requis.", "erreur");
setTimeout(() => window.location.href = "/", 2000);
return false;
}
return true;
}

// Redirige vers boutique si non Premium
function protegerPagePremium() {
if (!estConnecte()) {
window.location.href = "/auth/login.html";
return false;
}
if (!estPremium()) {
window.location.href = "/boutique.html?raison=premium-requis";
return false;
}
return true;
}

// ════════════════════════════════════════════════════════════
//  Inscription
// ════════════════════════════════════════════════════════════

async function inscrire(nom, email, password) {
const data = await window.API.Auth.register(nom, email, password);
sauvegarderSession(data.token, data.user);
return data;
}

// ════════════════════════════════════════════════════════════
//  Connexion
// ════════════════════════════════════════════════════════════

async function connecter(email, password) {
const data = await window.API.Auth.login(email, password);
sauvegarderSession(data.token, data.user);
return data;
}

// ════════════════════════════════════════════════════════════
//  Déconnexion
// ════════════════════════════════════════════════════════════

async function deconnecter() {
try { await window.API.Auth.logout(); } catch {}
supprimerSession();
window.location.href = "/";
}

// ════════════════════════════════════════════════════════════
//  Rafraîchit le profil depuis le serveur
// ════════════════════════════════════════════════════════════

async function rafraichirProfil() {
try {
const data = await window.API.Auth.me();
const token = getToken();
sauvegarderSession(token, data.user);
return data.user;
} catch (err) {
console.warn("Impossible de rafraîchir le profil:", err.message);
return getSession();
}
}

// ════════════════════════════════════════════════════════════
//  Mise à jour de la navbar selon l'état de connexion
// ════════════════════════════════════════════════════════════

function mettreAJourNavbar() {
const user = getSession();
const zone = document.querySelector(".navbar__actions");
if (!zone) return;

if (user) {
zone.innerHTML = `<a href="/dashboard/index.html" class="btn btn--outline-vert btn--sm"> 👤 ${user.nom.split(" ")[0]} ${user.premium ? '<span class="badge-premium">⭐ Premium</span>' : ""} </a> ${estAdmin() ?`<a href="/admin/index.html" class="btn btn--bleu btn--sm">⚙️ Admin</a>`: ""} <button onclick="deconnecter()" class="btn btn--gris btn--sm">Déconnexion</button>`;
} else {
zone.innerHTML = `<a href="/auth/login.html"    class="btn btn--outline-vert btn--sm">Connexion</a> <a href="/auth/register.html" class="btn btn--primaire btn--sm">Inscription gratuite</a>`;
}
}

// ════════════════════════════════════════════════════════════
//  Formulaire d'inscription (page register.html)
// ════════════════════════════════════════════════════════════

function initFormulaireInscription() {
const form = document.getElementById("form-inscription");
if (!form) return;

form.addEventListener("submit", async (e) => {
e.preventDefault();
const btn = form.querySelector('[type="submit"]');

const nom      = form.querySelector("#nom").value.trim();
const email    = form.querySelector("#email").value.trim();
const password = form.querySelector("#password").value;
const confirm  = form.querySelector("#confirm").value;
const errDiv   = document.getElementById("erreur-inscription");

// Validations frontend
if (!nom || !email || !password) {
  errDiv.textContent = "Tous les champs sont requis.";
  errDiv.classList.remove("hidden");
  return;
}
if (password.length < 8) {
  errDiv.textContent = "Le mot de passe doit contenir au moins 8 caractères.";
  errDiv.classList.remove("hidden");
  return;
}
if (password !== confirm) {
  errDiv.textContent = "Les mots de passe ne correspondent pas.";
  errDiv.classList.remove("hidden");
  return;
}

errDiv.classList.add("hidden");
btn.classList.add("btn--chargement");
btn.disabled = true;

try {
  await inscrire(nom, email, password);
  afficherToast("Compte créé avec succès ! Bienvenue 🎓", "succes");

  // Redirige vers la page demandée ou le dashboard
  const params  = new URLSearchParams(window.location.search);
  const retour  = params.get("retour") || "/dashboard/index.html";
  setTimeout(() => window.location.href = retour, 1000);

} catch (err) {
  errDiv.textContent = err.message || "Erreur lors de la création du compte.";
  errDiv.classList.remove("hidden");
} finally {
  btn.classList.remove("btn--chargement");
  btn.disabled = false;
}

});
}

// ════════════════════════════════════════════════════════════
//  Formulaire de connexion (page login.html)
// ════════════════════════════════════════════════════════════

function initFormulaireConnexion() {
const form = document.getElementById("form-connexion");
if (!form) return;

// Message si session expirée
const params = new URLSearchParams(window.location.search);
if (params.get("session") === "expiree") {
afficherToast("Ta session a expiré. Reconnecte-toi.", "info");
}

form.addEventListener("submit", async (e) => {
e.preventDefault();
const btn    = form.querySelector('[type="submit"]');
const email  = form.querySelector("#email").value.trim();
const password = form.querySelector("#password").value;
const errDiv = document.getElementById("erreur-connexion");

if (!email || !password) {
  errDiv.textContent = "E-mail et mot de passe requis.";
  errDiv.classList.remove("hidden");
  return;
}

errDiv.classList.add("hidden");
btn.classList.add("btn--chargement");
btn.disabled = true;

try {
  await connecter(email, password);
  afficherToast("Connexion réussie !", "succes");

  const retour = params.get("retour") || "/dashboard/index.html";
  setTimeout(() => window.location.href = retour, 800);

} catch (err) {
  errDiv.textContent = err.message || "E-mail ou mot de passe incorrect.";
  errDiv.classList.remove("hidden");
} finally {
  btn.classList.remove("btn--chargement");
  btn.disabled = false;
}

});
}

// ── Exporte en global ─────────────────────────────────────────
window.Auth = {
inscrire, connecter, deconnecter, rafraichirProfil,
getSession, getToken, estConnecte, estPremium, estAdmin,
protegerPage, protegerPageAdmin, protegerPagePremium,
mettreAJourNavbar,
initFormulaireInscription, initFormulaireConnexion,
};

// Alias globaux utilisés dans les onclick HTML
window.deconnecter    = deconnecter;
window.afficherToast  = window.afficherToast || function() {};