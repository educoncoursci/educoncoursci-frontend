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

async modifier(id, data) {
return apiCall(`/videos/${id}`, { method: "PATCH", body: JSON.stringify(data) });
},

async supprimer(id) {
return apiCall(`/videos/${id}`, { method: "DELETE" });
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

// Admin
async toutesTransactions(params = {}) {
const qs = new URLSearchParams(params).toString();
return apiCall(`/payment/all${qs ? "?" + qs : ""}`);
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
Auth, Concours, PDFs, Videos, QCM, Paiement, CVLM, Admin, Documents, DocumentsAdmin, Search, Emploi, AssistanceSociale,
verifierBackend, getToken,
};