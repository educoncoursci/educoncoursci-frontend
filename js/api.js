// ============================================================
//  js/api.js — Toutes les fonctions d'appel au backend
//  À importer dans chaque page : <script src="/js/api.js">
//  Utilise le token JWT stocké en localStorage.
// ============================================================

// URL de base du backend (Railway en prod, localhost en dev)
const API_URL = window.location.hostname === "localhost"
? "http://localhost:3000/api"
: "https://educoncoursci-backend-production.up.railway.app/api";

// ── Récupère le token JWT stocké ─────────────────────────────
function getToken() {
return localStorage.getItem("ecc_token") || null;
}

// ── Headers avec authentification ────────────────────────────
function headersAuth() {
const token = getToken();
return {
"Content-Type": "application/json",
...(token ? { Authorization: `Bearer ${token}` } : {}),
};
}

// ── Fonction générique d'appel API ────────────────────────────
async function apiCall(endpoint, options = {}) {
try {
const response = await fetch(`${API_URL}${endpoint}`, {
headers: headersAuth(),
...options,
});

const data = await response.json();

// Token expiré → déconnexion automatique
if (response.status === 401) {
  localStorage.removeItem("ecc_token");
  localStorage.removeItem("ecc_user");
  if (!window.location.pathname.includes("/auth/")) {
    window.location.href = "/auth/login.html?session=expiree";
  }
  throw new Error(data.error || "Session expirée.");
}

if (!response.ok) {
  throw new Error(data.error || `Erreur ${response.status}`);
}

return data;

} catch (err) {
// Erreur réseau (backend inaccessible)
if (err.name === "TypeError" && err.message.includes("fetch")) {
throw new Error("Impossible de contacter le serveur. Vérifie ta connexion.");
}
throw err;
}
}

// ════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════

const Auth = {
async register(nom, email, password) {
return apiCall("/auth/register", {
method: "POST",
body: JSON.stringify({ nom, email, password }),
});
},

async login(email, password) {
return apiCall("/auth/login", {
method: "POST",
body: JSON.stringify({ email, password }),
});
},

async logout() {
return apiCall("/auth/logout", { method: "POST" });
},

async me() {
return apiCall("/auth/me");
},

async changePassword(ancienPassword, nouveauPassword) {
return apiCall("/auth/change-password", {
method: "POST",
body: JSON.stringify({ ancienPassword, nouveauPassword }),
});
},

async forgotPassword(email) {
return apiCall("/auth/forgot-password", {
method: "POST",
body: JSON.stringify({ email }),
});
},

async verifierLogin2FA(tempToken, { token, codeRecuperation }) {
return apiCall("/auth/2fa/verify-login", {
method: "POST",
body: JSON.stringify({ tempToken, token, codeRecuperation }),
});
},

async setup2FA() {
return apiCall("/auth/2fa/setup", { method: "POST" });
},

async confirmer2FA(token) {
return apiCall("/auth/2fa/confirm", {
method: "POST",
body: JSON.stringify({ token }),
});
},

async desactiver2FA(password) {
return apiCall("/auth/2fa/disable", {
method: "POST",
body: JSON.stringify({ password }),
});
},

async resetPassword(token, password) {
return apiCall("/auth/reset-password", {
method: "POST",
body: JSON.stringify({ token, password }),
});
},
};

// ════════════════════════════════════════════════════════════
//  CONCOURS
// ════════════════════════════════════════════════════════════

const Concours = {
async liste(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/concours${qs ? "?" + qs : ""}`);
},

async detail(id) {
return apiCall(`/concours/${id}`);
},

async ouverts() {
return apiCall("/concours/ouverts");
},

// Admin
async creer(data) {
return apiCall("/concours", {
method: "POST",
body: JSON.stringify(data),
});
},

async modifier(id, data) {
return apiCall(`/concours/${id}`, {
method: "PATCH",
body: JSON.stringify(data),
});
},

async supprimer(id) {
return apiCall(`/concours/${id}`, { method: "DELETE" });
},
};

// ════════════════════════════════════════════════════════════
//  Concours — Sources RSS & file de validation (Lot 18)
//  Détection automatique de nouveaux concours : le scraper dépose
//  des suggestions, un admin les approuve ou les rejette ici.
// ════════════════════════════════════════════════════════════
const ConcoursSources = {
async liste() {
return apiCall("/admin/concours-sources");
},
async ajouter(nom, url) {
return apiCall("/admin/concours-sources", {
method: "POST",
body: JSON.stringify({ nom, url }),
});
},
async basculer(id, actif) {
return apiCall(`/admin/concours-sources/${id}`, {
method: "PATCH",
body: JSON.stringify({ actif }),
});
},
async supprimer(id) {
return apiCall(`/admin/concours-sources/${id}`, { method: "DELETE" });
},
async declencherDetection() {
return apiCall("/admin/concours-sources/detecter", { method: "POST" });
},
async suggestions() {
return apiCall("/admin/concours-suggestions");
},
async approuverSuggestion(id, data) {
return apiCall(`/admin/concours-suggestions/${id}/approuver`, {
method: "POST",
body: JSON.stringify(data),
});
},
async rejeterSuggestion(id) {
return apiCall(`/admin/concours-suggestions/${id}/rejeter`, { method: "POST" });
},
};

// ════════════════════════════════════════════════════════════
//  PDFs
// ════════════════════════════════════════════════════════════

const PDFs = {
async liste(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/pdfs${qs ? "?" + qs : ""}`);
},

async detail(id) {
return apiCall(`/pdfs/${id}`);
},

// Téléchargement (redirige vers l'URL du fichier)
telecharger(id) {
const token = getToken();
window.open(
`${API_URL}/pdfs/${id}/download?token=${token || ""}`,
"_blank"
);
},

// Admin — upload avec FormData (pas JSON)
async uploader(formData) {
const token = getToken();
const response = await fetch(`${API_URL}/pdfs`, {
method: "POST",
headers: { Authorization: `Bearer ${token}` }, // pas Content-Type (multipart)
body: formData,
});
const data = await response.json();
if (!response.ok) throw new Error(data.error || "Erreur upload");
return data;
},

async modifier(id, data) {
return apiCall(`/pdfs/${id}`, {
method: "PATCH",
body: JSON.stringify(data),
});
},

async supprimer(id) {
return apiCall(`/pdfs/${id}`, { method: "DELETE" });
},
};

// ════════════════════════════════════════════════════════════
//  VIDÉOS
// ════════════════════════════════════════════════════════════

const Videos = {
async liste(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/videos${qs ? "?" + qs : ""}`);
},

async detail(id) {
return apiCall(`/videos/${id}`);
},

async creer(data) {
return apiCall("/videos", { method: "POST", body: JSON.stringify(data) });
},

// Admin — upload d'un fichier vidéo avec FormData (pas JSON)
async uploader(formData) {
const token = getToken();
const response = await fetch(`${API_URL}/videos`, {
method: "POST",
headers: { Authorization: `Bearer ${token}` }, // pas Content-Type (multipart)
body: formData,
});
const data = await response.json();
if (!response.ok) throw new Error(data.error || "Erreur upload");
return data;
},

async modifier(id, data) {
return apiCall(`/videos/${id}`, { method: "PATCH", body: JSON.stringify(data) });
},

async supprimer(id) {
return apiCall(`/videos/${id}`, { method: "DELETE" });
},
};

// ════════════════════════════════════════════════════════════
//  ACTUALITÉS (carrousel dynamique, alimenté en continu)
// ════════════════════════════════════════════════════════════

const Actualites = {
// Données du carrousel (public) — pas besoin d'être connecté
async carrousel(limit = 8) {
return apiCall(`/actualites/carrousel?limit=${limit}`);
},

async liste(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/actualites${qs ? "?" + qs : ""}`);
},

async creer(data) {
return apiCall("/actualites", { method: "POST", body: JSON.stringify(data) });
},

async modifier(id, data) {
return apiCall(`/actualites/${id}`, { method: "PATCH", body: JSON.stringify(data) });
},

async supprimer(id) {
return apiCall(`/actualites/${id}`, { method: "DELETE" });
},

// Force une synchronisation immédiate du flux RSS (admin)
async actualiser() {
return apiCall("/actualites/actualiser", { method: "POST" });
},
};

// ════════════════════════════════════════════════════════════
//  QCM
// ════════════════════════════════════════════════════════════

const QCM = {
async liste(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/qcm${qs ? "?" + qs : ""}`);
},

async detail(id) {
return apiCall(`/qcm/${id}`);
},

async soumettre(id, reponses) {
return apiCall(`/qcm/${id}/score`, {
method: "POST",
body: JSON.stringify({ reponses }),
});
},

async soumettreExamenBlanc(score, total) {
return apiCall(`/qcm/examen-blanc/score`, {
method: "POST",
body: JSON.stringify({ score, total }),
});
},

async creer(data) {
return apiCall("/qcm", { method: "POST", body: JSON.stringify(data) });
},

async modifier(id, data) {
return apiCall(`/qcm/${id}`, { method: "PATCH", body: JSON.stringify(data) });
},

async supprimer(id) {
return apiCall(`/qcm/${id}`, { method: "DELETE" });
},
};

// ════════════════════════════════════════════════════════════
//  PAIEMENT
// ════════════════════════════════════════════════════════════

const Vitrine = {
async stats() {
return apiCall("/vitrine/stats");
},
async inscrireNewsletter(email) {
return apiCall("/vitrine/newsletter", {
method: "POST",
body: JSON.stringify({ email }),
});
},
async temoignages() {
return apiCall("/vitrine/temoignages");
},
};

const Progression = {
async monTableauDeBord() {
return apiCall("/progression");
},
async classement() {
return apiCall("/progression/classement");
},
async certificatBadge(badgeId) {
const token = getToken();
const response = await fetch(`${API_URL}/progression/certificat/badge/${badgeId}`, {
headers: { Authorization: `Bearer ${token}` },
});
if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération du certificat");
}
const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `certificat-${badgeId}.pdf`;
a.click();
URL.revokeObjectURL(url);
},
async certificatExamen(scoreId) {
const token = getToken();
const response = await fetch(`${API_URL}/progression/certificat/examen/${scoreId}`, {
headers: { Authorization: `Bearer ${token}` },
});
if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération du certificat");
}
const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `certificat-examen-${scoreId}.pdf`;
a.click();
URL.revokeObjectURL(url);
},
};

const CandidaturesConcours = {
async mesCandidatures() {
return apiCall("/candidatures-concours");
},
async demarrer(concoursId) {
return apiCall("/candidatures-concours", {
method: "POST",
body: JSON.stringify({ concoursId }),
});
},
async avancer(id, statut, notes) {
return apiCall(`/candidatures-concours/${id}`, {
method: "PATCH",
body: JSON.stringify({ statut, notes }),
});
},
async supprimer(id) {
return apiCall(`/candidatures-concours/${id}`, { method: "DELETE" });
},
};

const Users = {
async scores(id) {
return apiCall(`/users/${id}/scores`);
},
async modifier(id, donnees) {
return apiCall(`/users/${id}`, { method: "PATCH", body: JSON.stringify(donnees) });
},
async favoris(id) {
return apiCall(`/users/${id}/favoris`);
},
async definirFavoris(id, favoris) {
return apiCall(`/users/${id}/favoris`, {
method: "PATCH",
body: JSON.stringify({ favoris }),
});
},
async definirPhotoUrl(id, photoUrl) {
return apiCall(`/users/${id}/photo`, {
method: "PATCH",
body: JSON.stringify({ photoUrl }),
});
},
async uploaderPhoto(id, formData) {
const token = getToken();
const response = await fetch(`${API_URL}/users/${id}/photo/upload`, {
method: "POST",
headers: { Authorization: `Bearer ${token}` }, // pas Content-Type (multipart)
body: formData,
});
const data = await response.json();
if (!response.ok) throw new Error(data.error || "Erreur upload");
return data;
},
};

const Alertes = {
async mesPreferences() {
return apiCall("/alertes/preferences");
},
async definirPreferences({ canalEmail, canalWhatsapp, whatsappNumero, canalSms, smsNumero, canalPush, categories }) {
return apiCall("/alertes/preferences", {
method: "PUT",
body: JSON.stringify({ canalEmail, canalWhatsapp, whatsappNumero, canalSms, smsNumero, canalPush, categories }),
});
},
};

const Push = {
async vapidKey() {
return apiCall("/push/vapid-key");
},
async subscribe(subscription) {
return apiCall("/push/subscribe", {
method: "POST",
body: JSON.stringify({ subscription }),
});
},
async unsubscribe(endpoint) {
return apiCall("/push/unsubscribe", {
method: "POST",
body: JSON.stringify({ endpoint }),
});
},
};

const Eligibilite = {
async verifier({ age, sexe, diplomeId }) {
return apiCall("/eligibilite", {
method: "POST",
body: JSON.stringify({ age, sexe, diplomeId }),
});
},
};

const Referentiels = {
async structures() {
return apiCall("/referentiels/structures");
},
async creerStructure(donnees) {
return apiCall("/referentiels/structures", { method: "POST", body: JSON.stringify(donnees) });
},
async modifierStructure(id, donnees) {
return apiCall(`/referentiels/structures/${id}`, { method: "PATCH", body: JSON.stringify(donnees) });
},
async supprimerStructure(id) {
return apiCall(`/referentiels/structures/${id}`, { method: "DELETE" });
},

async matieres() {
return apiCall("/referentiels/matieres");
},
async creerMatiere(donnees) {
return apiCall("/referentiels/matieres", { method: "POST", body: JSON.stringify(donnees) });
},
async supprimerMatiere(id) {
return apiCall(`/referentiels/matieres/${id}`, { method: "DELETE" });
},

async categories() {
return apiCall("/referentiels/categories");
},
async creerCategorie(donnees) {
return apiCall("/referentiels/categories", { method: "POST", body: JSON.stringify(donnees) });
},
async supprimerCategorie(id) {
return apiCall(`/referentiels/categories/${id}`, { method: "DELETE" });
},

async diplomes() {
return apiCall("/referentiels/diplomes");
},
async creerDiplome(donnees) {
return apiCall("/referentiels/diplomes", { method: "POST", body: JSON.stringify(donnees) });
},
async supprimerDiplome(id) {
return apiCall(`/referentiels/diplomes/${id}`, { method: "DELETE" });
},
};

const Paiement = {
async plans(plan = null) {
const qs = plan ? `?plan=${encodeURIComponent(plan)}` : "";
return apiCall(`/payment/plans${qs}`);
},

async verifier(txId, moyen, plan) {
return apiCall("/payment/verify", {
method: "POST",
body: JSON.stringify({ txId, moyen, plan }),
});
},

async historique() {
return apiCall("/payment/history");
},

async initierCinetPay(plan) {
return apiCall("/payment/cinetpay/initier", {
method: "POST",
body: JSON.stringify({ plan }),
});
},

// Admin
async toutesTransactions(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/payment/all${qs ? "?" + qs : ""}`);
},

async validerTransaction(id) {
return apiCall(`/payment/valider/${id}`, { method: "POST" });
},

async rejeterTransaction(id) {
return apiCall(`/payment/rejeter/${id}`, { method: "POST" });
},

async resilier(userId) {
return apiCall("/payment/resiliation", {
method: "POST",
body: JSON.stringify({ userId }),
});
},
};

// ════════════════════════════════════════════════════════════
//  CV / LM
// ════════════════════════════════════════════════════════════

const AssistanceSociale = {
async urgences() {
return apiCall("/assistance-sociale/urgences");
},

async structures(categorie = null) {
const qs = categorie ? `?categorie=${encodeURIComponent(categorie)}` : "";
return apiCall(`/assistance-sociale/structures${qs}`);
},

async typesDocuments() {
return apiCall("/assistance-sociale/documents/types");
},

async genererDocument(donnees) {
return apiCall("/assistance-sociale/documents/generate", {
method: "POST",
body: JSON.stringify(donnees),
});
},

async exporterPDF(contenu, type) {
const token = getToken();
const response = await fetch(`${API_URL}/assistance-sociale/documents/pdf`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ contenu, type }),
});
if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération PDF");
}
const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `${type}.pdf`;
a.click();
URL.revokeObjectURL(url);
},

async exporterDOCX(contenu, type) {
const token = getToken();
const response = await fetch(`${API_URL}/assistance-sociale/documents/docx`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ contenu, type }),
});
if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération Word");
}
const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `${type}.docx`;
a.click();
URL.revokeObjectURL(url);
},

async demanderAssistant(message, historique = []) {
return apiCall("/assistance-sociale/assistant", {
method: "POST",
body: JSON.stringify({ message, historique }),
});
},
};

const Marketplace = {
async offres(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/marketplace/offres${qs ? "?" + qs : ""}`);
},
async detail(id) {
return apiCall(`/marketplace/offres/${id}`);
},
async contacter(id, data) {
return apiCall(`/marketplace/offres/${id}/contact`, {
method: "POST",
body: JSON.stringify(data),
});
},
};

const Messages = {
async conversations() {
return apiCall("/messages/conversations");
},
async demarrer(destinataireId) {
return apiCall("/messages/conversations", {
method: "POST",
body: JSON.stringify({ destinataireId }),
});
},
async detail(conversationId) {
return apiCall(`/messages/conversations/${conversationId}`);
},
async envoyer(conversationId, contenu) {
return apiCall(`/messages/conversations/${conversationId}/messages`, {
method: "POST",
body: JSON.stringify({ contenu }),
});
},
async nonLus() {
return apiCall("/messages/non-lus");
},
};

const Forum = {
async sujets(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/forum/sujets${qs ? "?" + qs : ""}`);
},
async detailSujet(id) {
return apiCall(`/forum/sujets/${id}`);
},
async creerSujet(data) {
return apiCall("/forum/sujets", { method: "POST", body: JSON.stringify(data) });
},
async supprimerSujet(id) {
return apiCall(`/forum/sujets/${id}`, { method: "DELETE" });
},
async epinglerSujet(id, epingle) {
return apiCall(`/forum/sujets/${id}/epingler`, {
method: "PATCH",
body: JSON.stringify({ epingle }),
});
},
async repondre(sujetId, contenu) {
return apiCall(`/forum/sujets/${sujetId}/reponses`, {
method: "POST",
body: JSON.stringify({ contenu }),
});
},
async supprimerReponse(id) {
return apiCall(`/forum/reponses/${id}`, { method: "DELETE" });
},
};

const AssistantConcours = {
async demander(message, historique = [], concoursId = null) {
return apiCall("/assistant-concours", {
method: "POST",
body: JSON.stringify({ message, historique, concoursId }),
});
},
};

const Emploi = {
async liste(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/emploi${qs ? "?" + qs : ""}`);
},

async detail(id) {
return apiCall(`/emploi/${id}`);
},

async postuler(id, data) {
return apiCall(`/emploi/${id}/postuler`, {
method: "POST",
body: JSON.stringify(data),
});
},

async mesCandidatures() {
return apiCall("/emploi/mes-candidatures");
},

async creerAlerte(data) {
return apiCall("/emploi/alertes", {
method: "POST",
body: JSON.stringify(data),
});
},

async mesAlertes() {
return apiCall("/emploi/alertes");
},

async supprimerAlerte(id) {
return apiCall(`/emploi/alertes/${id}`, { method: "DELETE" });
},

// Admin
async creer(data) {
return apiCall("/emploi", {
method: "POST",
body: JSON.stringify(data),
});
},

async modifier(id, data) {
return apiCall(`/emploi/${id}`, {
method: "PUT",
body: JSON.stringify(data),
});
},

async supprimer(id) {
return apiCall(`/emploi/${id}`, { method: "DELETE" });
},

async candidaturesRecues(id) {
return apiCall(`/emploi/${id}/candidatures`);
},

async actualiser() {
return apiCall("/emploi/actualiser", { method: "POST" });
},
};

const Search = {
async rechercher(terme) {
return apiCall(`/search?q=${encodeURIComponent(terme)}`);
},
};

const Documents = {
async types() {
return apiCall("/documents/types");
},

async generer(donnees) {
return apiCall("/documents/generate", {
method: "POST",
body: JSON.stringify(donnees),
});
},

async exporterPDF(contenu, type) {
const token = getToken();
const response = await fetch(`${API_URL}/documents/pdf`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ contenu, type }),
});

if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération PDF");
}

const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `${type}.pdf`;
a.click();
URL.revokeObjectURL(url);

},

async exporterDOCX(contenu, type) {
const token = getToken();
const response = await fetch(`${API_URL}/documents/docx`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ contenu, type }),
});

if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération Word");
}

const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `${type}.docx`;
a.click();
URL.revokeObjectURL(url);

},
};

const DocumentsAdmin = {
async types() {
return apiCall("/documents-admin/types");
},

async generer(donnees) {
return apiCall("/documents-admin/generate", {
method: "POST",
body: JSON.stringify(donnees),
});
},

async exporterPDF(contenu, type) {
const token = getToken();
const response = await fetch(`${API_URL}/documents-admin/pdf`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ contenu, type }),
});

if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération PDF");
}

const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `${type}.pdf`;
a.click();
URL.revokeObjectURL(url);

},

async exporterDOCX(contenu, type) {
const token = getToken();
const response = await fetch(`${API_URL}/documents-admin/docx`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ contenu, type }),
});

if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération Word");
}

const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `${type}.docx`;
a.click();
URL.revokeObjectURL(url);

},
};

const CVLM = {
async genererCV(data) {
return apiCall("/cv/generate", {
method: "POST",
body: JSON.stringify(data),
});
},

async genererLM(data) {
return apiCall("/cv/lm/generate", {
method: "POST",
body: JSON.stringify(data),
});
},

async modeles() {
return apiCall("/cv/modeles");
},

async exporterPDF(contenu, type, data, style = "simple", modeleId = null) {
const token = getToken();
const response = await fetch(`${API_URL}/cv/pdf`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ contenu, type, data, style, modeleId }),
});

if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération PDF");
}

// Déclenche le téléchargement du PDF
const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `${type === "cv" ? "CV" : "LM"}_${data?.nom || "document"}.pdf`;
a.click();
URL.revokeObjectURL(url);

},

async exporterDOCX(contenu, type, data, modeleId = null) {
const token = getToken();
const response = await fetch(`${API_URL}/cv/docx`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({ contenu, type, data, modeleId }),
});

if (!response.ok) {
  const err = await response.json();
  throw new Error(err.error || "Erreur génération Word");
}

const blob = await response.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = `${type === "cv" ? "CV" : "LM"}_${data?.nom || "document"}.docx`;
a.click();
URL.revokeObjectURL(url);

},

async analyserATS(contenuCV, offreEmploi = null) {
return apiCall("/cv/analyse-ats", {
method: "POST",
body: JSON.stringify({ contenuCV, offreEmploi }),
});
},

async adapterOffre(contenuCV, offreEmploi) {
return apiCall("/cv/adapter-offre", {
method: "POST",
body: JSON.stringify({ contenuCV, offreEmploi }),
});
},

async conseilRevision(matiere, score, total) {
return apiCall("/cv/conseil", {
method: "POST",
body: JSON.stringify({ matiere, score, total }),
});
},
};

// ════════════════════════════════════════════════════════════
//  ADMIN
// ════════════════════════════════════════════════════════════

const Admin = {
async stats() {
return apiCall("/admin/stats");
},

async users(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/admin/users${qs ? "?" + qs : ""}`);
},

async abonnes() {
return apiCall("/admin/abonnes");
},

async updateUser(id, data) {
return apiCall(`/admin/users/${id}`, {
method: "PATCH",
body: JSON.stringify(data),
});
},

async deleteUser(id) {
return apiCall(`/admin/users/${id}`, { method: "DELETE" });
},

async scores(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/admin/scores${qs ? "?" + qs : ""}`);
},

exportUsers() {
const token = getToken();
window.open(`${API_URL}/admin/export/users?token=${token}`, "_blank");
},

// Notifications
async envoyerNotif(titre, message, cible, urgent = false) {
return apiCall("/admin/notifs/send", {
method: "POST",
body: JSON.stringify({ titre, message, cible, urgent }),
});
},

async alerteConcours(concoursId, cible = "tous") {
return apiCall("/admin/notifs/alerte-concours", {
method: "POST",
body: JSON.stringify({ concoursId, cible }),
});
},

async envoyerRappels() {
return apiCall("/admin/notifs/rappels", { method: "POST" });
},

async fileWhatsapp() {
return apiCall("/admin/notifs/whatsapp-file");
},

async fileSms() {
return apiCall("/admin/notifs/sms-file");
},

async marquerSmsEnvoye(id) {
return apiCall(`/admin/notifs/sms-file/${id}`, { method: "PATCH" });
},

async journal(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/admin/journal${qs ? "?" + qs : ""}`);
},

async marquerWhatsappEnvoye(id) {
return apiCall(`/admin/notifs/whatsapp-file/${id}`, { method: "PATCH" });
},

async historiqueNotifs() {
return apiCall("/admin/notifs/history");
},
};

// ════════════════════════════════════════════════════════════
//  SANTÉ (vérifier que le backend tourne)
// ════════════════════════════════════════════════════════════

async function verifierBackend() {
try {
const data = await apiCall("/health");
return data.status === "ok";
} catch {
return false;
}
}

// ── Exporte tout en global (utilisable dans les pages HTML) ──
window.API = {
Auth, Concours, ConcoursSources, PDFs, Videos, QCM, Paiement, CVLM, Admin, Documents, DocumentsAdmin, Search, Emploi, AssistanceSociale, Actualites, Referentiels, Eligibilite, Alertes, Users, Progression, Vitrine, CandidaturesConcours, AssistantConcours, Push, Forum, Marketplace, Messages,
verifierBackend, getToken,
};